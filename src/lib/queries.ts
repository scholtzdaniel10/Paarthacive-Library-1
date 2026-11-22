import "server-only";
import { connection } from "next/server";
import { and, arrayContains, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { books, bookViews, type Book } from "@/db/schema";

export type Period = "day" | "week" | "month" | "all";
export const PERIODS: Period[] = ["day", "week", "month", "all"];
export type Sort = "newest" | "popular" | "title";

const PERIOD_MS: Record<Exclude<Period, "all">, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
};

async function db() {
  // All reads hit live data at request time.
  await connection();
  return getDb();
}

export async function getNewest(limit = 10): Promise<Book[]> {
  return (await db()).select().from(books).orderBy(desc(books.createdAt), desc(books.id)).limit(limit);
}

export async function getFeatured(limit = 5): Promise<Book[]> {
  // Featured = most viewed books that have a cover image.
  return (await db())
    .select()
    .from(books)
    .where(sql`${books.coverUrl} is not null`)
    .orderBy(desc(books.views))
    .limit(limit);
}

export async function getTrending(period: Period, limit = 10): Promise<Book[]> {
  const d = await db();
  if (period === "all") {
    return d.select().from(books).orderBy(desc(books.views), desc(books.id)).limit(limit);
  }
  const since = new Date(Date.now() - PERIOD_MS[period]);
  const recent = d
    .select({ bookId: bookViews.bookId, n: sql<number>`count(*)::int`.as("n") })
    .from(bookViews)
    .where(gte(bookViews.viewedAt, since))
    .groupBy(bookViews.bookId)
    .as("recent");
  const rows = await d
    .select({ book: books })
    .from(recent)
    .innerJoin(books, eq(books.id, recent.bookId))
    .orderBy(desc(recent.n), desc(books.views))
    .limit(limit);
  return rows.map((r) => r.book);
}

export async function searchBooks(opts: {
  q?: string;
  genre?: string;
  sort?: Sort;
}): Promise<Book[]> {
  const filters = [];
  const q = opts.q?.trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    filters.push(or(ilike(books.title, like), ilike(books.author, like), ilike(books.description, like)));
  }
  if (opts.genre) filters.push(arrayContains(books.genres, [opts.genre]));

  const order =
    opts.sort === "popular"
      ? [desc(books.views)]
      : opts.sort === "title"
        ? [books.title]
        : [desc(books.createdAt), desc(books.id)];

  return (await db())
    .select()
    .from(books)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(...order)
    .limit(100);
}

export async function getBookBySlug(slug: string): Promise<Book | undefined> {
  const [book] = await (await db()).select().from(books).where(eq(books.slug, slug)).limit(1);
  return book;
}

export async function getBooksByAuthor(author: string): Promise<Book[]> {
  return (await db())
    .select()
    .from(books)
    .where(eq(books.author, author))
    .orderBy(books.publishedYear, books.title);
}

export async function getGenres(): Promise<{ genre: string; count: number }[]> {
  const res = await (await db()).execute(
    sql`select g as genre, count(*)::int as count
        from ${books}, unnest(${books.genres}) as g
        group by g order by count desc, g asc`,
  );
  return res.rows as { genre: string; count: number }[];
}

export async function getAuthors(): Promise<
  { author: string; count: number; views: number }[]
> {
  return (await db())
    .select({
      author: books.author,
      count: sql<number>`count(*)::int`,
      views: sql<number>`coalesce(sum(${books.views}), 0)::int`,
    })
    .from(books)
    .groupBy(books.author)
    .orderBy(books.author);
}

export async function getStats() {
  const [row] = await (await db())
    .select({
      books: sql<number>`count(*)::int`,
      authors: sql<number>`count(distinct ${books.author})::int`,
    })
    .from(books);
  return row;
}

export async function recordView(bookId: number) {
  const d = await getDb();
  await d.insert(bookViews).values({ bookId });
  await d.update(books).set({ views: sql`${books.views} + 1` }).where(eq(books.id, bookId));
}

export async function slugExists(slug: string) {
  const [row] = await (await getDb()).select({ id: books.id }).from(books).where(eq(books.slug, slug)).limit(1);
  return Boolean(row);
}
