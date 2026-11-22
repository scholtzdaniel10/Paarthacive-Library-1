import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/book-card";
import { getAuthors } from "@/lib/queries";
import { authorHref, compact, hueFor, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Authors" };

export default function AuthorsPage() {
  return (
    <div className="py-10">
      <h1 className="font-serif text-4xl tracking-tight">The authors</h1>
      <p className="mt-2 text-muted">The people behind the pages, alphabetically.</p>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-2xl bg-line/50" />}>
        <AuthorList />
      </Suspense>
    </div>
  );
}

async function AuthorList() {
  const authors = await getAuthors();
  if (!authors.length) return <EmptyState title="No authors yet" />;
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {authors.map((a) => {
        const hue = hueFor(a.author);
        return (
          <li key={a.author}>
            <Link
              href={authorHref(a.author)}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-accent"
            >
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-full font-serif text-lg"
                style={{ background: `hsl(${hue} 40% 30%)`, color: `hsl(${hue} 50% 92%)` }}
              >
                {initials(a.author)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-serif text-lg group-hover:text-accent">{a.author}</span>
                <span className="text-sm text-muted">
                  {a.count} {a.count === 1 ? "book" : "books"} · {compact.format(a.views)} reads
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
