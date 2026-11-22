/**
 * Runs on every `npm run build` (so every Vercel deploy):
 * applies pending migrations to Neon and seeds sample books into an empty DB.
 * Skips quietly when DATABASE_URL is not set (local dev uses PGlite instead).
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";
import type { DB } from "../src/db/index";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set, skipping (local dev uses PGlite).");
    return;
  }
  const db = drizzle(neon(url), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] migrations applied");
  if (process.env.SKIP_SEED !== "1" && (await seed(db as DB))) {
    console.log("[migrate] seeded sample books");
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
