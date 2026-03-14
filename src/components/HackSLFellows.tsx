export function HackSLFellows() {
  return (
    <section
      id="fellows"
      className="border-t border-[var(--border)] bg-white py-20"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Apply to be a HackSL Fellow
        </h2>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Join our University Ambassador program. Represent HackSL on your campus,
          spread the word about hackathons, and help grow the tech community.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 font-medium text-white shadow-lg transition-colors hover:bg-[#128C7E]"
          >
            Apply via WhatsApp
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--foreground)] px-8 py-4 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)] hover:text-white"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
