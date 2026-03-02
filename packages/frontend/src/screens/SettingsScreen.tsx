import { useState, useCallback } from 'react';
import { Toggle } from '@/components/ui/Toggle';

const STORAGE_KEY = 'kly-settings';

interface Settings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  remindersEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  pushEnabled: true,
  emailEnabled: true,
  remindersEnabled: true,
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

interface SettingRowProps {
  label: string;
  right: React.ReactNode;
}

function SettingRow({ label, right }: SettingRowProps) {
  return (
    <div className="flex justify-between items-center px-4 min-h-[56px]">
      <span className="text-sm text-text">{label}</span>
      {right}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="text-[12px] uppercase font-bold text-text tracking-wider mb-2 mt-5">
      {title}
    </p>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-text-tertiary"
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  return (
    <div className="py-4 px-5 pb-6">
      {/* NOTIFICATIONS */}
      <SectionTitle title="NOTIFICATIONS" />
      <div className="bg-surface rounded-[16px] shadow-md divide-y divide-border">
        <SettingRow
          label="Notifications push"
          right={
            <Toggle
              on={settings.pushEnabled}
              onChange={(v) => updateSetting('pushEnabled', v)}
            />
          }
        />
        <SettingRow
          label="Notifications email"
          right={
            <Toggle
              on={settings.emailEnabled}
              onChange={(v) => updateSetting('emailEnabled', v)}
            />
          }
        />
        <SettingRow
          label="Rappels de conges"
          right={
            <Toggle
              on={settings.remindersEnabled}
              onChange={(v) => updateSetting('remindersEnabled', v)}
            />
          }
        />
      </div>

      {/* PREFERENCES */}
      <SectionTitle title="PREFERENCES" />
      <div className="bg-surface rounded-[16px] shadow-md divide-y divide-border">
        <SettingRow
          label="Langue"
          right={<span className="text-sm text-text-secondary">Francais</span>}
        />
        <SettingRow
          label="Debut de semaine"
          right={<span className="text-sm text-text-secondary">Lundi</span>}
        />
        <SettingRow
          label="Format de date"
          right={<span className="text-sm text-text-secondary">JJ/MM/AAAA</span>}
        />
      </div>

      {/* A PROPOS */}
      <SectionTitle title="A PROPOS" />
      <div className="bg-surface rounded-[16px] shadow-md divide-y divide-border">
        <SettingRow
          label="Version"
          right={<span className="text-sm text-text-secondary">1.0.0</span>}
        />
        <SettingRow
          label="Politique de confidentialite"
          right={<ArrowIcon />}
        />
        <SettingRow
          label="Conditions d'utilisation"
          right={<ArrowIcon />}
        />
      </div>
    </div>
  );
}
