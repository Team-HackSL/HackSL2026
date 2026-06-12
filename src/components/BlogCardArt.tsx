import type { BlogPost } from "@/lib/blog-types";

/**
 * Decorative graphic for blog cards that have no cover image.
 * Renders the accent gradient + grid backdrop (recolored automatically in
 * hacker mode) with a themed line-art motif on top. The motif is chosen
 * deterministically from the post slug so each card looks distinct but stable.
 */

/** Stable hash of a string into [0, mod). */
function hashIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-14 w-14 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
  "aria-hidden": true,
};

const motifs = [
  // Terminal / command prompt
  <svg key="terminal" {...svgProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m6 9 3 3-3 3" />
    <path d="M13 15h4" />
  </svg>,
  // Code brackets
  <svg key="code" {...svgProps}>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </svg>,
  // Connected nodes / network
  <svg key="network" {...svgProps}>
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="12" cy="18" r="2" />
    <path d="M6.7 7.5 10.6 16M17.3 7.5 13.4 16M7 6h10" />
  </svg>,
  // Rocket / launch
  <svg key="rocket" {...svgProps}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>,
  // Lightbulb / idea
  <svg key="idea" {...svgProps}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>,
  // Trophy / winning
  <svg key="trophy" {...svgProps}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>,
  // Chip / tech stack
  <svg key="chip" {...svgProps}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M20 9h2M2 15h2M2 9h2" />
  </svg>,
  // Stopwatch / endurance
  <svg key="clock" {...svgProps}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3 2 6" />
    <path d="m22 6-3-3" />
    <path d="M9 2h6" />
  </svg>,
];

export function BlogCardArt({ post }: { post: BlogPost }) {
  const motif = motifs[hashIndex(post.slug, motifs.length)];
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-violet-600 to-fuchsia-500" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-white/90 transition-transform duration-300 group-hover:scale-110">
        {motif}
      </div>
    </>
  );
}
