import Link from "next/link";
import type { Book } from "@/db/schema";
import { BookCover } from "./book-cover";

export function BookCard({ book, rank }: { book: Book; rank?: number }) {
  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <div className="relative transition-transform duration-200 ease-out group-hover:-translate-y-1">
        <BookCover book={book} sizes="(min-width: 1024px) 180px, 40vw" />
        {rank !== undefined && (
          <span className="absolute -left-2 -top-2 grid size-7 place-items-center rounded-full bg-ink font-serif text-sm text-paper shadow">
            {rank}
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 font-serif text-[15px] leading-snug group-hover:text-accent">{book.title}</p>
      <p className="mt-0.5 truncate text-[13px] text-muted">{book.author}</p>
    </Link>
  );
}

export function BookGrid({ books, ranked }: { books: Book[]; ranked?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((b, i) => (
        <li key={b.id}>
          <BookCard book={b} rank={ranked ? i + 1 : undefined} />
        </li>
      ))}
    </ul>
  );
}

export function Shelf({ books }: { books: Book[] }) {
  return (
    <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-2 sm:-mx-6 sm:px-6">
      {books.map((b) => (
        <li key={b.id} className="w-[38vw] max-w-[168px] shrink-0 snap-start">
          <BookCard book={b} />
        </li>
      ))}
    </ul>
  );
}

export function GridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="aspect-[2/3] animate-pulse rounded-md bg-line/70" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-line/70" />
          <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-line/50" />
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <p className="font-serif text-xl">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
