import { readFile } from "fs/promises";
import path from "path";

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  registrationUrl: string;
  organizer: string;
  tags: string[];
}

const DATA_PATH = path.join(process.cwd(), "data", "hackathons.json");

export async function getHackathons(): Promise<Hackathon[]> {
  try {
    const data = await readFile(DATA_PATH, "utf-8");
    const hackathons = JSON.parse(data) as Hackathon[];
    // Sort by date ascending (soonest first)
    return hackathons.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch {
    return [];
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
