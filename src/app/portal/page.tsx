"use client";

import Link from "next/link";
import { usePortal } from "@/components/portal/PortalProvider";

export default function PortalHome() {
  const { profile, loading } = usePortal();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
        The HackSL Portal
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">
        Create your profile to get matched with hackathon teams, get your resume in front of our
        partners for jobs and internships, and apply to become a HackSL Fellow.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {loading ? (
          <span className="text-sm text-[var(--muted)]">Loading…</span>
        ) : profile ? (
          <Link
            href="/portal/profile"
            className="rounded-lg bg-[var(--accent)] px-5 py-3 font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            Go to my profile
          </Link>
        ) : (
          <>
            <Link
              href="/portal/signup"
              className="rounded-lg bg-[var(--accent)] px-5 py-3 font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Create your profile
            </Link>
            <Link
              href="/portal/login"
              className="rounded-lg border border-[var(--border)] px-5 py-3 font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              I already have an account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
