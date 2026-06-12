import Link from "next/link";
import type { Metadata } from "next";
import { getBlogs } from "@/lib/blogs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogListing } from "@/components/BlogListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog – HackSL",
  description:
    "Updates, guides, and stories from the Sri Lankan tech community.",
};

export default async function BlogIndexPage() {
  const posts = await getBlogs();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="pt-16">
        <section className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              ← Back to home
            </Link>
            <span className="mt-6 inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Blog
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
              All stories
            </h1>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              Browse every post. Filter by hackathon type and sort by date.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-5xl px-6">
            <BlogListing posts={posts} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
