"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isOpen) return;
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-xl">
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/hacksl-logo.png"
            alt="HackSL"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white p-2 text-[var(--foreground)] transition hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:hidden"
            aria-controls="primary-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <div
            ref={navRef}
            id="primary-navigation"
            className={`absolute inset-x-4 top-16 z-40 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-lg ring-1 ring-black/5 transition-all lg:static lg:block lg:translate-y-0 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 lg:opacity-100"
            } lg:opacity-100 lg:relative lg:flex lg:items-center lg:gap-6`}
          >
            {[
              { href: "#hackathons", label: "Hackathons" },
              { href: "#blog", label: "Blog" },
              { href: "#community", label: "Community" },
              { href: "#contact", label: "Contact" },
              { href: "/admin", label: "Admin", isLink: true },
            ].map(({ href, label, isLink }) => {
              const commonClasses =
                "block rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

              return isLink ? (
                <Link key={label} href={href} className={commonClasses} onClick={closeMenu}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} className={commonClasses} onClick={closeMenu}>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
