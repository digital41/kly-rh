import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@kly-rh/shared';

const DEMO_ACCOUNTS: { role: UserRole; name: string; initials: string; email: string; password: string }[] = [
  { role: 'manager', name: 'Sophie Laurent', initials: 'SL', email: 'sophie.laurent@kly.fr', password: 'kly2026!' },
  { role: 'employee', name: 'Thomas Petit', initials: 'TP', email: 'thomas.petit@kly.fr', password: 'kly2026!' },
];

export function LoginScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    );

    if (!account) {
      setError('Email ou mot de passe incorrect');
      return;
    }

    login({ name: account.name, initials: account.initials, role: account.role, email: account.email });
    navigate('/');
  };

  const handleDemoLogin = (role: UserRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
    login({ name: account.name, initials: account.initials, role: account.role, email: account.email });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-[430px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">KLY Conges</h1>
            <p className="text-text-secondary mt-1">Gestion des conges</p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1.5"
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@entreprise.fr"
              className="w-full h-12 px-4 rounded-[12px] bg-surface border border-border text-sm text-text placeholder-text-tertiary outline-none focus:border-primary transition-colors duration-150"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text mb-1.5"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full h-12 px-4 rounded-[12px] bg-surface border border-border text-sm text-text placeholder-text-tertiary outline-none focus:border-primary transition-colors duration-150"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-rejected font-medium text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-[12px] text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Se connecter
          </button>
        </form>

        {/* Demo quick login */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold text-text-tertiary tracking-wider uppercase text-center mb-3">
            Acces rapide (demo)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('manager')}
              className="bg-surface border border-border rounded-[12px] p-3 text-center transition-colors hover:border-primary active:scale-[0.97]"
            >
              <p className="text-[13px] font-semibold text-text">Sophie Laurent</p>
              <p className="text-[11px] text-primary font-medium mt-0.5">Manager</p>
            </button>
            <button
              onClick={() => handleDemoLogin('employee')}
              className="bg-surface border border-border rounded-[12px] p-3 text-center transition-colors hover:border-primary active:scale-[0.97]"
            >
              <p className="text-[13px] font-semibold text-text">Thomas Petit</p>
              <p className="text-[11px] text-personal font-medium mt-0.5">Collaborateur</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
