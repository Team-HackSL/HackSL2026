const PERKS = [
  { icon: "🎓", text: "University ambassador badge" },
  { icon: "🌐", text: "Exclusive hackathon access" },
  { icon: "🤝", text: "Network with 25+ universities" },
  { icon: "📣", text: "Help grow the community" },
];

export function HackSLFellows() {
  return (
    <section
      id="fellows"
      className="bg-[var(--surface)] py-24"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Fellows Program
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
            Become a HackSL Fellow
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted)]">
            Our University Ambassador program. Represent HackSL on your campus,
            connect builders, and help grow Sri Lanka&apos;s tech ecosystem.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PERKS.map((perk) => (
            <div
              key={perk.text}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-center"
            >
              <span className="text-2xl">{perk.icon}</span>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {perk.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-lg"
          >
            Apply now
          </a>
          <a
            href="/fellows"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-7 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-md"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
