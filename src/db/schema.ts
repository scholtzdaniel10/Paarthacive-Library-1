import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const books = pgTable(
  "books",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    description: text("description").notNull().default(""),
    genres: text("genres").array().notNull().default([]),
    coverUrl: text("cover_url"),
    publishedYear: integer("published_year"),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("books_author_idx").on(t.author)],
);

// One row per page view, so "trending this day / week / month" is real.
export const bookViews = pgTable(
  "book_views",
  {
    id: serial("id").primaryKey(),
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("book_views_viewed_at_idx").on(t.viewedAt, t.bookId)],
);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
