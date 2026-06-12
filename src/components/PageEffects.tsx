"use client";

import { AnimatedBackground } from "./AnimatedBackground";
import { CursorEffect } from "./CursorEffect";
import { MatrixRain } from "./MatrixRain";
import { useHackerMode } from "./HackerModeProvider";

export function PageEffects() {
  const { hacker } = useHackerMode();

  return (
    <>
      {hacker ? (
        <>
          {/* Site-wide matrix rain veil + CRT scanlines (hacker mode only). */}
          <MatrixRain variant="overlay" opacity={0.1} fontSize={18} />
          <div className="crt-scanlines" aria-hidden />
        </>
      ) : (
        /* Regular mode: soft gradient orbs + grid backdrop. */
        <AnimatedBackground />
      )}
      <CursorEffect />
    </>
  );
}
