"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/blog-types";
import { BlogCard } from "./BlogCard";

type SortOrder = "newest" | "oldest";

const ALL = "All";

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [type, setType] = useState<string>(ALL);
  const [sort, setSort] = useState<SortOrder>("newest");

  // Build the filter options from the types actually present on the posts so
  // the bar only ever shows categories that have something to show.
  const types = useMemo(() => {
    const present = new Set<string>();
    for (const p of posts) {
      if (p.type) present.add(p.type);
    }
    return [ALL, ...Array.from(present).sort()];
  }, [posts]);

  const visible = useMemo(() => {
    const filtered =
      type === ALL ? posts : posts.filter((p) => p.type === type);
    return [...filtered].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === "newest" ? -diff : diff;
    });
  }, [posts, type, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
            const active = t === type;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Date sort */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="blog-sort"
            className="text-sm font-medium text-[var(--muted)]"
          >
            Sort by
          </label>
          <select
            id="blog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Showing {visible.length} {visible.length === 1 ? "post" : "posts"}
        {type !== ALL ? ` in ${type}` : ""}.
      </p>

      {visible.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-[var(--muted)]">
          No posts in this category yet.
        </p>
      )}
    </div>
  );
}
