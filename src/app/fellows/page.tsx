import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Become a HackSL Fellow – University Ambassador Program",
  description:
    "Join the HackSL Fellows Program, our University Ambassador initiative. Represent HackSL on your campus, run events, build your network, and help grow Sri Lanka's tech ecosystem.",
  openGraph: {
    title: "Become a HackSL Fellow – University Ambassador Program",
    description:
      "Represent HackSL on your campus, connect builders, and help grow Sri Lanka's tech ecosystem.",
  },
};

const RESPONSIBILITIES = [
  {
    icon: "📣",
    title: "Champion HackSL on campus",
    text: "Be the face of HackSL at your university - share opportunities, post hackathons, and rally fellow students to build.",
  },
  {
    icon: "🎤",
    title: "Host events & workshops",
    text: "Organize info sessions, mini-hackathons, and workshops with support and resources from the HackSL team.",
  },
  {
    icon: "🤝",
    title: "Grow the community",
    text: "Recruit participants, connect clubs and societies, and bring more builders into the national network.",
  },
  {
    icon: "💡",
    title: "Share student voices",
    text: "Surface what students on your campus need, and feed ideas back to help shape future HackSL programs.",
  },
];

const PERKS = [
  {
    icon: "🎓",
    title: "Official ambassador status",
    text: "An official HackSL Fellow badge and certificate to showcase on LinkedIn and your résumé.",
  },
  {
    icon: "🌐",
    title: "Exclusive access",
    text: "Early and priority access to hackathons, partner events, and opportunities across the network.",
  },
  {
    icon: "🏫",
    title: "25+ university network",
    text: "Connect with ambassadors and student leaders from universities across Sri Lanka.",
  },
  {
    icon: "🚀",
    title: "Real leadership experience",
    text: "Build event management, community, and leadership skills that employers actually value.",
  },
  {
    icon: "🎁",
    title: "Perks & swag",
    text: "Exclusive HackSL merch, partner perks, and recognition for top-performing Fellows.",
  },
  {
    icon: "🤝",
    title: "Mentorship",
    text: "Direct guidance from the HackSL core team and the wider community of organizers.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Apply",
    text: "Submit your application and tell us about you, your campus, and why you want to be a Fellow.",
  },
  {
    number: "02",
    title: "Connect",
    text: "We'll review applications and reach out for a quick chat to get to know each other.",
  },
  {
    number: "03",
    title: "Onboard",
    text: "Get welcomed into the Fellows community with resources, a playbook, and your first goals.",
  },
  {
    number: "04",
    title: "Lead",
    text: "Start representing HackSL on your campus - run events, grow your network, and make an impact.",
  },
];

const ELIGIBILITY = [
  "Currently enrolled at a university or higher-education institution in Sri Lanka",
  "Passionate about technology, hackathons, and building community",
  "Self-motivated and able to commit a few hours each week",
  "Comfortable organizing events and reaching out to fellow students",
];

export default function FellowsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--accent)] pt-32 pb-24">
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
              University Ambassador Program
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
              Become a HackSL Fellow
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-violet-100/80">
              Lead the builder movement on your campus. As a HackSL Fellow, you
              represent HackSL at your university, connect students with
              hackathons and opportunities, and help grow Sri Lanka&apos;s tech
              ecosystem from the ground up.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[var(--accent)] shadow-lg transition-all duration-200 hover:bg-violet-50 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Apply now
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* What is it */}
        <section className="bg-[var(--background)] py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              The Program
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
              What is the Fellows Program?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
              The HackSL Fellows Program is our University Ambassador initiative
              - a network of passionate students who bring HackSL to their
              campuses. Fellows are the bridge between HackSL and student
              communities across the country: they spread the word about
              hackathons, host events, and inspire the next generation of
              builders.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
              Whether you love organizing events, building community, or simply
              want to make tech more accessible at your university, the Fellows
              Program gives you the platform, support, and network to make it
              happen.
            </p>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="bg-[var(--surface)] py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Your Role
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                What you&apos;ll do as a Fellow
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {RESPONSIBILITIES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-7"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="bg-[var(--background)] py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Why Join
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                What you&apos;ll get
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-3xl">{perk.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {perk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-[var(--surface)] py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                How It Works
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                From application to impact
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-7"
                >
                  <span className="text-2xl font-bold text-[var(--accent)]">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="bg-[var(--background)] py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Eligibility
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                Who should apply?
              </h2>
            </div>
            <ul className="mx-auto mt-10 max-w-xl space-y-4">
              {ELIGIBILITY.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  <span className="text-sm leading-relaxed text-[var(--foreground)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[var(--accent)] py-24">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              Ready to lead on your campus?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-violet-100/80">
              Join a growing network of student leaders shaping the future of
              tech in Sri Lanka. Applications are open - we&apos;d love to have
              you on board.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[var(--accent)] shadow-lg transition-all duration-200 hover:bg-violet-50 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Apply now
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
