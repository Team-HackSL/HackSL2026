import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { formatDate } from "@/lib/hackathon-types";
import { BlogCardArt } from "./BlogCardArt";

export async function Blog() {
  const posts = await getBlogs();
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
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
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
                <div className="relative flex h-full items-end p-4">
                  <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-black">
                    {formatDate(post.date)}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-all group-hover:translate-x-0.5">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
