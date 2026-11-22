"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Browse" },
  { href: "/authors", label: "Authors" },
  { href: "/add", label: "Add a book" },
];

export function NavLinks() {
  return <NavList pathname={usePathname()} />;
}

export function StaticNavLinks() {
  return <NavList pathname="" />;
}

function NavList({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Main" className="mx-auto max-w-6xl px-4 sm:px-6">
      <ul className="scrollbar-none -mb-px flex gap-6 overflow-x-auto text-sm">
        {LINKS.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 py-2.5 transition-colors ${
                  active ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
