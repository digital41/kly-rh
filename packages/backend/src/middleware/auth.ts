import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        departmentId: number;
      };
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  try {
    const token = header.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Token invalide ou expiré'));
  }
}
