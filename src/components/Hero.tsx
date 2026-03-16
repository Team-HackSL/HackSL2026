import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--accent)] pt-36 pb-32">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91, 33, 182, 0.06), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
        <Image
          src="/hacksl-logo.png"
          alt="HackSL"
          width={200}
          height={200}
          className="mx-auto mb-10 h-28 w-auto drop-shadow-md"
        />
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Connecting Sri Lanka&apos;s Tech Innovators
        </h1>
        <p className="mt-6 text-xl font-medium tracking-tight text-violet-100 sm:text-2xl">
          One Hackathon at a Time
        </p>
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-violet-100/90">
          Hackathons and technology events drive innovation and creativity across
          Sri Lanka. We connect builders, learners, and organizers, helping the
          ecosystem grow.
        </p>
        <a
          href="#hackathons"
          className="mt-12 inline-flex items-center gap-2 rounded-lg bg-black px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-900 hover:shadow-lg"
        >
          Explore Hackathons
        </a>
      </div>
    </section>
  );
}
