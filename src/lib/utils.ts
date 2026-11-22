export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function authorHref(author: string) {
  return `/authors/${encodeURIComponent(author)}`;
}

export function genreHref(genre: string) {
  return `/books?genre=${encodeURIComponent(genre)}`;
}

/** Stable hue per string, for generated covers and author avatars. */
export function hueFor(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((p) => /^[A-Za-z]/.test(p))
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const compact = new Intl.NumberFormat("en", { notation: "compact" });
