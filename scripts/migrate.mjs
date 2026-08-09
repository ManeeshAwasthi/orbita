import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

function loadEnvFile(filePath) {
  return fs
    .readFile(filePath, "utf8")
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const normalized = trimmed.replace(/^export\s+/, "");
        const [rawKey, ...rest] = normalized.split("=");
        const key = rawKey.trim();
        if (process.env[key]) continue;
        process.env[key] = rest.join("=").trim().replace(/^["']|["']$/g, "");
      }
    })
    .catch(() => undefined);
}

await loadEnvFile(path.join(process.cwd(), ".env.local"));
await loadEnvFile(path.join(process.cwd(), ".env.production.local"));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Pull Vercel env vars or set it locally first.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  await pool.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  for (const file of files) {
    const applied = await pool.query("select 1 from schema_migrations where id = $1", [file]);
    if (applied.rowCount) {
      console.log(`skip ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await pool.query("begin");
    try {
      await pool.query(sql);
      await pool.query("insert into schema_migrations (id) values ($1)", [file]);
      await pool.query("commit");
      console.log(`applied ${file}`);
    } catch (error) {
      await pool.query("rollback");
      throw error;
    }
  }
} finally {
  await pool.end();
}
