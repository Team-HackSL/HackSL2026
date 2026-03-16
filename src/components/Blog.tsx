import { getBlogs } from "@/lib/blogs";
import { formatDate } from "@/lib/hackathon-types";

export async function Blog() {
  const posts = await getBlogs();
  return (
    <section id="blog" className="border-t border-[var(--border)] bg-[var(--accent-light)] py-24">
      <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Blog
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Updates, guides, and stories from the Sri Lankan tech community.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
                <div className="relative h-36 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-fuchsia-500 opacity-80" />
                  <div className="relative flex h-full items-end p-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-[var(--accent)]">
                    Read more →
                  </span>
                </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
