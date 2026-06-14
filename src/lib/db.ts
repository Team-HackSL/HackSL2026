import { sql } from "@vercel/postgres";
import { seedBlogPosts } from "./blog-seed";

export async function ensureHackathonsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS hackathons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      location TEXT NOT NULL,
      registration_url TEXT NOT NULL,
      organizer TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      image TEXT,
      mode TEXT,
      status TEXT,
      length TEXT
    )
  `;
  // Analytics counter. Events have no detail page, so a "view" is recorded when
  // a visitor opens the event card (clicks through to registration).
  await sql`ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0`;
}

export async function ensureBlogsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date DATE NOT NULL,
      slug TEXT NOT NULL,
      author TEXT,
      image TEXT,
      content TEXT,
      type TEXT
    )
  `;
  // Backfill columns for tables created before they were introduced.
  await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author TEXT`;
  await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS type TEXT`;
  // Analytics counters: views = blog detail page loads, clicks = card
  // click-throughs from a listing.
  await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS clicks INTEGER NOT NULL DEFAULT 0`;
  await ensureBlogsSeeded();
}

/**
 * Loads the code-shipped seed posts into the database exactly once, so the
 * pre-created blog posts become first-class rows the admin can edit and
 * delete just like posts created through the admin panel.
 *
 * A marker row in `blogs_meta` guarantees we only seed a given environment
 * once. Without it, an admin who deletes a seed post would see it reappear on
 * the next request. The seeding is idempotent and safe to run concurrently.
 */
async function ensureBlogsSeeded() {
  await sql`
    CREATE TABLE IF NOT EXISTS blogs_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `;

  const { rows } = await sql`SELECT 1 FROM blogs_meta WHERE key = 'seeded'`;
  if (rows.length > 0) return;

  for (const post of seedBlogPosts) {
    await sql`
      INSERT INTO blogs (id, title, excerpt, date, slug, author, image, content, type)
      VALUES (
        ${post.id},
        ${post.title},
        ${post.excerpt},
        ${post.date},
        ${post.slug},
        ${post.author ?? null},
        ${post.image ?? null},
        ${post.content ?? null},
        ${post.type ?? null}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }

  await sql`
    INSERT INTO blogs_meta (key, value)
    VALUES ('seeded', ${new Date().toISOString()})
    ON CONFLICT (key) DO NOTHING
  `;
}


