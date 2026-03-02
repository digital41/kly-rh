import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      department: { select: { name: true } },
      manager: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('Utilisateur');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    avatarColor: user.avatarColor,
    role: user.role,
    department: user.department.name,
    departmentId: user.departmentId,
    managerId: user.managerId,
    manager: user.manager,
    hireDate: user.hireDate,
    createdAt: user.createdAt,
  };
}

export async function updateProfile(
  userId: number,
  data: { firstName?: string; lastName?: string }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('Utilisateur');
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      avatarColor: true,
      role: true,
      departmentId: true,
      hireDate: true,
    },
  });
}
