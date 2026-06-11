"use client";

import { AnimatedBackground } from "./AnimatedBackground";
import { CursorEffect } from "./CursorEffect";

export function PageEffects() {
  return (
    <>
      {/* Soft gradient orbs + grid backdrop. */}
      <AnimatedBackground />
      {/* CRT scanline + scan-beam overlay across the whole page. */}
      <div className="crt-scanlines" aria-hidden />
      <CursorEffect />
    </>
  );
}
