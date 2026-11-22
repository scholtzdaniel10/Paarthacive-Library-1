import Link from "next/link";
import type { Period } from "@/lib/queries";

const LABELS: Record<Period, string> = { day: "Today", week: "This week", month: "This month", all: "All time" };

export function PeriodTabs({ active }: { active: Period }) {
  return (
    <div role="tablist" aria-label="Trending period" className="flex rounded-full border border-line bg-card p-1 text-sm">
      {(Object.keys(LABELS) as Period[]).map((p) => (
        <Link
          key={p}
          role="tab"
          aria-selected={p === active}
          href={p === "week" ? "/" : `/?period=${p}`}
          scroll={false}
          className={`whitespace-nowrap rounded-full px-3 py-1 transition-colors ${
            p === active ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {LABELS[p]}
        </Link>
      ))}
    </div>
  );
}
