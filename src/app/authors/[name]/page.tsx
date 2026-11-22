import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookGrid, GridSkeleton } from "@/components/book-card";
import { getBooksByAuthor } from "@/lib/queries";
import { compact, hueFor, initials } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/authors/[name]">) {
  return { title: decodeURIComponent((await params).name) };
}

export default function AuthorPage({ params }: PageProps<"/authors/[name]">) {
  return (
    <div className="py-10">
      <Link href="/authors" className="text-sm text-muted hover:text-ink">
        ← All authors
      </Link>
      <Suspense fallback={<GridSkeleton />}>
        <Author params={params} />
      </Suspense>
    </div>
  );
}

async function Author({ params }: Pick<PageProps<"/authors/[name]">, "params">) {
  const name = decodeURIComponent((await params).name);
  const books = await getBooksByAuthor(name);
  if (!books.length) notFound();

  const hue = hueFor(name);
  const reads = books.reduce((n, b) => n + b.views, 0);
  const years = books.map((b) => b.publishedYear).filter((y): y is number => y !== null);
  const genres = [...new Set(books.flatMap((b) => b.genres))].filter((g) => g !== "Classic").slice(0, 4);

  return (
    <>
      <header className="mt-6 flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-center">
        <span
          aria-hidden
          className="grid size-24 shrink-0 place-items-center rounded-full font-serif text-4xl"
          style={{ background: `hsl(${hue} 40% 30%)`, color: `hsl(${hue} 50% 92%)` }}
        >
          {initials(name)}
        </span>
        <div>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-none tracking-tight">{name}</h1>
          <p className="mt-3 text-muted">
            {books.length} {books.length === 1 ? "book" : "books"} on the shelf · {compact.format(reads)} reads
            {years.length > 0 && (
              <>
                {" "}
                · writing{" "}
                {Math.min(...years) === Math.max(...years)
                  ? `in ${years[0]}`
                  : `${Math.min(...years)}–${Math.max(...years)}`}
              </>
            )}
          </p>
          {genres.length > 0 && <p className="mt-1 text-sm text-muted">Mostly {genres.join(", ").toLowerCase()}</p>}
        </div>
      </header>
      <div className="mt-10">
        <BookGrid books={books} />
      </div>
    </>
  );
}
