import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email et mot de passe requis');
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError('Token de rafraîchissement requis');
    }

    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response, _next: NextFunction) {
  res.status(204).send();
}
