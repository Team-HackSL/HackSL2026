"use client";

import { useHackerMode } from "./HackerModeProvider";

/**
 * Toggle for site-wide Hacker Mode. Sits next to the light/dark ThemeToggle.
 * Shows a terminal prompt glyph; glows green when active.
 */
export function HackerModeToggle() {
  const { hacker, toggle } = useHackerMode();

  return (
    <button
      type="button"
      // Some browser extensions inject attributes (e.g. fdprocessedid) onto buttons
      // before hydration; suppress the resulting attribute-mismatch warning.
      suppressHydrationWarning
      onClick={toggle}
      role="switch"
      aria-checked={hacker}
      aria-label={hacker ? "Turn off hacker mode" : "Turn on hacker mode"}
      title={hacker ? "Hacker mode: ON" : "Hacker mode: OFF"}
      className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 font-mono text-xs font-semibold transition-all ${
        hacker
          ? "border border-[#00ff66]/60 bg-[#00ff66]/10 text-[#00ff66] shadow-[0_0_14px_-3px_rgba(0,255,102,0.8)]"
          : "border border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="m7 9 3 3-3 3" />
        <path d="M13 15h4" />
      </svg>
      <span className="hidden sm:inline">{hacker ? "EXIT" : "HACK"}</span>
    </button>
  );
}
