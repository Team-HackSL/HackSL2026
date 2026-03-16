import { sql } from "@vercel/postgres";

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
}

export async function ensureBlogsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date DATE NOT NULL,
      slug TEXT NOT NULL,
      image TEXT,
      content TEXT
    )
  `;
}


