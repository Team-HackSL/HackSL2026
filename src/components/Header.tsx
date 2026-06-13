"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { HackerModeToggle } from "./HackerModeToggle";
import { useHackerMode } from "./HackerModeProvider";
import { getToken } from "@/lib/portal-api";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { hacker } = useHackerMode();

  // Reflect the portal session: returning (authenticated) users see "Log in",
  // everyone else sees "Sign up". Read after mount to avoid hydration mismatch.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const update = () => setAuthed(!!getToken());
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

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

  // Solid auth button (Sign up / Log in) - the primary portal action, pinned right.
  const authBtnClass = hacker
    ? "rounded-lg bg-[#00ff66] px-4 py-2 font-mono text-sm font-semibold text-[#03110a] transition-all duration-200 hover:shadow-[0_0_18px_-4px_rgba(0,255,102,0.8)]"
    : "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)] transition-all duration-200 hover:bg-white/90";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${headerClass}`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={hacker ? "/hacksl-logo-black.jpg" : "/hacksl-logo.png"}
              alt="HackSL"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <HackerModeToggle />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLinks className="flex items-center gap-6" />
          {!hacker && <ThemeToggle />}
          {authed ? (
            <Link href="/portal/profile" className={authBtnClass}>
              {hacker ? <>&gt;_ Log in</> : "Log in"}
            </Link>
          ) : (
            <Link href="/portal" className={authBtnClass}>
              {hacker ? <>&gt;_ Sign up</> : "Sign up"}
            </Link>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger (hacker toggle now sits next to the logo) */}
        <div className="flex items-center gap-1 md:hidden">
          {!hacker && <ThemeToggle />}
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
            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
              {authed ? (
                <Link
                  href="/portal/profile"
                  className={`block text-center ${authBtnClass}`}
                  onClick={() => setIsOpen(false)}
                >
                  {hacker ? <>&gt;_ Log in</> : "Log in"}
                </Link>
              ) : (
                <Link
                  href="/portal"
                  className={`block text-center ${authBtnClass}`}
                  onClick={() => setIsOpen(false)}
                >
                  {hacker ? <>&gt;_ Sign up</> : "Sign up"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
