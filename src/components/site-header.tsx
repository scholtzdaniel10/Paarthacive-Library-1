import Link from "next/link";
import { Suspense } from "react";
import { NavLinks, StaticNavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-baseline gap-1.5" aria-label="Authors Corner home">
          <span className="grid size-8 place-items-center rounded-md bg-ink font-serif text-lg text-paper">A</span>
          <span className="hidden font-serif text-xl tracking-tight sm:inline">
            Authors <em className="text-accent">Corner</em>
          </span>
        </Link>

        <form action="/books" className="relative ml-auto w-full max-w-xs" role="search">
          <label htmlFor="site-search" className="sr-only">
            Search books
          </label>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search titles, authors…"
            className="field rounded-full py-2 pl-9 text-base sm:text-sm"
          />
        </form>
      </div>
      <Suspense fallback={<StaticNavLinks />}>
        <NavLinks />
      </Suspense>
    </header>
  );
}
