import "server-only";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type DB = NeonHttpDatabase<typeof schema>;

/**
 * Production: Neon Postgres over HTTP (DATABASE_URL, set by the Neon
 * integration on Vercel).
 * Local dev without DATABASE_URL: an embedded Postgres (PGlite) stored in
 * ./.pglite, migrated and seeded on first use. No install, no account.
 */
let dbPromise: Promise<DB> | undefined;

export function getDb(): Promise<DB> {
  dbPromise ??= createDb();
  return dbPromise;
}

async function createDb(): Promise<DB> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema });
  }

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon database under Vercel → Storage, then redeploy.",
    );
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { seed } = await import("./seed");

  const db = drizzle(new PGlite("./.pglite"), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  await seed(db as unknown as DB);
  return db as unknown as DB;
}
