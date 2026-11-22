import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";
import { BookCover } from "@/components/book-cover";
import { Shelf } from "@/components/book-card";
import { getBookBySlug, getBooksByAuthor, recordView } from "@/lib/queries";
import { authorHref, compact, genreHref } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/books/[slug]">) {
  const book = await getBookBySlug((await params).slug);
  return book
    ? { title: book.title, description: book.description.slice(0, 160) || `${book.title} by ${book.author}` }
    : { title: "Book not found" };
}

export default function BookPage({ params, searchParams }: PageProps<"/books/[slug]">) {
  return (
    <Suspense fallback={<BookSkeleton />}>
      <BookDetail params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function BookDetail({ params, searchParams }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const { added } = await searchParams;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  // Count the view after the response is sent, so it never slows the page.
  after(() => recordView(book.id).catch((e) => console.error("recordView failed", e)));

  return (
    <article className="py-10">
      {added && (
        <p role="status" className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
          Added to the shelves. It&apos;s live for everyone now.
        </p>
      )}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/books" className="hover:text-ink">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{book.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-14">
        <BookCover book={book} priority sizes="(min-width: 768px) 300px, 70vw" className="mx-auto w-2/3 max-w-[300px] md:w-full" />
        <div>
          <h1 className="font-serif text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-tight [text-wrap:balance]">
            {book.title}
          </h1>
          <p className="mt-3 text-lg">
            by{" "}
            <Link href={authorHref(book.author)} className="text-accent underline-offset-4 hover:underline">
              {book.author}
            </Link>
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {book.publishedYear && (
              <div>
                <dt className="text-muted">Published</dt>
                <dd className="font-serif text-lg">{book.publishedYear}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Reads</dt>
              <dd className="font-serif text-lg">{compact.format(book.views + 1)}</dd>
            </div>
            <div>
              <dt className="text-muted">On the shelf since</dt>
              <dd className="font-serif text-lg">
                {book.createdAt.toLocaleDateString("en", { month: "short", year: "numeric" })}
              </dd>
            </div>
          </dl>

          {book.genres.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {book.genres.map((g) => (
                <li key={g}>
                  <Link href={genreHref(g)} className="chip">
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 max-w-prose whitespace-pre-line text-[17px] leading-relaxed">
            {book.description || <span className="text-muted">No description yet.</span>}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <MoreByAuthor author={book.author} excludeId={book.id} />
      </Suspense>
    </article>
  );
}

async function MoreByAuthor({ author, excludeId }: { author: string; excludeId: number }) {
  const others = (await getBooksByAuthor(author)).filter((b) => b.id !== excludeId);
  if (!others.length) return null;
  return (
    <section className="mt-16 border-t border-line pt-8">
      <h2 className="mb-6 font-serif text-2xl">More from {author}</h2>
      <Shelf books={others} />
    </section>
  );
}

function BookSkeleton() {
  return (
    <div className="grid gap-10 py-10 md:grid-cols-[300px_1fr]" aria-hidden>
      <div className="mx-auto aspect-[2/3] w-2/3 animate-pulse rounded-md bg-line/70 md:w-full" />
      <div className="space-y-4">
        <div className="h-12 w-3/4 animate-pulse rounded bg-line/70" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-line/60" />
        <div className="h-32 w-full animate-pulse rounded bg-line/50" />
      </div>
    </div>
  );
}
