import "server-only";
import { randomUUID } from "node:crypto";

export const MAX_COVER_BYTES = 4 * 1024 * 1024; // Vercel functions accept ~4.5 MB bodies
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export function validateCover(file: File): string | null {
  if (!ALLOWED.has(file.type)) return "Cover must be a JPG, PNG, WebP or AVIF image.";
  if (file.size > MAX_COVER_BYTES) return "Cover must be 4 MB or smaller.";
  return null;
}

/**
 * Saves a cover image and returns its public URL.
 * With BLOB_READ_WRITE_TOKEN (Vercel Blob) it goes to the cloud;
 * otherwise (local dev) it lands in public/uploads.
 */
export async function saveCover(file: File, slug: string): Promise<string> {
  const ext = ALLOWED.get(file.type) ?? "jpg";
  const name = `covers/${slug}-${randomUUID().slice(0, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Cover uploads need Vercel Blob. Add a Blob store under Vercel → Storage.");
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads", "covers");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
