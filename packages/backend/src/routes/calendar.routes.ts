import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as calendarController from '../controllers/calendar.controller.js';

export const calendarRoutes = Router();

calendarRoutes.use(authMiddleware);

calendarRoutes.get('/', calendarController.getMonthLeaves);
calendarRoutes.get('/today', calendarController.getTodayAbsences);
