"use client";

import { useEffect, useRef } from "react";

type MatrixRainProps = {
  /** Opacity of the whole canvas (0-1). Keep low for a backdrop. */
  opacity?: number;
  /** Font size of the glyphs in px. */
  fontSize?: number;
  /** Head (leading) glyph color. */
  headColor?: string;
  /** Trailing glyph color. */
  trailColor?: string;
  /**
   * "fixed" pins the canvas to the viewport behind all content (-z-10).
   * "absolute" confines it to the nearest positioned ancestor (e.g. a hero),
   * where it reliably renders over that element's own background.
   */
  variant?: "fixed" | "absolute";
};

/**
 * Classic "Matrix" digital rain rendered on a canvas.
 * Use variant="fixed" for a full-viewport backdrop, or variant="absolute"
 * to confine it to a positioned parent (e.g. the hero section).
 * Respects prefers-reduced-motion (renders a single static frame).
 */
export function MatrixRain({
  opacity = 0.35,
  fontSize = 16,
  headColor = "#d6ffe0",
  trailColor = "#00ff66",
  variant = "fixed",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size to the parent element when confined, else to the viewport.
    const measure = () =>
      variant === "absolute" && canvas.parentElement
        ? {
            w: canvas.parentElement.clientWidth,
            h: canvas.parentElement.clientHeight,
          }
        : { w: window.innerWidth, h: window.innerHeight };

    // Katakana + latin + digits — the iconic glyph set.
    const glyphs =
      "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFhacksl<>/{}[]$#@".split(
        ""
      );

    let w = 0;
    let h = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const dims = measure();
      w = dims.w;
      h = dims.h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.max(1, Math.floor(w / fontSize));
      drops = new Array(columns)
        .fill(0)
        .map(() => Math.floor((Math.random() * -h) / fontSize)); // stagger starts
    };

    resize();
    window.addEventListener("resize", resize);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId = 0;
    let lastTime = 0;
    const frameInterval = 1000 / 24; // ~24fps gives the chunky, deliberate feel

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      if (time - lastTime < frameInterval) return;
      lastTime = time;

      // Fade previous frame to create the trailing tail.
      ctx.fillStyle = "rgba(5, 8, 6, 0.08)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright leading glyph, dimmer trail behind it.
        ctx.fillStyle = headColor;
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y);
        ctx.fillStyle = trailColor;
        ctx.fillText(
          glyphs[Math.floor(Math.random() * glyphs.length)],
          x,
          y - fontSize
        );

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    if (prefersReducedMotion) {
      // Render one calm static frame.
      ctx.fillStyle = "rgba(5, 8, 6, 1)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      ctx.fillStyle = trailColor;
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(
          glyphs[Math.floor(Math.random() * glyphs.length)],
          i * fontSize,
          (Math.random() * h) | 0
        );
      }
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [fontSize, headColor, trailColor, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        variant === "absolute"
          ? "pointer-events-none absolute inset-0 h-full w-full"
          : "pointer-events-none fixed inset-0 -z-10"
      }
      style={{ opacity }}
    />
  );
}
