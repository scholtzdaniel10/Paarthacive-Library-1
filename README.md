# Authors Corner

A small library site: browse books, see what's trending today / this week / this month, and get to know the authors. Formerly **Paarthacive Library**.

**Stack:** Next.js 16 (App Router, Server Actions) · Tailwind CSS 4 · Drizzle ORM · Neon Postgres · Vercel Blob. Everything fits in the free tiers.

## Run it locally (no accounts needed)

```sh
npm install
npm run dev
```

Open http://localhost:3000. With no `DATABASE_URL`, the app uses an embedded Postgres (PGlite) stored in `./.pglite` and seeds eight classics on first run. Cover uploads save to `public/uploads`. The editor password is `letmein`.

## Deploy to Vercel

1. Import this repo in Vercel (or it redeploys automatically if already linked).
2. **Storage → Create → Neon (Postgres)** and connect it to the project. This sets `DATABASE_URL`.
3. **Storage → Create → Blob** and connect it. This sets `BLOB_READ_WRITE_TOKEN`.
4. **Settings → Environment Variables:** add `ADMIN_PASSWORD`.
5. Redeploy. The build runs `scripts/migrate.ts`, which creates the tables and seeds sample books if the database is empty (set `SKIP_SEED=1` to skip seeding).

## Pages

| Route | What it does |
| --- | --- |
| `/` | Spotlight, trending (day / week / month / all time), newest, genres |
| `/books` | Search, filter by genre, sort |
| `/books/[slug]` | Book page. Each visit is counted after the response is sent |
| `/authors`, `/authors/[name]` | Author index and author pages |
| `/add` | Add a book with cover upload (editor only) |
| `/login` | Editor sign-in |

## Database

Schema lives in `src/db/schema.ts`. After changing it:

```sh
npm run db:generate   # writes a new SQL migration to ./drizzle
```

Migrations apply automatically on the next local start (PGlite) or deploy (Neon). `npm run db:studio` opens Drizzle Studio against `DATABASE_URL`.
