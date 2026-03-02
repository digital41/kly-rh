import { prisma } from '../config/database.js';
import { LeaveStatus, LeaveType } from '../../generated/prisma/index.js';
import { NotFoundError } from '../utils/errors.js';

export async function getAllEmployees() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employees = await prisma.user.findMany({
    where: { isActive: true },
    include: {
      department: { select: { name: true } },
      leaveRequests: {
        where: {
          status: LeaveStatus.approved,
          startDate: { lte: today },
          endDate: { gte: today },
        },
        select: {
          leaveType: true,
        },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  return employees.map((emp) => {
    let availability: 'available' | 'out' | 'remote' = 'available';

    if (emp.leaveRequests.length > 0) {
      const hasRemote = emp.leaveRequests.some((lr) => lr.leaveType === LeaveType.remote);
      const hasOther = emp.leaveRequests.some((lr) => lr.leaveType !== LeaveType.remote);

      if (hasOther) {
        availability = 'out';
      } else if (hasRemote) {
        availability = 'remote';
      }
    }

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      avatarUrl: emp.avatarUrl,
      avatarColor: emp.avatarColor,
      role: emp.role,
      department: emp.department.name,
      departmentId: emp.departmentId,
      managerId: emp.managerId,
      hireDate: emp.hireDate,
      availability,
    };
  });
}

export async function getEmployeeById(id: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employee = await prisma.user.findUnique({
    where: { id, isActive: true },
    include: {
      department: { select: { name: true } },
      manager: {
        select: { id: true, firstName: true, lastName: true },
      },
      leaveRequests: {
        where: {
          status: LeaveStatus.approved,
          startDate: { lte: today },
          endDate: { gte: today },
        },
        select: { leaveType: true },
      },
    },
  });

  if (!employee) {
    throw new NotFoundError('Employé');
  }

  let availability: 'available' | 'out' | 'remote' = 'available';
  if (employee.leaveRequests.length > 0) {
    const hasOther = employee.leaveRequests.some((lr) => lr.leaveType !== LeaveType.remote);
    if (hasOther) {
      availability = 'out';
    } else {
      availability = 'remote';
    }
  }

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    avatarUrl: employee.avatarUrl,
    avatarColor: employee.avatarColor,
    role: employee.role,
    department: employee.department.name,
    departmentId: employee.departmentId,
    managerId: employee.managerId,
    manager: employee.manager,
    hireDate: employee.hireDate,
    availability,
  };
}
