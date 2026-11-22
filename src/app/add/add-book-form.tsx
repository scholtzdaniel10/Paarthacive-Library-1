"use client";

import { useActionState, useEffect, useState } from "react";
import { addBookAction, type FormState } from "@/app/actions";

const MAX = 4 * 1024 * 1024;

export function AddBookForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(addBookAction, {});
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const f = state.fields ?? {};

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return setPreview(null);
    if (file.size > MAX) {
      setFileError("That image is over 4 MB. Try a smaller one.");
      e.target.value = "";
      return setPreview(null);
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={action} className="mt-8 grid gap-6 sm:grid-cols-[160px_1fr]">
      <div>
        <label
          htmlFor="cover"
          className="relative flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-line bg-card text-center text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Cover preview" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <span className="text-2xl" aria-hidden>
                +
              </span>
              <span className="mt-1 px-3">Cover image</span>
              <span className="mt-1 px-3 text-xs opacity-70">optional · JPG, PNG, WebP</span>
            </>
          )}
        </label>
        <input id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onFile} className="sr-only" />
        {preview && (
          <p className="mt-2 text-center text-xs text-muted">Click the cover to change it</p>
        )}
        {fileError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fileError}</p>}
      </div>

      <div className="space-y-5">
        <Field label="Title" name="title" required defaultValue={f.title} />
        <Field label="Author" name="author" required defaultValue={f.author} autoComplete="off" />
        <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
          <Field label="Genres" name="genres" hint="Comma separated, e.g. Mystery, Classic" defaultValue={f.genres} />
          <Field label="Year" name="publishedYear" inputMode="numeric" defaultValue={f.publishedYear} />
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={4000}
            defaultValue={f.description}
            className="field resize-y text-base sm:text-[15px]"
            placeholder="What's it about? Two or three sentences is plenty."
          />
        </div>

        {state.error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300">
            {state.error}
          </p>
        )}

        <button className="btn-primary w-full sm:w-auto" disabled={pending}>
          {pending ? "Saving…" : "Put it on the shelf"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  hint,
  ...props
}: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {props.required && <span className="text-accent"> *</span>}
      </label>
      <input id={name} name={name} className="field text-base sm:text-[15px]" {...props} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
