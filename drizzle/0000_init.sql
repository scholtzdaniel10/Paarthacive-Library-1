CREATE TABLE "book_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"genres" text[] DEFAULT '{}' NOT NULL,
	"cover_url" text,
	"published_year" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "book_views" ADD CONSTRAINT "book_views_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_views_viewed_at_idx" ON "book_views" USING btree ("viewed_at","book_id");--> statement-breakpoint
CREATE INDEX "books_author_idx" ON "books" USING btree ("author");