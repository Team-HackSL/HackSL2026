"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { HackerModeToggle } from "./HackerModeToggle";
import { useHackerMode } from "./HackerModeProvider";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { hacker } = useHackerMode();

  const NavLinks = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <a
        href="/#hackathons"
        className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        Hackathons
      </a>
      <a
        href="/#blog"
        className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        Blog
      </a>
      <a
        href="/#community"
        className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        Community
      </a>
      <a
        href="/#about"
        className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        About
      </a>
      <Link
        href="/admin"
        className="text-sm font-medium text-white/40 transition-colors duration-200 hover:text-white/70"
        onClick={() => setIsOpen(false)}
      >
        Admin
      </Link>
    </div>
  );

  const headerClass = hacker
    ? "border-[#00ff66]/20 bg-[#05080a]/90"
    : "border-white/10 bg-[var(--accent)]/95";

  const ctaClass = hacker
    ? "rounded-lg border border-[#00ff66]/40 bg-[#00ff66]/10 px-4 py-2 font-mono text-sm font-semibold text-[#00ff66] transition-all duration-200 hover:bg-[#00ff66]/20 hover:shadow-[0_0_18px_-4px_rgba(0,255,102,0.7)]"
    : "rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/25";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${headerClass}`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLinks className="flex items-center gap-6" />
          <div className="flex items-center gap-2">
            <HackerModeToggle />
            <ThemeToggle />
          </div>
          <a href="/#contact" className={ctaClass}>
            {hacker ? <>&gt;_ Get in touch</> : "Get in touch"}
          </a>
        </div>

        {/* Mobile: hacker toggle + theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <HackerModeToggle />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="flex h-5 w-5 flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-white transition-transform duration-200 ${
                  isOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white transition-opacity duration-200 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white transition-transform duration-200 ${
                  isOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile nav panel */}
      {isOpen && (
        <div
          className={`border-t md:hidden ${
            hacker
              ? "border-[#00ff66]/15 bg-[#05080a]"
              : "border-white/10 bg-[var(--accent)]"
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            <NavLinks className="flex flex-col items-start gap-3 pb-3" />
            <div className="border-t border-white/10 pt-3">
              <a
                href="/#contact"
                className={`block text-center ${ctaClass}`}
                onClick={() => setIsOpen(false)}
              >
                {hacker ? <>&gt;_ Get in touch</> : "Get in touch"}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
