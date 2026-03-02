import { useState, useMemo, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toggle } from '@/components/ui/Toggle';
import { useEmployeeManagementStore } from '@/stores/employee-management.store';
import type { ManagedEmployee } from '@/stores/employee-management.store';
import { useUIStore } from '@/stores/ui.store';
import { DEPARTMENTS } from '@kly-rh/shared';

/* ─── Add / Edit Form ─── */

interface EmployeeFormData {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
  hireDate: string;
  isActive: boolean;
}

interface EmployeeFormProps {
  initial?: ManagedEmployee;
  onSave: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

function EmployeeForm({ initial, onSave, onCancel }: EmployeeFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState(initial?.department ?? 'Ingénierie');
  const [role, setRole] = useState(initial?.role ?? '');
  const [hireDate, setHireDate] = useState(initial?.hireDate ?? new Date().toISOString().slice(0, 10));
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const depts = DEPARTMENTS.filter((d) => d !== 'Tous');
  const isValid = name.trim().length >= 2 && email.includes('@') && role.trim().length >= 2 && password.length >= 6;

  function handleSubmit() {
    if (!isValid) return;
    onSave({ name: name.trim(), email: email.trim(), password, department, role: role.trim(), hireDate, isActive });
  }

  return (
    <div className="space-y-3 animate-slide-down">
      {/* Name */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Nom complet</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Dupont"
          className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-text text-[14px] focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jean.dupont@kly.fr"
          className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-text text-[14px] focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Mot de passe</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 caracteres"
            className="w-full h-10 px-3 pr-10 rounded-[8px] border border-border bg-surface text-text text-[14px] focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-border transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {password.length > 0 && password.length < 6 && (
          <p className="text-[11px] text-red-500 mt-1">Minimum 6 caracteres</p>
        )}
      </div>

      {/* Department */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Departement</label>
        <div className="flex gap-2 flex-wrap">
          {depts.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDepartment(d)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                department === d
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary border border-border'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Poste</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Developpeur"
          className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-text text-[14px] focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Hire date */}
      <div>
        <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Date d'embauche</label>
        <div className="date-input-wrapper">
          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between py-1">
        <span className="text-[13px] text-text font-medium">Actif</span>
        <Toggle on={isActive} onChange={setIsActive} />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 rounded-[10px] border border-border text-[13px] font-medium text-text-secondary active:bg-border transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 h-10 rounded-[10px] text-[13px] font-semibold text-white transition-all ${
            !isValid
              ? 'bg-primary opacity-40 cursor-not-allowed'
              : 'bg-primary active:bg-primary-dark active:scale-[0.98]'
          }`}
        >
          {initial ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
}

/* ─── Employee Card ─── */

interface EmployeeCardProps {
  employee: ManagedEmployee;
  isExpanded: boolean;
  onToggle: () => void;
}

function EmployeeCard({ employee, isExpanded, onToggle }: EmployeeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateEmployee = useEmployeeManagementStore((s) => s.updateEmployee);
  const toggleActive = useEmployeeManagementStore((s) => s.toggleActive);
  const showToast = useUIStore((s) => s.showToast);

  function handleSave(data: EmployeeFormData) {
    updateEmployee(employee.id, data);
    setIsEditing(false);
    showToast('Collaborateur mis a jour');
  }

  return (
    <div className={`bg-surface rounded-[16px] shadow-sm overflow-hidden ${!employee.isActive ? 'opacity-60' : ''}`}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left active:bg-background transition-colors"
      >
        <div className="relative">
          <Avatar initials={employee.initials} color={employee.color} size="md" />
          {/* Active indicator dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
              employee.isActive ? 'bg-approved' : 'bg-text-tertiary'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text truncate">{employee.name}</p>
          <p className="text-[12px] text-text-secondary truncate">{employee.role} · {employee.department}</p>
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-text-tertiary flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-slide-down">
          {isEditing ? (
            <div className="pt-3">
              <EmployeeForm
                initial={employee}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              {/* Detail rows */}
              <div className="py-3 space-y-2.5">
                <DetailRow icon="mail" label="Email" value={employee.email} />
                <DetailRow icon="lock" label="Mot de passe" value={'•'.repeat(Math.min(employee.password.length, 12))} />
                <DetailRow icon="briefcase" label="Departement" value={employee.department} />
                <DetailRow icon="user" label="Poste" value={employee.role} />
                <DetailRow icon="calendar" label="Embauche" value={formatFrDate(employee.hireDate)} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon />
                    <span className="text-[12px] text-text-secondary">Statut</span>
                  </div>
                  <span className={`text-[13px] font-semibold ${employee.isActive ? 'text-approved' : 'text-text-tertiary'}`}>
                    {employee.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleActive(employee.id);
                    showToast(employee.isActive ? 'Collaborateur desactive' : 'Collaborateur reactive');
                  }}
                  className={`flex-1 h-9 rounded-[8px] border text-[13px] font-medium transition-colors active:scale-[0.98] ${
                    employee.isActive
                      ? 'border-red-200 text-red-500 bg-red-50 active:bg-red-100'
                      : 'border-green-200 text-green-600 bg-green-50 active:bg-green-100'
                  }`}
                >
                  {employee.isActive ? 'Desactiver' : 'Reactiver'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 h-9 rounded-[8px] bg-primary text-white text-[13px] font-semibold active:bg-primary-dark active:scale-[0.98] transition-all"
                >
                  Modifier
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Helper Components ─── */

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <DetailIcon type={icon} />
        <span className="text-[12px] text-text-secondary">{label}</span>
      </div>
      <span className="text-[13px] font-medium text-text text-right max-w-[55%] truncate">{value}</span>
    </div>
  );
}

function DetailIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 text-text-tertiary";
  switch (type) {
    case 'mail':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      );
    case 'user':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      );
    default:
      return null;
  }
}

function StatusIcon() {
  return (
    <svg className="w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function formatFrDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── Main Screen ─── */

export function ManageEmployeesScreen() {
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const employees = useEmployeeManagementStore((s) => s.employees);
  const addEmployee = useEmployeeManagementStore((s) => s.addEmployee);
  const showToast = useUIStore((s) => s.showToast);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchDept = activeDept === 'Tous' || emp.department === activeDept;
      const matchSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && emp.isActive) ||
        (statusFilter === 'inactive' && !emp.isActive);
      return matchDept && matchSearch && matchStatus;
    });
  }, [employees, search, activeDept, statusFilter]);

  const handleToggle = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.isActive).length;
    return { total: employees.length, active, inactive: employees.length - active };
  }, [employees]);

  function handleAdd(data: EmployeeFormData) {
    addEmployee(data);
    setShowAddForm(false);
    showToast('Collaborateur ajoute');
  }

  return (
    <div className="py-4 px-5 pb-6 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`bg-surface rounded-[12px] shadow-sm p-3 text-center transition-all ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
        >
          <p className="text-lg font-bold text-primary">{stats.total}</p>
          <p className="text-[10px] text-text-secondary">Total</p>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('active')}
          className={`bg-surface rounded-[12px] shadow-sm p-3 text-center transition-all ${statusFilter === 'active' ? 'ring-2 ring-approved' : ''}`}
        >
          <p className="text-lg font-bold text-approved">{stats.active}</p>
          <p className="text-[10px] text-text-secondary">Actifs</p>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('inactive')}
          className={`bg-surface rounded-[12px] shadow-sm p-3 text-center transition-all ${statusFilter === 'inactive' ? 'ring-2 ring-text-tertiary' : ''}`}
        >
          <p className="text-lg font-bold text-text-tertiary">{stats.inactive}</p>
          <p className="text-[10px] text-text-secondary">Inactifs</p>
        </button>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un collaborateur..."
      />

      {/* Department filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {DEPARTMENTS.map((dept) => (
          <FilterChip
            key={dept}
            label={dept}
            active={activeDept === dept}
            onClick={() => setActiveDept(dept)}
          />
        ))}
      </div>

      {/* Add employee button */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full h-11 rounded-[12px] border-2 border-dashed border-primary/30 text-primary text-[14px] font-semibold flex items-center justify-center gap-2 active:bg-primary-lighter active:scale-[0.98] transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un collaborateur
        </button>
      ) : (
        <div className="bg-surface rounded-[16px] shadow-sm p-4">
          <p className="text-[13px] font-bold text-text mb-3">Nouveau collaborateur</p>
          <EmployeeForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Employee list */}
      {filtered.length === 0 ? (
        <EmptyState icon="👥" title="Aucun collaborateur trouve" subtitle="Essayez de modifier vos filtres" />
      ) : (
        <div className="space-y-3">
          <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
            {filtered.length} collaborateur{filtered.length > 1 ? 's' : ''}
          </p>
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              isExpanded={expandedId === emp.id}
              onToggle={() => handleToggle(emp.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
