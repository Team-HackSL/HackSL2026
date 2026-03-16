export function AboutUs() {
  return (
    <section id="about" className="border-t border-[var(--border)] bg-[var(--accent-light)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          About Us
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-[var(--muted)]">
          HackSL (Hack Sri Lanka) was founded in 2023 to connect
          Sri Lanka&apos;s tech innovators. We are a nonprofit dedicated to
          building a vibrant hackathon and technology event ecosystem across the
          island.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="font-semibold text-[var(--foreground)]">
              Our Vision
            </h3>
            <p className="mt-2 text-[var(--muted)]">
              A thriving tech community where hackathons and innovation events
              empower builders, learners, and organizations to create impact.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="font-semibold text-[var(--foreground)]">
              What We Do
            </h3>
            <p className="mt-2 text-[var(--muted)]">
              We curate and promote hackathons, provide a platform for event
              organizers, and connect participants with opportunities across Sri
              Lanka.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
