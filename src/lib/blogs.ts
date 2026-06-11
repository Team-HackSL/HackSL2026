import { sql } from "@vercel/postgres";
import type { BlogPost } from "./blog-types";
import { ensureBlogsTable } from "./db";
import { seedBlogPosts } from "./blog-seed";

export type { BlogPost } from "./blog-types";

async function getDbBlogs(): Promise<BlogPost[]> {
  await ensureBlogsTable();
  const { rows } = await sql<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    image: string | null;
    content: string | null;
  }>`SELECT * FROM blogs ORDER BY date DESC`;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    slug: row.slug,
    image: row.image ?? undefined,
    content: row.content ?? undefined,
  }));
}

/**
 * Returns all blog posts, newest first.
 *
 * The code-shipped seed posts are always included so the blog renders even
 * with no database. Posts created through the admin panel are merged on top
 * and override a seed post that shares the same slug. If the database is
 * unavailable we fall back to the seed posts alone instead of crashing.
 */
export async function getBlogs(): Promise<BlogPost[]> {
  let dbBlogs: BlogPost[] = [];
  try {
    dbBlogs = await getDbBlogs();
  } catch (err) {
    console.error("Failed to load blogs from database, using seed posts", err);
  }

  const bySlug = new Map<string, BlogPost>();
  for (const post of seedBlogPosts) {
    bySlug.set(post.slug, post);
  }
  for (const post of dbBlogs) {
    bySlug.set(post.slug, post);
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Returns a single blog post by its slug, or null if not found. */
export async function getBlog(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((post) => post.slug === slug) ?? null;
}
