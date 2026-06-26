import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');
const migrationPath = 'supabase/migrations/20260626000000_investor_os_schema.sql';

test('deployment and environment files exist', () => {
  assert.equal(existsSync('netlify.toml'), true, 'missing netlify.toml');
  assert.equal(existsSync('.env.example'), true, 'missing .env.example');
  assert.equal(existsSync('README.md'), true, 'missing README.md');
});

test('environment template documents required runtime variables', () => {
  const env = read('.env.example');
  for (const key of [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY',
  ]) {
    assert.match(env, new RegExp(`^${key}=`, 'm'), `missing ${key}`);
  }
});

test('Supabase migration defines required InvestorOS primitives', () => {
  const migration = read(migrationPath);
  for (const token of [
    'create table if not exists public.documents',
    'create table if not exists public.profiles',
    'create table if not exists public.user_roles',
    'create or replace function public.has_role',
    'create or replace function public.handle_new_user',
    'alter table public.documents enable row level security',
    'alter table public.profiles enable row level security',
    'alter table public.user_roles enable row level security',
  ]) {
    assert.match(migration, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('RLS policies preserve investor/admin separation', () => {
  const migration = read(migrationPath);
  assert.match(migration, /documents_select_by_access/);
  assert.match(migration, /access in \('Public', 'NDA'\)/);
  assert.match(migration, /documents_admin_insert/);
  assert.match(migration, /documents_admin_update/);
  assert.match(migration, /documents_admin_delete/);
  assert.match(migration, /roles_select_own_or_admin/);
  assert.match(migration, /roles_admin_insert/);
  assert.match(migration, /roles_admin_update/);
  assert.match(migration, /roles_admin_delete/);
  assert.match(migration, /grant execute on function public\.has_role\(uuid, public\.app_role\) to authenticated/);
});

test('InvestorOS source keeps fallback AI behavior', () => {
  const source = read('src/lib/investor-room.functions.ts');
  assert.match(source, /fallbackAnswer/);
  assert.match(source, /GEMINI_API_KEY/);
  assert.match(source, /Discharge Bridge/);
});
