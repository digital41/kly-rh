import { useMemo } from 'react';
import { useTeamStore } from '@/stores/team.store';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { DEPARTMENTS, TYPE_LABELS } from '@kly-rh/shared';
import type { EmployeeListItem } from '@kly-rh/shared';
import { EMPLOYEES, LEAVES } from '@/services/mock/mock-data';

const STATUS_DOT_COLORS: Record<string, string> = {
  out: '#EF4444',
  available: '#22C55E',
  remote: '#14B8A6',
};

function EmployeeCard({ employee }: { employee: EmployeeListItem }) {
  return (
    <div className="bg-surface rounded-[12px] shadow-sm p-3 flex gap-3 items-center">
      <Avatar initials={employee.initials} color={employee.color} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-text truncate">{employee.name}</p>
        <p className="text-xs text-text-secondary truncate">
          {employee.department} · {employee.role}
        </p>
        {(employee.status === 'out' || employee.status === 'remote') && employee.leaveType && (
          <p
            className="text-xs font-medium mt-0.5"
            style={{
              color:
                employee.leaveType in TYPE_LABELS
                  ? undefined
                  : '#64748B',
            }}
          >
            <span
              style={{
                color:
                  employee.leaveType === 'vacation'
                    ? '#3B82F6'
                    : employee.leaveType === 'sick'
                      ? '#F97316'
                      : employee.leaveType === 'personal'
                        ? '#8B5CF6'
                        : employee.leaveType === 'remote'
                          ? '#10B981'
                          : employee.leaveType === 'training'
                            ? '#EC4899'
                            : '#64748B',
              }}
            >
              {TYPE_LABELS[employee.leaveType as keyof typeof TYPE_LABELS] ?? employee.leaveType}
            </span>
          </p>
        )}
      </div>
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{
          backgroundColor: STATUS_DOT_COLORS[employee.status ?? 'available'],
        }}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  count: number;
  employees: EmployeeListItem[];
}

function Section({ title, count, employees }: SectionProps) {
  if (employees.length === 0) return null;

  return (
    <div>
      <p className="text-[12px] font-semibold text-text-secondary tracking-wider uppercase mb-2">
        {title} · {count}
      </p>
      <div className="space-y-2">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
}

export function TeamScreen() {
  const { searchQuery, activeDept, setSearch, setDept } = useTeamStore();

  const { out, remote, available } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const q = searchQuery.toLowerCase();

    let filtered = EMPLOYEES as EmployeeListItem[];
    if (activeDept !== 'Tous') {
      filtered = filtered.filter((e) => e.department === activeDept);
    }
    if (q) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      );
    }

    const outList: EmployeeListItem[] = [];
    const remoteList: EmployeeListItem[] = [];
    const availableList: EmployeeListItem[] = [];

    for (const emp of filtered) {
      const leave = LEAVES.find(
        (l) => l.employeeId === emp.id && l.status !== 'rejected' && today >= l.start && today <= l.end
      );
      if (leave) {
        if (leave.type === 'remote') {
          remoteList.push({ ...emp, status: 'remote', leaveType: leave.type });
        } else {
          outList.push({ ...emp, status: 'out', leaveType: leave.type });
        }
      } else {
        availableList.push({ ...emp, status: 'available' });
      }
    }

    return { out: outList, remote: remoteList, available: availableList };
  }, [searchQuery, activeDept]);

  const totalAvailable = available.length;
  const totalEmployees = out.length + remote.length + available.length;

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-4">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearch}
          placeholder="Rechercher un collaborateur..."
        />

        {/* Department filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {DEPARTMENTS.map((dept) => (
            <FilterChip
              key={dept}
              label={dept}
              active={activeDept === dept}
              onClick={() => setDept(dept)}
            />
          ))}
        </div>

        {/* Stats */}
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text">{totalAvailable}</span> sur{' '}
          <span className="font-semibold text-text">{totalEmployees}</span> disponibles
        </p>

        {/* Sections */}
        {totalEmployees === 0 ? (
          <EmptyState
            icon="🔍"
            title="Aucun resultat"
            subtitle="Essayez avec d'autres criteres de recherche"
          />
        ) : (
          <>
            <Section title="ABSENTS" count={out.length} employees={out} />
            <Section title="TELETRAVAIL" count={remote.length} employees={remote} />
            <Section title="DISPONIBLES" count={available.length} employees={available} />
          </>
        )}
      </div>
    </div>
  );
}
