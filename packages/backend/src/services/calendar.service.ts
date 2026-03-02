import { prisma } from '../config/database.js';
import { LeaveStatus, LeaveType } from '../../generated/prisma/index.js';

export async function getMonthLeaves(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // dernier jour du mois

  return prisma.leaveRequest.findMany({
    where: {
      status: { in: [LeaveStatus.approved, LeaveStatus.pending] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
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
    orderBy: { startDate: 'asc' },
  });
}

export async function getTodayAbsences() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      status: LeaveStatus.approved,
      startDate: { lte: today },
      endDate: { gte: today },
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
  });

  const out = leaves.filter((l) => l.leaveType !== LeaveType.remote);
  const remote = leaves.filter((l) => l.leaveType === LeaveType.remote);

  return { out, remote };
}
