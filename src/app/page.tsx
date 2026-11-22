import Link from "next/link";
import { Suspense } from "react";
import { BookCover } from "@/components/book-cover";
import { BookGrid, EmptyState, GridSkeleton, Shelf } from "@/components/book-card";
import { PeriodTabs } from "@/components/period-tabs";
import {
  getFeatured,
  getGenres,
  getNewest,
  getStats,
  getTrending,
  PERIODS,
  type Period,
} from "@/lib/queries";
import { genreHref } from "@/lib/utils";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <section className="grid gap-10 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:py-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">A reader&apos;s library</p>
          <h1 className="mt-3 font-serif text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] tracking-tight [text-wrap:balance]">
            Every book has someone behind it.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Browse the shelves, see what people are reading this week, and get to know the authors.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/books" className="btn-primary">
              Browse the shelves
            </Link>
            <Link href="/authors" className="btn-ghost">
              Meet the authors
            </Link>
          </div>
          <Suspense fallback={<p className="mt-8 h-5" />}>
            <Stats />
          </Suspense>
        </div>
        <Suspense fallback={<div className="aspect-[4/3] animate-pulse rounded-3xl bg-line/60" />}>
          <Spotlight />
        </Suspense>
      </section>

      <section className="py-8" aria-labelledby="trending">
        <Suspense fallback={<SectionHeading id="trending" title="Trending" />}>
          <TrendingHeader searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<GridSkeleton />}>
          <Trending searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="py-8" aria-labelledby="newest">
        <SectionHeading id="newest" title="Fresh on the shelf" href="/books?sort=newest" />
        <Suspense fallback={<GridSkeleton />}>
          <Newest />
        </Suspense>
      </section>

      <section className="py-8" aria-labelledby="genres">
        <SectionHeading id="genres" title="Wander by genre" />
        <Suspense fallback={<div className="h-9" />}>
          <Genres />
        </Suspense>
      </section>
    </>
  );
}

function SectionHeading({
  id,
  title,
  href,
  children,
}: {
  id: string;
  title: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
      <h2 id={id} className="font-serif text-2xl tracking-tight sm:text-[1.7rem]">
        {title}
      </h2>
      {children}
      {href && (
        <Link href={href} className="text-sm text-muted hover:text-accent">
          See all →
        </Link>
      )}
    </div>
  );
}

function parsePeriod(v: string | string[] | undefined): Period {
  return PERIODS.includes(v as Period) ? (v as Period) : "week";
}

async function TrendingHeader({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const period = parsePeriod((await searchParams).period);
  return (
    <SectionHeading id="trending" title="Trending">
      <PeriodTabs active={period} />
    </SectionHeading>
  );
}

async function Trending({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const period = parsePeriod((await searchParams).period);
  const books = await getTrending(period);
  if (!books.length)
    return (
      <EmptyState title="Quiet on the shelves">
        Nobody has opened a book {period === "day" ? "today" : `this ${period}`} yet.{" "}
        <Link href="/?period=all" className="text-accent underline-offset-2 hover:underline" scroll={false}>
          See all-time favourites
        </Link>
      </EmptyState>
    );
  return <BookGrid books={books} ranked />;
}

async function Newest() {
  const books = await getNewest(12);
  if (!books.length) return <EmptyState title="No books yet">Add the first one.</EmptyState>;
  return <Shelf books={books} />;
}

async function Spotlight() {
  const [book] = await getFeatured(1);
  if (!book) return null;
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group relative grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-6 overflow-hidden rounded-3xl border border-line bg-card p-6 sm:p-8"
    >
      <div
        aria-hidden
        className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-80"
      />
      <BookCover
        book={book}
        priority
        sizes="(min-width: 768px) 220px, 40vw"
        className="rotate-[-3deg] transition-transform duration-300 group-hover:rotate-0"
      />
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Most read</p>
        <p className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{book.title}</p>
        <p className="mt-1 text-sm text-muted">{book.author}</p>
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted">{book.description}</p>
        <p className="mt-5 text-sm font-medium text-ink group-hover:text-accent">Open the book →</p>
      </div>
    </Link>
  );
}

async function Stats() {
  const s = await getStats();
  return (
    <p className="mt-8 text-sm text-muted">
      <strong className="font-serif text-lg font-normal text-ink">{s.books}</strong> books ·{" "}
      <strong className="font-serif text-lg font-normal text-ink">{s.authors}</strong> authors
    </p>
  );
}

async function Genres() {
  const genres = await getGenres();
  if (!genres.length) return <p className="text-sm text-muted">No genres yet.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {genres.map(({ genre, count }) => (
        <li key={genre}>
          <Link href={genreHref(genre)} className="chip text-sm">
            {genre} <span className="ml-1.5 text-muted/70">{count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

