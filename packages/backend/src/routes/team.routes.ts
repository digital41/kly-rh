import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as teamController from '../controllers/team.controller.js';

export const teamRoutes = Router();

teamRoutes.use(authMiddleware);

teamRoutes.get('/', teamController.getAllEmployees);
teamRoutes.get('/:id', teamController.getEmployeeById);
