"use client";

import Image from "next/image";
import type { Hackathon } from "@/lib/hackathon-types";
import { formatDate } from "@/lib/hackathon-types";
import { trackEngagement } from "@/lib/track";

interface HackathonCardProps {
  hackathon: Hackathon;
}

function isLocalImage(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const mode = hackathon.mode ?? "in-person";

  return (
    <a
      href={hackathon.registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEngagement({ type: "hackathon", event: "view", id: hackathon.id })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/20 hover:shadow-xl"
    >
      {/* Thumbnail / Banner */}
      <div
        className="relative aspect-[16/9] w-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
      >
        {hackathon.image ? (
          isLocalImage(hackathon.image) ? (
            <Image
              src={hackathon.image}
              alt={hackathon.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hackathon.image}
              alt={hackathon.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl font-bold text-white/30">
              {hackathon.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Mode badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
            mode === "online"
              ? "bg-emerald-500/90 text-white"
              : "bg-white/95 text-[var(--foreground)]"
          }`}
        >
          {mode === "online" ? "Online" : "In-person"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {formatDate(hackathon.date)}
          </p>
        </div>
        <h3 className="mt-2 text-base font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
          {hackathon.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{hackathon.organizer}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
          {hackathon.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs font-semibold text-[var(--accent)] transition-all group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </a>
  );
}
