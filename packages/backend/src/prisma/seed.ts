import { prisma } from '../config/database.js';
import { hashPassword } from '../utils/password.js';
import { LeaveType, LeaveStatus, UserRole } from '../../generated/prisma/index.js';

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

async function main() {
  console.log('Nettoyage de la base de donnees...');

  // Supprimer dans l'ordre pour respecter les contraintes de cles etrangeres
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.leaveRequest.deleteMany(),
    prisma.leaveBalance.deleteMany(),
    prisma.leavePolicy.deleteMany(),
    prisma.holiday.deleteMany(),
    prisma.featureFlag.deleteMany(),
    prisma.user.deleteMany(),
    prisma.department.deleteMany(),
  ]);

  console.log('Base de donnees nettoyee.');

  const passwordHash = await hashPassword('kly2026!');

  await prisma.$transaction(async (tx) => {
    // ========================================
    // 1. Departements
    // ========================================
    console.log('Creation des departements...');

    const departments = await Promise.all([
      tx.department.create({ data: { id: 1, name: 'Ingénierie' } }),
      tx.department.create({ data: { id: 2, name: 'Marketing' } }),
      tx.department.create({ data: { id: 3, name: 'Commercial' } }),
      tx.department.create({ data: { id: 4, name: 'Opérations' } }),
    ]);

    // ========================================
    // 2. Employes (30 personnes)
    // ========================================
    console.log('Creation des employes...');

    interface EmployeeData {
      id: number;
      firstName: string;
      lastName: string;
      department: string;
      role: UserRole;
      managerId: number | null;
      avatarColor: string;
    }

    const deptMap: Record<string, number> = {
      'Ingénierie': 1,
      'Marketing': 2,
      'Commercial': 3,
      'Opérations': 4,
    };

    const employees: EmployeeData[] = [
      { id: 1, firstName: 'Sophie', lastName: 'Laurent', department: 'Ingénierie', role: UserRole.manager, managerId: null, avatarColor: '#3B82F6' },
      { id: 2, firstName: 'Thomas', lastName: 'Bernard', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#8B5CF6' },
      { id: 3, firstName: 'Marie', lastName: 'Dubois', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#EC4899' },
      { id: 4, firstName: 'Paul', lastName: 'Martin', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#F97316' },
      { id: 5, firstName: 'Julie', lastName: 'Rousseau', department: 'Marketing', role: UserRole.manager, managerId: null, avatarColor: '#10B981' },
      { id: 6, firstName: 'Pierre', lastName: 'Lefebvre', department: 'Marketing', role: UserRole.employee, managerId: 5, avatarColor: '#6366F1' },
      { id: 7, firstName: 'Emma', lastName: 'Moreau', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#14B8A6' },
      { id: 8, firstName: 'Lucas', lastName: 'Petit', department: 'Commercial', role: UserRole.employee, managerId: 16, avatarColor: '#F43F5E' },
      { id: 9, firstName: 'Camille', lastName: 'Durand', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#A855F7' },
      { id: 10, firstName: 'Antoine', lastName: 'Leroy', department: 'Opérations', role: UserRole.manager, managerId: null, avatarColor: '#0EA5E9' },
      { id: 11, firstName: 'Chloé', lastName: 'Roux', department: 'Marketing', role: UserRole.employee, managerId: 5, avatarColor: '#F97316' },
      { id: 12, firstName: 'Maxime', lastName: 'Simon', department: 'Commercial', role: UserRole.employee, managerId: 16, avatarColor: '#22C55E' },
      { id: 13, firstName: 'Léa', lastName: 'Michel', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#EAB308' },
      { id: 14, firstName: 'Hugo', lastName: 'Fontaine', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#3B82F6' },
      { id: 15, firstName: 'Manon', lastName: 'Garcia', department: 'Opérations', role: UserRole.employee, managerId: 10, avatarColor: '#EC4899' },
      { id: 16, firstName: 'Nathan', lastName: 'Dupont', department: 'Commercial', role: UserRole.manager, managerId: null, avatarColor: '#8B5CF6' },
      { id: 17, firstName: 'Sarah', lastName: 'Bertrand', department: 'Marketing', role: UserRole.employee, managerId: 5, avatarColor: '#10B981' },
      { id: 18, firstName: 'Julien', lastName: 'Lambert', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#6366F1' },
      { id: 19, firstName: 'Laura', lastName: 'Mercier', department: 'Opérations', role: UserRole.employee, managerId: 10, avatarColor: '#F43F5E' },
      { id: 20, firstName: 'Alexandre', lastName: 'Girard', department: 'Commercial', role: UserRole.employee, managerId: 16, avatarColor: '#14B8A6' },
      { id: 21, firstName: 'Océane', lastName: 'Bonnet', department: 'Marketing', role: UserRole.employee, managerId: 5, avatarColor: '#A855F7' },
      { id: 22, firstName: 'Romain', lastName: 'Faure', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#0EA5E9' },
      { id: 23, firstName: 'Inès', lastName: 'André', department: 'Opérations', role: UserRole.employee, managerId: 10, avatarColor: '#EAB308' },
      { id: 24, firstName: 'Théo', lastName: 'Martinez', department: 'Commercial', role: UserRole.employee, managerId: 16, avatarColor: '#22C55E' },
      { id: 25, firstName: 'Clara', lastName: 'Lefevre', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#F97316' },
      { id: 26, firstName: 'Mathieu', lastName: 'Morel', department: 'Opérations', role: UserRole.employee, managerId: 10, avatarColor: '#3B82F6' },
      { id: 27, firstName: 'Zoé', lastName: 'Fournier', department: 'Marketing', role: UserRole.employee, managerId: 5, avatarColor: '#EC4899' },
      { id: 28, firstName: 'Kevin', lastName: 'Duval', department: 'Ingénierie', role: UserRole.employee, managerId: 1, avatarColor: '#8B5CF6' },
      { id: 29, firstName: 'Pauline', lastName: 'Henry', department: 'Opérations', role: UserRole.employee, managerId: 10, avatarColor: '#10B981' },
      { id: 30, firstName: 'Damien', lastName: 'Robert', department: 'Commercial', role: UserRole.employee, managerId: 16, avatarColor: '#6366F1' },
    ];

    // Creer d'abord les managers (sans managerId) puis les employes
    const managers = employees.filter((e) => e.managerId === null);
    const nonManagers = employees.filter((e) => e.managerId !== null);

    for (const emp of managers) {
      const email = `${removeAccents(emp.firstName)}.${removeAccents(emp.lastName)}@kly.fr`;
      await tx.user.create({
        data: {
          id: emp.id,
          email,
          passwordHash,
          firstName: emp.firstName,
          lastName: emp.lastName,
          departmentId: deptMap[emp.department],
          role: emp.role,
          managerId: null,
          avatarColor: emp.avatarColor,
          hireDate: new Date('2024-01-15'),
          isActive: true,
        },
      });
    }

    for (const emp of nonManagers) {
      const email = `${removeAccents(emp.firstName)}.${removeAccents(emp.lastName)}@kly.fr`;
      await tx.user.create({
        data: {
          id: emp.id,
          email,
          passwordHash,
          firstName: emp.firstName,
          lastName: emp.lastName,
          departmentId: deptMap[emp.department],
          role: emp.role,
          managerId: emp.managerId,
          avatarColor: emp.avatarColor,
          hireDate: new Date('2024-06-01'),
          isActive: true,
        },
      });
    }

    // ========================================
    // 3. Politiques de conges
    // ========================================
    console.log('Creation des politiques de conges...');

    await Promise.all([
      tx.leavePolicy.create({
        data: {
          leaveType: LeaveType.vacation,
          name: 'Congés payés',
          daysPerYear: 25,
          carryOverMax: 5,
          requiresProof: false,
          description: 'Congés payés annuels légaux',
        },
      }),
      tx.leavePolicy.create({
        data: {
          leaveType: LeaveType.sick,
          name: 'Maladie',
          daysPerYear: 10,
          carryOverMax: 0,
          requiresProof: true,
          description: 'Jours de maladie avec justificatif',
        },
      }),
      tx.leavePolicy.create({
        data: {
          leaveType: LeaveType.personal,
          name: 'Personnel',
          daysPerYear: 5,
          carryOverMax: 0,
          requiresProof: false,
          description: 'Jours pour motifs personnels',
        },
      }),
      tx.leavePolicy.create({
        data: {
          leaveType: LeaveType.remote,
          name: 'Télétravail',
          daysPerYear: 48,
          carryOverMax: 0,
          requiresProof: false,
          description: 'Jours de télétravail autorisés',
        },
      }),
      tx.leavePolicy.create({
        data: {
          leaveType: LeaveType.training,
          name: 'Formation',
          daysPerYear: 365,
          carryOverMax: 0,
          requiresProof: true,
          description: 'Jours de formation (illimité avec validation)',
        },
      }),
    ]);

    // ========================================
    // 4. Soldes de conges pour 2026
    // ========================================
    console.log('Creation des soldes de conges...');

    const leaveTypes: { type: LeaveType; total: number }[] = [
      { type: LeaveType.vacation, total: 25 },
      { type: LeaveType.sick, total: 10 },
      { type: LeaveType.personal, total: 5 },
      { type: LeaveType.remote, total: 48 },
    ];

    // Soldes utilises par Sophie (id: 1)
    const sophieUsed: Record<string, number> = {
      vacation: 7,
      sick: 2,
      personal: 1,
      remote: 12,
    };

    for (const emp of employees) {
      for (const lt of leaveTypes) {
        const used = emp.id === 1 ? (sophieUsed[lt.type] ?? 0) : 0;
        await tx.leaveBalance.create({
          data: {
            userId: emp.id,
            leaveType: lt.type,
            year: 2026,
            totalDays: lt.total,
            usedDays: used,
            carriedOver: 0,
          },
        });
      }
    }

    // ========================================
    // 5. Demandes de conges (13 demandes)
    // ========================================
    console.log('Creation des demandes de conges...');

    const leaveRequests = [
      { userId: 3, leaveType: LeaveType.vacation, startDate: '2026-03-01', endDate: '2026-03-05', totalDays: 4, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 4, leaveType: LeaveType.sick, startDate: '2026-03-02', endDate: '2026-03-02', totalDays: 1, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 7, leaveType: LeaveType.remote, startDate: '2026-03-02', endDate: '2026-03-06', totalDays: 5, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 8, leaveType: LeaveType.personal, startDate: '2026-03-09', endDate: '2026-03-10', totalDays: 2, status: LeaveStatus.approved, reviewedBy: 16 },
      { userId: 11, leaveType: LeaveType.vacation, startDate: '2026-03-05', endDate: '2026-03-06', totalDays: 2, status: LeaveStatus.approved, reviewedBy: 5 },
      { userId: 14, leaveType: LeaveType.vacation, startDate: '2026-03-16', endDate: '2026-03-20', totalDays: 5, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 13, leaveType: LeaveType.training, startDate: '2026-03-23', endDate: '2026-03-25', totalDays: 3, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 17, leaveType: LeaveType.vacation, startDate: '2026-03-10', endDate: '2026-03-13', totalDays: 4, status: LeaveStatus.approved, reviewedBy: 5 },
      { userId: 20, leaveType: LeaveType.sick, startDate: '2026-03-18', endDate: '2026-03-19', totalDays: 2, status: LeaveStatus.approved, reviewedBy: 16 },
      { userId: 22, leaveType: LeaveType.remote, startDate: '2026-03-24', endDate: '2026-03-28', totalDays: 5, status: LeaveStatus.approved, reviewedBy: 1 },
      { userId: 2, leaveType: LeaveType.vacation, startDate: '2026-03-12', endDate: '2026-03-14', totalDays: 3, status: LeaveStatus.pending, note: 'Événement familial — mariage' },
      { userId: 9, leaveType: LeaveType.personal, startDate: '2026-03-18', endDate: '2026-03-18', totalDays: 1, status: LeaveStatus.pending, note: 'Rendez-vous médical' },
      { userId: 1, leaveType: LeaveType.vacation, startDate: '2026-03-26', endDate: '2026-03-28', totalDays: 3, status: LeaveStatus.approved, reviewedBy: null },
    ];

    for (const lr of leaveRequests) {
      await tx.leaveRequest.create({
        data: {
          userId: lr.userId,
          leaveType: lr.leaveType,
          startDate: new Date(lr.startDate),
          endDate: new Date(lr.endDate),
          totalDays: lr.totalDays,
          status: lr.status,
          note: lr.note ?? null,
          reviewedBy: lr.reviewedBy ?? null,
          reviewedAt: lr.status === LeaveStatus.approved && lr.reviewedBy ? new Date() : null,
        },
      });
    }

    // ========================================
    // 6. Notifications pour Sophie (user 1)
    // ========================================
    console.log('Creation des notifications...');

    const now = new Date();
    const notifications = [
      {
        userId: 1,
        title: 'Demande approuvée',
        body: 'Votre demande de <strong>congés payés</strong> du 26-28 mars a été approuvée',
        type: 'leave_approved',
        referenceId: null,
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // il y a 2h
      },
      {
        userId: 1,
        title: 'Nouvelle demande',
        body: '<strong>Thomas Bernard</strong> a soumis une demande de congés (12-14 mars)',
        type: 'leave_request',
        referenceId: null,
        isRead: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // il y a 5h
      },
      {
        userId: 1,
        title: 'Nouvelle demande',
        body: '<strong>Camille Durand</strong> a soumis une demande personnelle (18 mars)',
        type: 'leave_request',
        referenceId: null,
        isRead: false,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // hier
      },
      {
        userId: 1,
        title: 'Demande approuvée',
        body: 'Votre demande de <strong>congés payés</strong> du 17-21 fév. a été approuvée',
        type: 'leave_approved',
        referenceId: null,
        isRead: true,
        createdAt: new Date('2026-02-15'),
      },
      {
        userId: 1,
        title: 'Demande refusée',
        body: 'Votre demande <strong>personnelle</strong> du 15 jan. a été refusée',
        type: 'leave_rejected',
        referenceId: null,
        isRead: true,
        createdAt: new Date('2026-01-14'),
      },
      {
        userId: 1,
        title: 'Rappel solde',
        body: 'Rappel : il vous reste <strong>18 jours</strong> de congés payés en 2026',
        type: 'reminder',
        referenceId: null,
        isRead: true,
        createdAt: new Date('2026-01-01'),
      },
    ];

    for (const notif of notifications) {
      await tx.notification.create({ data: notif });
    }

    // ========================================
    // 7. Jours feries 2026 (France)
    // ========================================
    console.log('Creation des jours feries 2026...');

    const holidays = [
      { name: "Jour de l'An", date: '2026-01-01' },
      { name: 'Lundi de Pâques', date: '2026-04-06' },
      { name: 'Fête du Travail', date: '2026-05-01' },
      { name: '8 Mai 1945', date: '2026-05-08' },
      { name: 'Ascension', date: '2026-05-14' },
      { name: 'Lundi de Pentecôte', date: '2026-05-25' },
      { name: 'Fête Nationale', date: '2026-07-14' },
      { name: 'Assomption', date: '2026-08-15' },
      { name: 'Toussaint', date: '2026-11-01' },
      { name: 'Armistice', date: '2026-11-11' },
      { name: 'Noël', date: '2026-12-25' },
    ];

    for (const h of holidays) {
      await tx.holiday.create({
        data: {
          name: h.name,
          date: new Date(h.date),
        },
      });
    }

    console.log('Seed termine avec succes !');
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Erreur lors du seed :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
