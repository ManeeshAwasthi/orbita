import { Pool } from "pg";

declare global {
  var orbitaPool: Pool | undefined;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  globalThis.orbitaPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 3,
  });

  return globalThis.orbitaPool;
}

let schemaReady: Promise<void> | null = null;

export function ensureCoreSchema() {
  schemaReady ??= getPool().query(`
    create extension if not exists "pgcrypto";

    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email text unique,
      display_name text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists user_preferences (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      preference_key text not null,
      preference_value jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique (user_id, preference_key)
    );
  `).then(() => undefined);

  return schemaReady;
}

export async function ensureDefaultUser() {
  const pool = getPool();
  await ensureCoreSchema();
  const email = "owner@orbita.local";
  const result = await pool.query<{ id: string }>(
    `
      insert into users (email, display_name)
      values ($1, $2)
      on conflict (email)
      do update set updated_at = now()
      returning id
    `,
    [email, "Orbita Owner"],
  );

  return result.rows[0].id;
}

export async function readUserPreference<T>(key: string) {
  const pool = getPool();
  const userId = await ensureDefaultUser();
  const result = await pool.query<{ preference_value: T }>(
    `
      select preference_value
      from user_preferences
      where user_id = $1 and preference_key = $2
      limit 1
    `,
    [userId, key],
  );

  return result.rows[0]?.preference_value ?? null;
}

export async function writeUserPreference(key: string, value: unknown) {
  const pool = getPool();
  const userId = await ensureDefaultUser();
  await pool.query(
    `
      insert into user_preferences (user_id, preference_key, preference_value)
      values ($1, $2, $3::jsonb)
      on conflict (user_id, preference_key)
      do update set preference_value = excluded.preference_value, updated_at = now()
    `,
    [userId, key, JSON.stringify(value)],
  );
}
