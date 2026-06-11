const CARDS = [
  {
    icon: "🔭",
    title: "Our Vision",
    body: "A thriving tech community where hackathons and innovation events empower builders, learners, and organizations to create impact across Sri Lanka.",
  },
  {
    icon: "⚡",
    title: "What We Do",
    body: "We curate and promote hackathons, provide a platform for event organizers, and connect participants with opportunities across the island.",
  },
  {
    icon: "🤝",
    title: "Who We Are",
    body: "A nonprofit founded in 2023, run by volunteers passionate about technology, community, and helping Sri Lanka's next generation of builders thrive.",
  },
];

export function AboutUs() {
  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            About HackSL
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
            Built for Sri Lanka&apos;s builders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
            HackSL (Hack Sri Lanka) connects students, engineers, and creators
            through hackathons and tech events — one community at a time.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
