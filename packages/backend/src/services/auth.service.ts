import { prisma } from '../config/database.js';
import { comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  const tokenPayload = {
    userId: user.id,
    role: user.role,
    departmentId: user.departmentId,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      avatarColor: user.avatarColor,
      role: user.role,
      department: user.department.name,
      departmentId: user.departmentId,
    },
  };
}

export async function refresh(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Utilisateur introuvable ou désactivé');
    }

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
      departmentId: user.departmentId,
    });

    return { accessToken };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Token de rafraîchissement invalide ou expiré');
  }
}
