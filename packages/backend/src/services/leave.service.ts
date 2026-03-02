import { prisma } from '../config/database.js';
import { LeaveStatus, LeaveType } from '../../generated/prisma/index.js';
import { countBusinessDays } from '../utils/business-days.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

interface CreateLeaveInput {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  isHalfDay?: boolean;
  halfDayPeriod?: 'morning' | 'afternoon';
  note?: string;
}

export async function getUserLeaves(userId: number, status?: string) {
  const where: Record<string, unknown> = { userId };

  if (status && Object.values(LeaveStatus).includes(status as LeaveStatus)) {
    where.status = status;
  }

  return prisma.leaveRequest.findMany({
    where,
    include: {
      reviewer: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createLeave(userId: number, input: CreateLeaveInput) {
  const { leaveType, startDate, endDate, isHalfDay, halfDayPeriod, note } = input;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new BadRequestError('Dates invalides');
  }

  if (start > end) {
    throw new BadRequestError('La date de début doit être antérieure à la date de fin');
  }

  // Vérifier le chevauchement avec les demandes existantes
  const overlap = await prisma.leaveRequest.findFirst({
    where: {
      userId,
      status: { in: [LeaveStatus.pending, LeaveStatus.approved] },
      startDate: { lte: end },
      endDate: { gte: start },
    },
  });

  if (overlap) {
    throw new BadRequestError('Une demande existe déjà pour cette période');
  }

  // Récupérer les jours fériés pour le calcul
  const holidays = await prisma.holiday.findMany({
    where: {
      date: { gte: start, lte: end },
    },
  });

  let totalDays = countBusinessDays(start, end, holidays.map((h) => h.date));

  if (isHalfDay) {
    totalDays = 0.5;
  }

  if (totalDays <= 0) {
    throw new BadRequestError('La période sélectionnée ne contient aucun jour ouvré');
  }

  // Vérifier le solde (sauf formation qui est illimité)
  if (leaveType !== LeaveType.training) {
    const currentYear = new Date().getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: {
        userId_leaveType_year: {
          userId,
          leaveType,
          year: currentYear,
        },
      },
    });

    if (!balance) {
      throw new BadRequestError('Aucun solde trouvé pour ce type de congé');
    }

    const remaining = Number(balance.totalDays) - Number(balance.usedDays);
    if (totalDays > remaining) {
      throw new BadRequestError(
        `Solde insuffisant. Il vous reste ${remaining} jour(s) disponible(s)`
      );
    }
  }

  return prisma.leaveRequest.create({
    data: {
      userId,
      leaveType,
      startDate: start,
      endDate: end,
      isHalfDay: isHalfDay ?? false,
      halfDayPeriod: halfDayPeriod ?? null,
      totalDays,
      note: note ?? null,
    },
  });
}

export async function getPendingForManager(managerId: number) {
  // Récupérer les membres de l'équipe du manager
  const teamMembers = await prisma.user.findMany({
    where: { managerId },
    select: { id: true },
  });

  const teamIds = teamMembers.map((m) => m.id);

  return prisma.leaveRequest.findMany({
    where: {
      userId: { in: teamIds },
      status: LeaveStatus.pending,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          avatarColor: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function approveLeave(leaveId: number, reviewerId: number) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { user: true },
  });

  if (!leave) {
    throw new NotFoundError('Demande de congé');
  }

  if (leave.status !== LeaveStatus.pending) {
    throw new BadRequestError('Seules les demandes en attente peuvent être approuvées');
  }

  // Vérifier que le reviewer est bien le manager
  if (leave.user.managerId !== reviewerId) {
    throw new ForbiddenError('Vous ne pouvez approuver que les demandes de votre équipe');
  }

  const currentYear = new Date().getFullYear();

  return prisma.$transaction(async (tx) => {
    // Mettre à jour la demande
    const updated = await tx.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status: LeaveStatus.approved,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // Mettre à jour le solde (sauf formation)
    if (leave.leaveType !== LeaveType.training) {
      await tx.leaveBalance.update({
        where: {
          userId_leaveType_year: {
            userId: leave.userId,
            leaveType: leave.leaveType,
            year: currentYear,
          },
        },
        data: {
          usedDays: {
            increment: Number(leave.totalDays),
          },
        },
      });
    }

    // Créer une notification pour l'employé
    const reviewer = await tx.user.findUnique({
      where: { id: reviewerId },
      select: { firstName: true, lastName: true },
    });

    await tx.notification.create({
      data: {
        userId: leave.userId,
        title: 'Demande approuvée',
        body: `Votre demande de congé du ${leave.startDate.toLocaleDateString('fr-FR')} au ${leave.endDate.toLocaleDateString('fr-FR')} a été approuvée par ${reviewer?.firstName} ${reviewer?.lastName}`,
        type: 'leave_approved',
        referenceId: leaveId,
      },
    });

    return updated;
  });
}

export async function rejectLeave(leaveId: number, reviewerId: number, reviewComment?: string) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { user: true },
  });

  if (!leave) {
    throw new NotFoundError('Demande de congé');
  }

  if (leave.status !== LeaveStatus.pending) {
    throw new BadRequestError('Seules les demandes en attente peuvent être refusées');
  }

  if (leave.user.managerId !== reviewerId) {
    throw new ForbiddenError('Vous ne pouvez refuser que les demandes de votre équipe');
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status: LeaveStatus.rejected,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment ?? null,
      },
    });

    const reviewer = await tx.user.findUnique({
      where: { id: reviewerId },
      select: { firstName: true, lastName: true },
    });

    await tx.notification.create({
      data: {
        userId: leave.userId,
        title: 'Demande refusée',
        body: `Votre demande de congé du ${leave.startDate.toLocaleDateString('fr-FR')} au ${leave.endDate.toLocaleDateString('fr-FR')} a été refusée par ${reviewer?.firstName} ${reviewer?.lastName}${reviewComment ? `. Motif : ${reviewComment}` : ''}`,
        type: 'leave_rejected',
        referenceId: leaveId,
      },
    });

    return updated;
  });
}

export async function cancelLeave(leaveId: number, userId: number) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
  });

  if (!leave) {
    throw new NotFoundError('Demande de congé');
  }

  if (leave.userId !== userId) {
    throw new ForbiddenError('Vous ne pouvez annuler que vos propres demandes');
  }

  if (leave.status !== LeaveStatus.pending) {
    throw new BadRequestError('Seules les demandes en attente peuvent être annulées');
  }

  return prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status: LeaveStatus.cancelled,
    },
  });
}
