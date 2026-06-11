const STATS = [
  { value: "50+", label: "Hackathons" },
  { value: "50K+", label: "Participants" },
  { value: "25+", label: "Universities" },
  { value: "2023", label: "Founded" },
];

export function Hero() {
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
        {/* Badge */}
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

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-white/5 px-6 py-5 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
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
