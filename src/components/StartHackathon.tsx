export function StartHackathon() {
  return (
    <section
      id="start-hackathon"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-20"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Organize a Hackathon with HackSL
        </h2>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Organizing a hackathon or tech event? We&apos;ll promote it to our
          community. Share details and we&apos;ll list it on HackSL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-[#128C7E]"
          >
            Submit via WhatsApp
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--foreground)] px-8 py-4 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)] hover:text-white"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
