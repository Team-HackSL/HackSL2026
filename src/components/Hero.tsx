"use client";

import { CountUp } from "./CountUp";
import { GlitchText } from "./GlitchText";
import { MatrixRain } from "./MatrixRain";
import { Typewriter } from "./Typewriter";
import { useHackerMode } from "./HackerModeProvider";

const STATS = [
  { to: 50, suffix: "+", label: "Hackathons" },
  { to: 50, suffix: "K+", label: "Hackers" },
  { to: 25, suffix: "+", label: "Universities" },
  { to: 2023, suffix: "", label: "Founded" },
];

const BOOT_LINES = [
  { prompt: "root@hacksl:~$", text: "ssh connect --network sri-lanka" },
  { prompt: ">", text: "establishing secure tunnel... [OK]" },
  { prompt: ">", text: "loading innovators: 50,000+ nodes online" },
  { prompt: "root@hacksl:~$", text: "./build_the_future.sh --hack" },
];

export function Hero() {
  const { hacker } = useHackerMode();

  if (hacker) return <HackerHero />;
  return <RegularHero />;
}

/* ------------------------------------------------------------------ */
/* Regular hero — the standard themed (light/dark) marketing hero.      */
/* ------------------------------------------------------------------ */
function RegularHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--accent)] pt-32 pb-28">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(120,60,255,0.4), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Sri Lanka&apos;s largest Hackathon Hub
        </div>

        <h1 className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Connect. Build.
          <br />
          Innovate.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-violet-100/80 sm:text-xl">
          The definitive platform for hackathons and tech events across Sri
          Lanka. Discover events, join communities, and build the future.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#hackathons"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[var(--accent)] shadow-lg transition-all duration-200 hover:bg-violet-50 hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Hackathons
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
          >
            List Your Event
          </a>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-white/5 px-6 py-5 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {stat.to}
                {stat.suffix}
              </span>
              <span className="text-xs font-medium text-violet-200/80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Hacker hero — dark terminal showpiece with matrix rain + glitch.    */
/* ------------------------------------------------------------------ */
function HackerHero() {
  return (
    <section className="relative overflow-hidden bg-[#05080a] pt-32 pb-28">
      {/* Matrix digital rain confined to the hero */}
      <MatrixRain variant="absolute" opacity={0.45} fontSize={15} />
      {/* Green vignette / radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(0,255,102,0.10), transparent 70%)",
        }}
      />
      {/* Faint terminal grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,102,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Edge fade so the matrix rain blends in at the boundaries */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #05080a)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Status badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00ff66]/30 bg-[#00ff66]/5 px-4 py-1.5 font-mono text-xs font-medium tracking-wide text-[#00ff66]">
          <span className="h-1.5 w-1.5 animate-status-pulse rounded-full bg-[#00ff66]" />
          SYSTEM ONLINE · SRI LANKA&apos;S LARGEST HACKATHON HUB
        </div>

        {/* Glitching headline */}
        <h1 className="animate-flicker text-5xl font-bold tracking-[-0.04em] text-white text-glow-green sm:text-6xl md:text-7xl lg:text-8xl">
          <GlitchText text="Connect. Build." />
          <br />
          <GlitchText text="Innovate." />
        </h1>

        {/* Terminal boot sequence */}
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-xl border border-[#00ff66]/25 bg-black/60 text-left shadow-[0_0_40px_-12px_rgba(0,255,102,0.4)] backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-[#00ff66]/15 bg-white/[0.03] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-mono text-xs text-[#00ff66]/60">
              hacksl — secure shell
            </span>
          </div>
          <Typewriter
            lines={BOOT_LINES}
            className="px-4 py-4 text-sm leading-relaxed text-[#9dffc0]"
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
          The definitive platform for hackathons and tech events across Sri
          Lanka. Discover events, join communities, and build the future.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#hackathons"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#00ff66] px-7 py-3.5 font-mono text-sm font-semibold text-black shadow-[0_0_25px_-4px_rgba(0,255,102,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_35px_-2px_rgba(0,255,102,0.9)]"
          >
            <span className="text-black/60 group-hover:text-black">&gt;_</span>
            Explore Hackathons
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00ff66]/40 bg-[#00ff66]/5 px-7 py-3.5 font-mono text-sm font-semibold text-[#00ff66] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00ff66]/15"
          >
            List Your Event
          </a>
        </div>

        {/* Stats with count-up */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#00ff66]/20 bg-[#00ff66]/10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-black/50 px-6 py-5 backdrop-blur-sm"
            >
              <CountUp
                to={stat.to}
                suffix={stat.suffix}
                className="font-mono text-2xl font-bold text-[#00ff66] text-glow-green sm:text-3xl"
              />
              <span className="font-mono text-xs font-medium tracking-wide text-[#00ff66]/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
