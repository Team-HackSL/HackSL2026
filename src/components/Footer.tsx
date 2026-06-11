export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="text-base font-bold text-white">HackSL</span>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Connecting Sri Lanka&apos;s Tech Innovators.
              <br />
              One hackathon at a time.
            </p>
            <p className="mt-4 text-xs text-white/30">Founded 2023 · Nonprofit</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "#hackathons", label: "Hackathons" },
                { href: "#fellows", label: "Fellows" },
                { href: "#blog", label: "Blog" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Follow
            </h4>
            <ul className="mt-4 space-y-2.5">
              {[
                {
                  href: "https://www.linkedin.com/company/hacksl/",
                  label: "LinkedIn",
                },
                {
                  href: "https://www.facebook.com/hacksl.tech/",
                  label: "Facebook",
                },
                {
                  href: "https://www.instagram.com/hack.sl",
                  label: "Instagram",
                },
                {
                  href: "https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d",
                  label: "WhatsApp",
                },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} HackSL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
