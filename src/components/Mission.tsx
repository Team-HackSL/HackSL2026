export function Mission() {
  return (
    <section className="bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Giant opening quote */}
        <span
          className="block text-6xl font-bold leading-none text-[var(--accent)]/20 select-none"
          aria-hidden
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 text-2xl font-semibold leading-snug tracking-[-0.02em] text-[var(--foreground)] sm:text-3xl">
          Hackathons are where Sri Lanka&apos;s next breakthrough ideas are
          born.
        </blockquote>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Our mission is to connect individuals and organizations with
          opportunities to showcase skills, learn new technologies, and drive
          positive change. We are the comprehensive guide for hackathons and
          tech events across the island.
        </p>
      </div>
    </section>
  );
}
