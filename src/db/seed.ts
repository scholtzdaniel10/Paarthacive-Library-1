import { sql } from "drizzle-orm";
import type { DB } from "./index";
import { books, type NewBook } from "./schema";

// Public-domain classics so a fresh database has something to show.
const SAMPLE_BOOKS: NewBook[] = [
  {
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publishedYear: 1813,
    genres: ["Romance", "Classic"],
    coverUrl: "/covers/sample1.jpg",
    views: 128,
    description:
      "Elizabeth Bennet trades sharp words with the proud Mr. Darcy in a comedy of manners about first impressions and the courage to change your mind.",
  },
  {
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    publishedYear: 1818,
    genres: ["Gothic", "Science Fiction", "Classic"],
    coverUrl: "/covers/sample2.jpg",
    views: 96,
    description:
      "A young scientist builds a living being and then abandons it. The creature's search for a place in the world becomes a story about responsibility and loneliness.",
  },
  {
    slug: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    publishedYear: 1851,
    genres: ["Adventure", "Classic"],
    coverUrl: "/covers/sample3.jpg",
    views: 71,
    description:
      "Ishmael signs onto the whaler Pequod, whose captain is set on hunting down the white whale that took his leg.",
  },
  {
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    publishedYear: 1897,
    genres: ["Gothic", "Horror", "Classic"],
    coverUrl: "/covers/sample4.jpg",
    views: 64,
    description:
      "Told through letters and diary entries, a small group races to stop a Transylvanian count who has arrived in England.",
  },
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publishedYear: 1925,
    genres: ["Literary Fiction", "Classic"],
    coverUrl: "/covers/sample5.jpg",
    views: 88,
    description:
      "Nick Carraway watches his mysterious neighbour throw lavish parties on Long Island, all in the hope of winning back the woman across the bay.",
  },
  {
    slug: "persuasion",
    title: "Persuasion",
    author: "Jane Austen",
    publishedYear: 1817,
    genres: ["Romance", "Classic"],
    coverUrl: null,
    views: 22,
    description:
      "Eight years after being talked out of an engagement, Anne Elliot meets Captain Wentworth again.",
  },
  {
    slug: "the-time-machine",
    title: "The Time Machine",
    author: "H. G. Wells",
    publishedYear: 1895,
    genres: ["Science Fiction", "Classic"],
    coverUrl: null,
    views: 37,
    description:
      "A Victorian inventor travels to the year 802,701 and finds humanity split into two very different species.",
  },
  {
    slug: "the-picture-of-dorian-gray",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    publishedYear: 1890,
    genres: ["Gothic", "Literary Fiction", "Classic"],
    coverUrl: null,
    views: 45,
    description:
      "A beautiful young man stays young while his portrait ages and darkens with every sin.",
  },
];

/** Inserts the sample books only when the table is empty. */
export async function seed(db: DB) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books);
  if (count > 0) return false;
  await db.insert(books).values(SAMPLE_BOOKS);
  return true;
}
