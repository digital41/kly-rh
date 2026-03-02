import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as profileController from '../controllers/profile.controller.js';

export const profileRoutes = Router();

profileRoutes.use(authMiddleware);

profileRoutes.get('/', profileController.getProfile);
profileRoutes.put('/', profileController.updateProfile);
