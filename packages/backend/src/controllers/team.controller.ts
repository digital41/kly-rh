import type { Request, Response, NextFunction } from 'express';
import * as teamService from '../services/team.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function getAllEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const employees = await teamService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    next(error);
  }
}

export async function getEmployeeById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new BadRequestError('Identifiant employé invalide');
    }

    const employee = await teamService.getEmployeeById(id);
    res.json(employee);
  } catch (error) {
    next(error);
  }
}
