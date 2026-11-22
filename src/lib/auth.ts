import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-editor auth: one ADMIN_PASSWORD env var guards adding books.
 * The cookie holds an HMAC of the password, so changing the password logs everyone out.
 * Swap for Auth.js / Clerk when you want reader accounts.
 */
const COOKIE = "ac_session";
const DEV_PASSWORD = "letmein";

function password() {
  const p = process.env.ADMIN_PASSWORD;
  if (p) return p;
  if (process.env.NODE_ENV === "production") return null; // locked until set
  return DEV_PASSWORD;
}

function token(pw: string) {
  return createHmac("sha256", pw).update("authors-corner-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function isEditor(): Promise<boolean> {
  const pw = password();
  if (!pw) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value && safeEqual(value, token(pw)));
}

export async function signIn(attempt: string): Promise<boolean> {
  const pw = password();
  if (!pw || !safeEqual(attempt, pw)) return false;
  (await cookies()).set(COOKIE, token(pw), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}

export const isUsingDevPassword = () => !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";
