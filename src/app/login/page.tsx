import type { Metadata } from "next";
import { Suspense } from "react";
import { isUsingDevPassword } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Editor sign in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="font-serif text-3xl tracking-tight">Editor sign in</h1>
      <p className="mt-2 text-sm text-muted">Only editors can add books. Readers don&apos;t need an account.</p>
      <Suspense fallback={<div className="mt-6 h-32" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const next = (await searchParams).next;
  return (
    <>
      <LoginForm next={typeof next === "string" ? next : "/add"} />
      {isUsingDevPassword() && (
        <p className="mt-6 rounded-lg border border-line bg-card px-3.5 py-2.5 text-xs text-muted">
          Local dev: password is <code className="font-mono text-ink">letmein</code>. Set{" "}
          <code className="font-mono text-ink">ADMIN_PASSWORD</code> to change it.
        </p>
      )}
    </>
  );
}
