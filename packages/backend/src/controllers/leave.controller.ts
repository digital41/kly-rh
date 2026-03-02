import type { Request, Response, NextFunction } from 'express';
import * as leaveService from '../services/leave.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function getUserLeaves(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const status = req.query.status as string | undefined;
    const leaves = await leaveService.getUserLeaves(userId, status);
    res.json(leaves);
  } catch (error) {
    next(error);
  }
}

export async function createLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { leaveType, startDate, endDate, isHalfDay, halfDayPeriod, note } = req.body;

    if (!leaveType || !startDate || !endDate) {
      throw new BadRequestError('Type de congé, date de début et date de fin requis');
    }

    const leave = await leaveService.createLeave(userId, {
      leaveType,
      startDate,
      endDate,
      isHalfDay,
      halfDayPeriod,
      note,
    });

    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
}

export async function getPendingLeaves(req: Request, res: Response, next: NextFunction) {
  try {
    const managerId = req.user!.userId;
    const leaves = await leaveService.getPendingForManager(managerId);
    res.json(leaves);
  } catch (error) {
    next(error);
  }
}

export async function approveLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const leaveId = parseInt(req.params.id as string, 10);
    const reviewerId = req.user!.userId;

    if (isNaN(leaveId)) {
      throw new BadRequestError('Identifiant de demande invalide');
    }

    const leave = await leaveService.approveLeave(leaveId, reviewerId);
    res.json(leave);
  } catch (error) {
    next(error);
  }
}

export async function rejectLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const leaveId = parseInt(req.params.id as string, 10);
    const reviewerId = req.user!.userId;
    const { reviewComment } = req.body;

    if (isNaN(leaveId)) {
      throw new BadRequestError('Identifiant de demande invalide');
    }

    const leave = await leaveService.rejectLeave(leaveId, reviewerId, reviewComment);
    res.json(leave);
  } catch (error) {
    next(error);
  }
}

export async function cancelLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const leaveId = parseInt(req.params.id as string, 10);
    const userId = req.user!.userId;

    if (isNaN(leaveId)) {
      throw new BadRequestError('Identifiant de demande invalide');
    }

    const leave = await leaveService.cancelLeave(leaveId, userId);
    res.json(leave);
  } catch (error) {
    next(error);
  }
}
