import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logoutAction } from "@/app/actions";
import { isEditor } from "@/lib/auth";
import { AddBookForm } from "./add-book-form";

export const metadata: Metadata = { title: "Add a book" };

export default function AddPage() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <Gate />
      </Suspense>
    </div>
  );
}

async function Gate() {
  if (!(await isEditor())) redirect("/login?next=/add");
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Add a book</h1>
          <p className="mt-2 text-muted">It goes on the shelves as soon as you save it.</p>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-muted hover:text-ink">Sign out</button>
        </form>
      </div>
      <AddBookForm />
    </>
  );
}
