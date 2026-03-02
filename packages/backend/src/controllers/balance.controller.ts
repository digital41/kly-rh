import type { Request, Response, NextFunction } from 'express';
import * as balanceService from '../services/balance.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function getMyBalances(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const balances = await balanceService.getUserBalances(userId);
    res.json(balances);
  } catch (error) {
    next(error);
  }
}

export async function getUserBalances(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedUserId = parseInt(req.params.userId as string, 10);

    if (isNaN(requestedUserId)) {
      throw new BadRequestError('Identifiant utilisateur invalide');
    }

    const balances = await balanceService.getBalancesByUserId(
      requestedUserId,
      req.user!.userId,
      req.user!.role
    );
    res.json(balances);
  } catch (error) {
    next(error);
  }
}
