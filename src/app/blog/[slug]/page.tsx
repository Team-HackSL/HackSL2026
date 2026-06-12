import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlog, getBlogs } from "@/lib/blogs";
import { formatDate } from "@/lib/hackathon-types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Markdown } from "@/components/Markdown";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) {
    return { title: "Post not found – HackSL Blog" };
  }
  return {
    title: `${post.title} – HackSL Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    notFound();
  }

  const related = (await getBlogs())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="pt-16">
        {/* Hero / header band */}
        <div className="relative overflow-hidden border-b border-[var(--border)]">
          {post.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-violet-600 to-fuchsia-500" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </>
          )}
          <div className="relative mx-auto max-w-3xl px-6 py-20">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/#blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition-colors hover:text-white"
              >
                ← Back to blog
              </Link>
              <span className="inline-block rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-black">
                {formatDate(post.date)}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
              {post.title}
            </h1>
            {post.author && (
              <p className="mt-3 text-sm font-medium text-white/80">
                By {post.author}
              </p>
            )}
            <p className="mt-4 max-w-2xl text-lg text-white/85">
              {post.excerpt}
            </p>
          </div>
        </div>

        {/* Article body */}
        <article className="mx-auto max-w-3xl px-6 py-14">
          {post.content ? (
            <Markdown content={post.content} />
          ) : (
            <p className="leading-relaxed text-[var(--muted)]">
              {post.excerpt}
            </p>
          )}
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t border-[var(--border)] bg-[var(--surface)] py-16">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
                Keep reading
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="text-xs font-medium text-[var(--muted)]">
                      {formatDate(p.date)}
                    </span>
                    <h3 className="mt-2 font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {p.title}
                    </h3>
                    {p.author && (
                      <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                        By {p.author}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-all group-hover:translate-x-0.5">
                      Read more →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
