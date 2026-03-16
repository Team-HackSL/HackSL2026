"use client";

import { useState, useMemo } from "react";
import type { Hackathon } from "@/lib/hackathon-types";
import { getHackathonStatus } from "@/lib/hackathon-types";
import { HackathonCard } from "./HackathonCard";
import {
  HackathonFilters,
  type FilterState,
  type LocationFilter,
  type StatusFilter,
  type LengthFilter,
} from "./HackathonFilters";

const defaultFilters: FilterState = {
  location: [],
  status: [],
  length: [],
  tags: [],
};

interface HackathonsSectionProps {
  hackathons: Hackathon[];
}

function matchesFilters(h: Hackathon, filters: FilterState): boolean {
  const status = getHackathonStatus(h);
  const mode = (h.mode ?? "in-person") as LocationFilter;

  if (filters.location.length > 0 && !filters.location.includes(mode)) {
    return false;
  }

  if (filters.status.length > 0 && !filters.status.includes(status)) {
    return false;
  }

  if (filters.length.length > 0) {
    if (!h.length || !filters.length.includes(h.length as LengthFilter)) {
      return false;
    }
  }

  if (filters.tags.length > 0) {
    const hackathonTags = h.tags.map((t) => t.toLowerCase());
    const hasMatch = filters.tags.some((tag) =>
      hackathonTags.includes(tag.toLowerCase())
    );
    if (!hasMatch) return false;
  }

  return true;
}

export function HackathonsSection({ hackathons }: HackathonsSectionProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [hackathons]);

  const filtered = useMemo(
    () => hackathons.filter((h) => matchesFilters(h, filters)),
    [hackathons, filters]
  );

  return (
    <section id="hackathons" className="border-t border-[var(--border)] bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Join the best hackathons in Sri Lanka
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Online and in-person hackathons. Discover events, build projects, and
            connect with the tech community.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--accent)] shadow-sm transition-all hover:border-[var(--border)] hover:shadow"
            >
              Filters {showFilters ? "▲" : "▼"}
            </button>
            {showFilters && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-white p-4">
                <HackathonFilters
                  filters={filters}
                  onChange={setFilters}
                  allTags={allTags}
                />
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <HackathonFilters
              filters={filters}
              onChange={setFilters}
              allTags={allTags}
            />
          </div>

          <div className="min-w-0 flex-1">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
                <p className="text-[var(--muted)]">
                  No hackathons match your filters. Try adjusting your selection
                  or{" "}
                  <button
                    type="button"
                    onClick={() => setFilters(defaultFilters)}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    clear filters
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
