import { prisma } from '../config/database.js';
import { ForbiddenError } from '../utils/errors.js';

export async function getUserBalances(userId: number) {
  const currentYear = new Date().getFullYear();

  return prisma.leaveBalance.findMany({
    where: {
      userId,
      year: currentYear,
    },
    orderBy: { leaveType: 'asc' },
  });
}

export async function getBalancesByUserId(
  requestedUserId: number,
  requestingUserId: number,
  requestingRole: string
) {
  // Vérifier que le demandeur est manager de cet utilisateur ou admin
  if (requestingRole !== 'admin') {
    const targetUser = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: { managerId: true },
    });

    if (!targetUser || targetUser.managerId !== requestingUserId) {
      throw new ForbiddenError('Vous ne pouvez consulter que les soldes de votre équipe');
    }
  }

  const currentYear = new Date().getFullYear();

  return prisma.leaveBalance.findMany({
    where: {
      userId: requestedUserId,
      year: currentYear,
    },
    orderBy: { leaveType: 'asc' },
  });
}
