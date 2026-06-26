import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');

test('deployment and environment files exist', () => {
  assert.equal(existsSync('netlify.toml'), true, 'missing netlify.toml');
  assert.equal(existsSync('.env.example'), true, 'missing .env.example');
  assert.equal(existsSync('README.md'), true, 'missing README.md');
});

test('Supabase migration defines required InvestorOS primitives', () => {
  const migration = read('supabase/migrations/20260626000000_investor_os_schema.sql');
  for (const token of ['create table if not exists public.documents', 'create table if not exists public.profiles', 'create table if not exists public.user_roles', 'create or replace function public.has_role']) {
    assert.match(migration, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('InvestorOS source keeps fallback AI behavior', () => {
  const source = read('src/lib/investor-room.functions.ts');
  assert.match(source, /fallbackAnswer/);
  assert.match(source, /GEMINI_API_KEY/);
  assert.match(source, /Discharge Bridge/);
});
