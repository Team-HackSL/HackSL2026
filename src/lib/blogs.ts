import { sql } from "@vercel/postgres";
import type { BlogPost } from "./blog-types";
import { ensureBlogsTable } from "./db";

export type { BlogPost } from "./blog-types";

export async function getBlogs(): Promise<BlogPost[]> {
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

