export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--dark)] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="text-sm font-medium text-white">HackSL</span>
            <p className="text-sm text-white/80">
              Connecting Sri Lanka&apos;s Tech Innovators
              <br />
              Founded in 2023
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a
              href="https://www.linkedin.com/company/hacksl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://www.facebook.com/hacksl.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/hack.sl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
