// Official logos: Simple Icons CDN (LinkedIn removed from Simple Icons - use inline SVG)
const LINKS = [
  {
    name: "WhatsApp Community",
    href: "https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d",
    description: "Join our channel for updates & announcements",
    logo: "https://cdn.simpleicons.org/whatsapp/25D366",
    color: "#25D366",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hacksl/",
    description: "Connect with us professionally",
    color: "#0A66C2",
    logoSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/hacksl.tech/",
    description: "Follow us on Facebook",
    logo: "https://cdn.simpleicons.org/facebook/1877F2",
    color: "#1877F2",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hack.sl",
    description: "Follow @hack.sl",
    logo: "https://cdn.simpleicons.org/instagram/E4405F",
    color: "#E4405F",
  },
] as const;

export function Community() {
  return (
    <section id="community" className="bg-[var(--background)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Community
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
            Join the Community
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            Stay connected for hackathon updates, events, and tech news from Sri
            Lanka.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--brand)] hover:shadow-lg hover:[--icon-color:white] hover:text-white focus-visible:border-transparent focus-visible:bg-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:[--icon-color:white] focus-visible:text-white"
              style={
                {
                  ["--brand" as string]: link.color,
                  ["--icon-color" as string]: link.color,
                } as React.CSSProperties
              }
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:bg-white/20 group-hover:[filter:brightness(0)_invert(1)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-[var(--icon-color)]"
                style={{ backgroundColor: `${link.color}20` }}
              >
                {"logoSvg" in link ? (
                  link.logoSvg
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={link.logo}
                    alt=""
                    className="h-6 w-6 object-contain"
                    aria-hidden
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] transition-colors group-hover:text-white">
                  {link.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)] transition-colors group-hover:text-white/80">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
