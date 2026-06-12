import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { BlogCard } from "./BlogCard";

const HOME_LIMIT = 9;

export async function Blog() {
  const allPosts = await getBlogs();
  const posts = allPosts.slice(0, HOME_LIMIT);
  const hasMore = allPosts.length > HOME_LIMIT;

  return (
    <section id="blog" className="bg-[var(--surface)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Blog
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
            Stories from the community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Updates, guides, and stories from the Sri Lankan tech community.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Read more →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
