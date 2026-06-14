export interface Hackathon {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  registrationUrl: string;
  organizer: string;
  tags: string[];
  image?: string;
  mode?: "online" | "in-person";
  status?: "upcoming" | "open" | "ended";
  length?: "1-6 days" | "1-4 weeks" | "1+ month";
  /** Number of times the event card has been opened (click-through). */
  views?: number;
}

export function getHackathonStatus(
  h: Hackathon
): "upcoming" | "open" | "ended" {
  if (h.status) return h.status;
  const d = new Date(h.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today ? "ended" : "upcoming";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
