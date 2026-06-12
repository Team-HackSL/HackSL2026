"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HackerModeContext = createContext<{
  hacker: boolean;
  toggle: () => void;
}>({ hacker: false, toggle: () => {} });

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
  const [hacker, setHacker] = useState(false);

  useEffect(() => {
    // The inline script in layout.tsx has already applied the attribute
    // pre-paint; here we just sync React state to it.
    setHacker(document.documentElement.getAttribute("data-hacker") === "on");
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
