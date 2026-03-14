"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-opacity duration-200 hover:bg-[var(--accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll back to top"
    >
      ↑
    </button>
  );
}
