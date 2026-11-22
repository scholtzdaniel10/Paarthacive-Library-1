import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookGrid, EmptyState, GridSkeleton } from "@/components/book-card";
import { getGenres, searchBooks, type Sort } from "@/lib/queries";

export const metadata: Metadata = { title: "Browse" };

type SP = Awaited<PageProps<"/books">["searchParams"]>;

const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most read" },
  { value: "title", label: "A–Z" },
];

function read(sp: SP) {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const sort = one(sp.sort) as Sort;
  return {
    q: one(sp.q).slice(0, 100),
    genre: one(sp.genre).slice(0, 60),
    sort: SORTS.some((s) => s.value === sort) ? sort : "newest",
  };
}

function href(params: { q: string; genre: string; sort: Sort }, patch: Partial<typeof params>) {
  const next = { ...params, ...patch };
  const sp = new URLSearchParams();
  if (next.q) sp.set("q", next.q);
  if (next.genre) sp.set("genre", next.genre);
  if (next.sort !== "newest") sp.set("sort", next.sort);
  const s = sp.toString();
  return s ? `/books?${s}` : "/books";
}

export default function BrowsePage({ searchParams }: PageProps<"/books">) {
  return (
    <div className="py-10">
      <h1 className="font-serif text-4xl tracking-tight">The shelves</h1>
      <Suspense fallback={<div className="mt-8 h-24" />}>
        <Filters searchParams={searchParams} />
      </Suspense>
      <div className="mt-8">
        <Suspense fallback={<GridSkeleton count={10} />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function Filters({ searchParams }: Pick<PageProps<"/books">, "searchParams">) {
  const params = read(await searchParams);
  const genres = await getGenres();
  return (
    <div className="mt-6 space-y-4">
      <form action="/books" className="flex max-w-xl gap-2" role="search">
        {params.genre && <input type="hidden" name="genre" value={params.genre} />}
        {params.sort !== "newest" && <input type="hidden" name="sort" value={params.sort} />}
        <label htmlFor="browse-q" className="sr-only">
          Search
        </label>
        <input
          id="browse-q"
          name="q"
          type="search"
          defaultValue={params.q}
          placeholder="Title, author or a word from the blurb"
          className="field text-base sm:text-[15px]"
        />
        <button className="btn-primary shrink-0">Search</button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <li>
            <Link href={href(params, { genre: "" })} className={`chip whitespace-nowrap ${!params.genre ? "border-ink bg-ink text-paper hover:text-paper" : ""}`}>
              All genres
            </Link>
          </li>
          {genres.map(({ genre }) => (
            <li key={genre}>
              <Link
                href={href(params, { genre: genre === params.genre ? "" : genre })}
                className={`chip whitespace-nowrap ${genre === params.genre ? "border-ink bg-ink text-paper hover:text-paper" : ""}`}
              >
                {genre}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 text-sm" aria-label="Sort">
          <span className="mr-1 text-muted">Sort</span>
          {SORTS.map((s) => (
            <Link
              key={s.value}
              href={href(params, { sort: s.value })}
              aria-current={s.value === params.sort ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 ${s.value === params.sort ? "bg-card text-ink ring-1 ring-line" : "text-muted hover:text-ink"}`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/books">, "searchParams">) {
  const params = read(await searchParams);
  const books = await searchBooks(params);
  const filtered = params.q || params.genre;
  return (
    <>
      <p className="mb-6 text-sm text-muted" aria-live="polite">
        {books.length} {books.length === 1 ? "book" : "books"}
        {params.q && <> matching “{params.q}”</>}
        {params.genre && <> in {params.genre}</>}
        {filtered && (
          <>
            {" · "}
            <Link href="/books" className="text-accent hover:underline">
              Clear
            </Link>
          </>
        )}
      </p>
      {books.length ? (
        <BookGrid books={books} />
      ) : (
        <EmptyState title="Nothing on this shelf">Try a shorter search or a different genre.</EmptyState>
      )}
    </>
  );
}
