import { sql } from "@vercel/postgres";
import type { Hackathon } from "./hackathon-types";
import { ensureHackathonsTable } from "./db";

export type { Hackathon } from "./hackathon-types";
export { getHackathonStatus, formatDate } from "./hackathon-types";

async function getHackathonsFromDb(): Promise<Hackathon[]> {
  await ensureHackathonsTable();
  const { rows } = await sql<{
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    registration_url: string;
    organizer: string;
    tags: string[] | null;
    image: string | null;
    mode: string | null;
    status: string | null;
    length: string | null;
  }>`SELECT * FROM hackathons ORDER BY date ASC`;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    date: row.date,
    location: row.location,
    registrationUrl: row.registration_url,
    organizer: row.organizer,
    tags: row.tags ?? [],
    image: row.image ?? undefined,
    mode: (row.mode as Hackathon["mode"]) ?? undefined,
    status: (row.status as Hackathon["status"]) ?? undefined,
    length: (row.length as Hackathon["length"]) ?? undefined,
  }));
}

/**
 * Returns all hackathons. If the database is unavailable (for example when
 * running locally without POSTGRES_URL configured), we return an empty list
 * instead of crashing the whole page.
 */
export async function getHackathons(): Promise<Hackathon[]> {
  try {
    return await getHackathonsFromDb();
  } catch (err) {
    console.error("Failed to load hackathons from database", err);
    return [];
  }
}

