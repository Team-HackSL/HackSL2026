"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortal } from "@/components/portal/PortalProvider";
import {
  getMatchCandidates,
  getMatchStatus,
  getMatches,
  swipe,
  PortalApiError,
  type MatchCandidate,
  type Match,
  type SkillRating,
} from "@/lib/portal-api";

function SkillBars({ skills }: { skills: SkillRating[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="space-y-2">
      {skills.map((s) => (
        <div key={s.category}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--foreground)]">{s.category}</span>
            <span className="font-mono text-[var(--muted)]">{s.level}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${s.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--foreground)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const router = useRouter();
  const { profile, loading } = usePortal();

  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [freeRemaining, setFreeRemaining] = useState(1);
  const [busy, setBusy] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [matchPopup, setMatchPopup] = useState<Match | null>(null);

  // Redirect to login once we know there's no session.
  useEffect(() => {
    if (!loading && !profile) router.replace("/portal/login");
  }, [loading, profile, router]);

  const load = useCallback(async () => {
    setLoadingDeck(true);
    setError(null);
    try {
      const [deck, status, existing] = await Promise.all([
        getMatchCandidates(),
        getMatchStatus(),
        getMatches(),
      ]);
      setCandidates(deck);
      setIndex(0);
      setFreeRemaining(status.freeMatchesRemaining);
      setMatches(existing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load matches.");
    } finally {
      setLoadingDeck(false);
    }
  }, []);

  useEffect(() => {
    if (profile?.matchWithTeam) void load();
  }, [profile?.matchWithTeam, load]);

  const current = candidates[index];

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!current || busy) return;
      // Swiping right is unlimited and free. The server only blocks (402) the swipe that
      // would form a *second* mutual match once the free match has been used.
      setBusy(true);
      setError(null);
      try {
        const result = await swipe(current.userId, direction);
        setFreeRemaining(result.freeMatchesRemaining);
        if (result.isMatch && result.match) {
          setMatchPopup(result.match);
          setMatches((prev) =>
            prev.some((m) => m.userId === result.match!.userId) ? prev : [result.match!, ...prev],
          );
        }
        setIndex((i) => i + 1);
      } catch (err) {
        if (err instanceof PortalApiError && err.status === 402) {
          setPaywall(true);
          setFreeRemaining(0);
        } else {
          setError(err instanceof Error ? err.message : "Swipe failed.");
        }
      } finally {
        setBusy(false);
      }
    },
    [current, busy],
  );

  // Arrow-key swiping for the "deck" feel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") void handleSwipe("left");
      if (e.key === "ArrowRight") void handleSwipe("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwipe]);

  if (loading || !profile) {
    return <p className="text-center text-[var(--muted)]">Loading…</p>;
  }

  // Not opted in: explain how to enable matching.
  if (!profile.matchWithTeam) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Team matching is off</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
          Turn on <span className="font-medium">&ldquo;Match me with a team&rdquo;</span> in your profile to
          start swiping and find teammates.
        </p>
        <Link
          href="/portal/profile"
          className="mt-5 inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Go to my profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Find a team</h1>
          <p className="text-sm text-[var(--muted)]">
            Swipe right to like, left to skip. When you both like each other, you&apos;ll see their
            name and contact details.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          {freeRemaining > 0 ? `${freeRemaining} free match left` : "Free match used"}
        </span>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Paywall notice */}
      {paywall && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 text-center shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            You have used your FREE match.
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Paywall coming soon - matching with more people will be a paid feature. You can still
            skip people for free.
          </p>
        </div>
      )}

      {/* Swipe deck */}
      {loadingDeck ? (
        <p className="text-center text-[var(--muted)]">Loading people…</p>
      ) : current ? (
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)] text-2xl">
                🙈
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[var(--foreground)]">Anonymous member</h2>
                <p className="truncate text-sm text-[var(--muted)]">{current.institution}</p>
              </div>
            </div>

            {current.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--foreground)]">
                {current.description}
              </p>
            )}

            {current.programmingLanguages.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Languages
                </p>
                <Chips items={current.programmingLanguages} />
              </div>
            )}

            {current.skills.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Skills
                </p>
                <SkillBars skills={current.skills} />
              </div>
            )}

            {current.gitHubUrl && (
              <a
                href={current.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
              >
                View GitHub →
              </a>
            )}

            <p className="mt-5 text-xs text-[var(--muted)]">
              Name, email and LinkedIn stay hidden until you both swipe right.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleSwipe("left")}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] text-2xl text-[var(--muted)] hover:bg-[var(--surface)] disabled:opacity-50"
              aria-label="Skip"
              title="Skip (←)"
            >
              ✕
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleSwipe("right")}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
              aria-label="Like"
              title="Like (→)"
            >
              ♥
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center shadow-sm">
          <p className="text-[var(--foreground)]">No more people to swipe right now.</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Check back later as more members opt into team matching.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Your matches */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
          Your matches{matches.length > 0 && ` (${matches.length})`}
        </h2>
        {matches.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No matches yet. When someone you liked likes you back, they&apos;ll appear here with
            their contact details.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matches.map((m) => (
              <MatchCard key={m.userId} match={m} />
            ))}
          </div>
        )}
      </section>

      {/* It's a match! popup */}
      {matchPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setMatchPopup(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-3xl">🎉</p>
            <h3 className="mt-2 text-xl font-bold text-[var(--foreground)]">It&apos;s a match!</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              You and {matchPopup.fullName} both want to team up.
            </p>
            <div className="mt-4 text-left">
              <MatchCard match={matchPopup} />
            </div>
            <button
              type="button"
              onClick={() => setMatchPopup(null)}
              className="mt-5 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Keep swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {match.profilePhotoUrl ? (
          <Image
            src={match.profilePhotoUrl}
            alt={match.fullName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            style={{ height: 48, width: 48 }}
            unoptimized
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-lg font-semibold text-[var(--muted)]">
            {match.fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--foreground)]">{match.fullName}</h3>
          <p className="truncate text-xs text-[var(--muted)]">{match.institution}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <a href={`mailto:${match.email}`} className="block truncate text-[var(--accent)] hover:underline">
          {match.email}
        </a>
        {match.linkedInUrl && (
          <a
            href={match.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[var(--accent)] hover:underline"
          >
            LinkedIn
          </a>
        )}
        {match.gitHubUrl && (
          <a
            href={match.gitHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[var(--accent)] hover:underline"
          >
            GitHub
          </a>
        )}
      </div>

      {match.programmingLanguages.length > 0 && (
        <div className="mt-3">
          <Chips items={match.programmingLanguages} />
        </div>
      )}
    </div>
  );
}
