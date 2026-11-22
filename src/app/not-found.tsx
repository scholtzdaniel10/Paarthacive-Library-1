import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="font-serif text-7xl text-accent">404</p>
      <h1 className="mt-4 font-serif text-3xl">This page was never written</h1>
      <p className="mt-2 text-muted">Or someone borrowed it and didn&apos;t bring it back.</p>
      <Link href="/books" className="btn-primary mt-8">
        Back to the shelves
      </Link>
    </div>
  );
}
