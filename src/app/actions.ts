"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { books } from "@/db/schema";
import { isEditor, signIn, signOut } from "@/lib/auth";
import { slugExists } from "@/lib/queries";
import { saveCover, validateCover } from "@/lib/storage";
import { slugify } from "@/lib/utils";

export type FormState = {
  error?: string;
  fields?: Record<string, string>;
};

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) return { error: "That password didn't match." };
  const next = String(formData.get("next") ?? "/add");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/add");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}

export async function addBookAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isEditor())) redirect("/login?next=/add");

  const fields = {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    genres: String(formData.get("genres") ?? ""),
    publishedYear: String(formData.get("publishedYear") ?? "").trim(),
  };

  if (!fields.title) return { error: "Give the book a title.", fields };
  if (!fields.author) return { error: "Who wrote it? Add an author.", fields };
  if (fields.title.length > 200 || fields.author.length > 120)
    return { error: "Title or author is too long.", fields };
  if (fields.description.length > 4000)
    return { error: "Keep the description under 4,000 characters.", fields };

  const year = fields.publishedYear ? Number(fields.publishedYear) : null;
  if (year !== null && (!Number.isInteger(year) || year < -3000 || year > new Date().getFullYear() + 1))
    return { error: "Published year doesn't look right.", fields };

  const genres = [
    ...new Set(
      fields.genres
        .split(",")
        .map((g) => g.trim().replace(/\s+/g, " "))
        .filter(Boolean)
        .map((g) => g[0].toUpperCase() + g.slice(1)),
    ),
  ].slice(0, 8);

  const base = slugify(fields.title) || "book";
  let slug = base;
  for (let i = 2; await slugExists(slug); i++) slug = `${base}-${i}`;

  let coverUrl: string | null = null;
  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const problem = validateCover(cover);
    if (problem) return { error: problem, fields };
    try {
      coverUrl = await saveCover(cover, slug);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Cover upload failed.", fields };
    }
  }

  const db = await getDb();
  await db.insert(books).values({
    slug,
    title: fields.title,
    author: fields.author,
    description: fields.description,
    genres,
    publishedYear: year,
    coverUrl,
  });

  revalidatePath("/", "layout");
  redirect(`/books/${slug}?added=1`);
}
