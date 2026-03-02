#!/usr/bin/env node

/**
 * KLY RH — Script de setup complet
 *
 * Lance dans l'ordre :
 * 1. Copie .env si absent
 * 2. npm install
 * 3. Docker PostgreSQL
 * 4. Prisma migrate + generate
 * 5. Seed de la base
 * 6. Lance tout (DB + API + Frontend)
 */

import { execSync, spawn } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BACKEND = resolve(ROOT, 'packages/backend');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(msg) {
  console.log(`${colors.cyan}${colors.bold}[KLY RH]${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.green}  ✓${colors.reset} ${msg}`);
}

function warn(msg) {
  console.log(`${colors.yellow}  ⚠${colors.reset} ${msg}`);
}

function run(cmd, cwd = ROOT) {
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Step 1: .env ───
log('Vérification du fichier .env...');
const envPath = resolve(BACKEND, '.env');
const envExample = resolve(ROOT, '.env.example');
if (!existsSync(envPath)) {
  if (existsSync(envExample)) {
    copyFileSync(envExample, envPath);
    success('.env copié depuis .env.example');
  } else {
    warn('.env.example introuvable, créez packages/backend/.env manuellement');
  }
} else {
  success('.env déjà présent');
}

// ─── Step 2: npm install ───
log('Installation des dépendances...');
run('npm install');
success('Dépendances installées');

// ─── Step 3: Docker PostgreSQL ───
log('Démarrage de PostgreSQL via Docker...');
const dockerUp = run('docker compose up -d');
if (!dockerUp) {
  warn('Docker non disponible ou erreur. Assurez-vous que Docker est lancé.');
  warn('Vous pouvez aussi utiliser une base PostgreSQL locale.');
  warn('Continuez manuellement avec : npm run dev:frontend');
  process.exit(1);
}
success('PostgreSQL démarré');

// Attendre que PostgreSQL soit prêt
log('Attente de PostgreSQL...');
let ready = false;
for (let i = 0; i < 15; i++) {
  try {
    execSync('docker compose exec -T postgres pg_isready -U klyrh', { cwd: ROOT, stdio: 'pipe' });
    ready = true;
    break;
  } catch {
    await sleep(1000);
  }
}
if (!ready) {
  warn('PostgreSQL ne répond pas après 15s. Vérifiez Docker.');
  process.exit(1);
}
success('PostgreSQL prêt');

// ─── Step 4: Prisma migrate + generate ───
log('Migration de la base de données...');
run('npx prisma generate --schema=src/prisma/schema.prisma', BACKEND);
success('Client Prisma généré');

const migrated = run('npx prisma migrate dev --name init --schema=src/prisma/schema.prisma', BACKEND);
if (!migrated) {
  warn('Migration échouée, tentative de reset...');
  run('npx prisma migrate reset --force --schema=src/prisma/schema.prisma', BACKEND);
}
success('Base de données migrée');

// ─── Step 5: Seed ───
log('Seeding de la base de données (30 employés, congés, soldes...)...');
run('npx tsx src/prisma/seed.ts', BACKEND);
success('Base de données peuplée');

// ─── Step 6: Tout lancer ───
console.log('');
log(`${colors.bold}${colors.green}Setup terminé avec succès !${colors.reset}`);
console.log('');
console.log(`  ${colors.bold}Pour lancer l'application :${colors.reset}`);
console.log('');
console.log(`  ${colors.cyan}npm run dev${colors.reset}        → Lance tout (DB + API + Frontend)`);
console.log(`  ${colors.cyan}npm run dev:frontend${colors.reset} → Frontend seul (données mock)`);
console.log('');
console.log(`  ${colors.bold}URLs :${colors.reset}`);
console.log(`  Frontend : ${colors.cyan}http://localhost:5173${colors.reset}`);
console.log(`  API      : ${colors.cyan}http://localhost:3000/api/v1${colors.reset}`);
console.log('');
console.log(`  ${colors.bold}Login :${colors.reset} sophie.laurent@kly.fr / kly2026!`);
console.log('');
