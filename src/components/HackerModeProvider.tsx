"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HackerModeContext = createContext<{
  hacker: boolean;
  toggle: () => void;
}>({ hacker: true, toggle: () => {} });

export function useHackerMode() {
  return useContext(HackerModeContext);
}

/**
 * Site-wide "Hacker Mode". Independent of the light/dark theme:
 * when on, sets data-hacker="on" on <html>, which globals.css uses to
 * recolor the entire site into the dark-web / terminal aesthetic.
 * When off, the regular light/dark theme is in effect.
 */
export function HackerModeProvider({ children }: { children: React.ReactNode }) {
  // Hacker mode is the DEFAULT; users opt out and the choice is persisted.
  // Initial value matches the server render to avoid a hydration mismatch.
  const [hacker, setHacker] = useState(true);

  useEffect(() => {
    // The inline script in layout.tsx has already applied the attribute
    // pre-paint; here we sync React state to it (default on unless saved off).
    const on = localStorage.getItem("hackerMode") !== "off";
    setHacker(on);
    document.documentElement.setAttribute("data-hacker", on ? "on" : "off");
  }, []);

  const toggle = () => {
    setHacker((prev) => {
      const next = !prev;
      localStorage.setItem("hackerMode", next ? "on" : "off");
      document.documentElement.setAttribute("data-hacker", next ? "on" : "off");
      return next;
    });
  };

  return (
    <HackerModeContext.Provider value={{ hacker, toggle }}>
      {children}
    </HackerModeContext.Provider>
  );
}
