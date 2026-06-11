export function StartHackathon() {
  return (
    <section
      id="start-hackathon"
      className="relative overflow-hidden bg-[var(--accent)] py-24"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
          For Organizers
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
          Organize a Hackathon with HackSL
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-violet-100/80">
          Planning a hackathon or tech event? We&apos;ll promote it to our
          community of 5,000+ participants. Share details and we&apos;ll list it on
          HackSL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[var(--accent)] shadow-lg transition-all duration-200 hover:bg-violet-50 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Submit via WhatsApp
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
