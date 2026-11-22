import Image from "next/image";
import type { Book } from "@/db/schema";
import { hueFor } from "@/lib/utils";

type Props = {
  book: Pick<Book, "title" | "author" | "coverUrl">;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** A real cover when there is one, otherwise a typeset cloth-bound cover. */
export function BookCover({ book, sizes = "200px", priority, className = "" }: Props) {
  const frame = `relative aspect-[2/3] overflow-hidden rounded-[3px_8px_8px_3px] shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_24px_-12px_rgb(0_0_0/0.35)] ${className}`;

  if (book.coverUrl) {
    return (
      <div className={frame}>
        <Image src={book.coverUrl} alt={`Cover of ${book.title}`} fill sizes={sizes} priority={priority} className="object-cover" />
        <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
      </div>
    );
  }

  const hue = hueFor(book.title + book.author);
  return (
    <div
      className={`${frame} [container-type:inline-size] flex flex-col justify-between p-[9%] text-left`}
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 38% 34%), hsl(${(hue + 24) % 360} 42% 20%))`,
        color: `hsl(${hue} 50% 92%)`,
      }}
      role="img"
      aria-label={`Cover of ${book.title}`}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/30 to-transparent" />
      <span aria-hidden className="h-px w-1/3 bg-current opacity-50" />
      <p className="font-serif text-[clamp(0.85rem,7cqi,1.6rem)] leading-[1.1] [text-wrap:balance]">
        {book.title}
      </p>
      <p className="text-[0.65rem] uppercase tracking-[0.16em] opacity-75">{book.author}</p>
    </div>
  );
}
