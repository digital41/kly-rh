import type { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service.js';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await profileService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { firstName, lastName } = req.body;
    const updated = await profileService.updateProfile(userId, { firstName, lastName });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
