"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/blog-types";
import { formatDate } from "@/lib/hackathon-types";
import { trackEngagement } from "@/lib/track";
import { BlogCardArt } from "./BlogCardArt";

/** A single blog post card, shared by the home section and the blog listing. */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={() => trackEngagement({ type: "blog", event: "click", id: post.id })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-32 w-full overflow-hidden">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <BlogCardArt post={post} />
        )}
        <div className="relative flex h-full items-end justify-between gap-2 p-4">
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-black">
            {formatDate(post.date)}
          </span>
          {post.type && (
            <span className="rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {post.type}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
          {post.title}
        </h3>
        {post.author && (
          <p className="mt-1 text-xs font-medium text-[var(--muted)]">
            By {post.author}
          </p>
        )}
        <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-all group-hover:translate-x-0.5">
          Read more →
        </span>
      </div>
    </Link>
  );
}
