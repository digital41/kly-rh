import type { Request, Response, NextFunction } from 'express';
import * as calendarService from '../services/calendar.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function getMonthLeaves(req: Request, res: Response, next: NextFunction) {
  try {
    const month = parseInt(req.query.month as string, 10);
    const year = parseInt(req.query.year as string, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      throw new BadRequestError('Mois et année requis (month=1-12, year=YYYY)');
    }

    const leaves = await calendarService.getMonthLeaves(month, year);
    res.json(leaves);
  } catch (error) {
    next(error);
  }
}

export async function getTodayAbsences(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await calendarService.getTodayAbsences();
    res.json(result);
  } catch (error) {
    next(error);
  }
}
