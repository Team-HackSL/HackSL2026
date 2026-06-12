import { sql } from "@vercel/postgres";
import type { BlogPost } from "./blog-types";
import { ensureBlogsTable } from "./db";
import { seedBlogPosts } from "./blog-seed";

export type { BlogPost } from "./blog-types";

async function getDbBlogs(): Promise<BlogPost[]> {
  await ensureBlogsTable();
  // Format the DATE column as a plain YYYY-MM-DD string in SQL so it never
  // round-trips through a timezone-shifted JS Date (which would break the
  // admin date input on re-edit).
  const { rows } = await sql<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    author: string | null;
    image: string | null;
    content: string | null;
  }>`
    SELECT id, title, excerpt, to_char(date, 'YYYY-MM-DD') AS date, slug, author, image, content
    FROM blogs
    ORDER BY date DESC
  `;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    slug: row.slug,
    author: row.author ?? undefined,
    image: row.image ?? undefined,
    content: row.content ?? undefined,
  }));
}

/**
 * Returns all blog posts, newest first.
 *
 * Posts live in the database — including the code-shipped seed posts, which
 * are loaded into the database once (see `ensureBlogsTable`) so the admin can
 * edit and delete every post. If the database is unavailable we fall back to
 * the in-code seed posts so the blog still renders instead of crashing.
 */
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    return await getDbBlogs();
  } catch (err) {
    console.error("Failed to load blogs from database, using seed posts", err);
    return [...seedBlogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}

/** Returns a single blog post by its slug, or null if not found. */
export async function getBlog(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((post) => post.slug === slug) ?? null;
}
