import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const migrationPath = "supabase/migrations/20260626000000_investor_os_schema.sql";

const wiredDocs = [
  "investor-pitch-deck",
  "investment-memo",
  "financial-model",
  "patent-summary",
  "security-roadmap",
  "product-architecture",
];

test("package scripts support deploy readiness checks", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.scripts.typecheck, "tsc --noEmit");
  assert.equal(pkg.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(
    pkg.scripts.check,
    "npm run typecheck && npm run lint && npm run test && npm run build",
  );
});

test("CI workflow runs lint, test, and build on Node 22", () => {
  const workflow = read(".github/workflows/investor-os-readiness.yml");
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /npm install/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
});

test("deployment and environment files exist", () => {
  assert.equal(existsSync("netlify.toml"), true, "missing netlify.toml");
  assert.equal(existsSync(".env.example"), true, "missing .env.example");
  assert.equal(existsSync("README.md"), true, "missing README.md");
});

test("root metadata uses InvestorOS branding", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /InvestorOS — Discharge Bridge Investor Room/);
  assert.doesNotMatch(root, /Lovable App/);
  assert.doesNotMatch(root, /Lovable Generated Project/);
});

test("environment template documents required runtime variables", () => {
  const env = read(".env.example");
  for (const key of [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ]) {
    assert.match(env, new RegExp(`^${key}=`, "m"), `missing ${key}`);
  }
});

test("Supabase migration defines required InvestorOS primitives", () => {
  const migration = read(migrationPath);
  for (const token of [
    "create table if not exists public.documents",
    "create table if not exists public.profiles",
    "create table if not exists public.user_roles",
    "create or replace function public.has_role",
    "create or replace function public.handle_new_user",
    "alter table public.documents enable row level security",
    "alter table public.profiles enable row level security",
    "alter table public.user_roles enable row level security",
  ]) {
    assert.match(migration, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("RLS policies preserve investor/admin separation", () => {
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
  assert.match(
    migration,
    /grant execute on function public\.has_role\(uuid, public\.app_role\) to authenticated/,
  );
});

test("InvestorOS source keeps fallback AI behavior", () => {
  const source = read("src/lib/investor-room.functions.ts");
  assert.match(source, /fallbackAnswer/);
  assert.match(source, /GEMINI_API_KEY/);
  assert.match(source, /GEMINI_MODEL \|\| "gemini-2\.5-flash"/);
  assert.match(source, /Discharge Bridge/);
});

test("service role key is not exposed in client code", () => {
  const client = read("src/integrations/supabase/client.ts");
  assert.doesNotMatch(client, /SERVICE_ROLE/);
  assert.doesNotMatch(client, /VITE_.*SERVICE/);
  assert.match(client, /VITE_SUPABASE_PUBLISHABLE_KEY/);
});

test("enum creation in migration is idempotent", () => {
  const migration = read(migrationPath);
  assert.match(migration, /when duplicate_object then null/);
  assert.match(migration, /security definer/);
  assert.match(migration, /set search_path = public/);
});

test("virtual data room documents are wired to downloadable content", () => {
  const catalog = read("src/data/investor-documents.ts");
  for (const slug of wiredDocs) {
    assert.match(catalog, new RegExp(slug), `missing catalog entry for ${slug}`);
    assert.equal(existsSync(`public/docs/${slug}.md`), true, `missing public/docs/${slug}.md`);
  }
});

test("dashboard exposes document view and download actions", () => {
  const dashboard = read("src/routes/_authenticated/index.tsx");
  assert.match(dashboard, /trackDocumentView/);
  assert.match(dashboard, /Download/);
  assert.match(dashboard, /Selected document/);
  assert.match(dashboard, /Diligence checklist/);
});
