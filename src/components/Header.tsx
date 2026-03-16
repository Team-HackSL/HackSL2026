"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--accent)] backdrop-blur-xl">
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
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="#hackathons"
            className="text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white"
          >
            Hackathons
          </a>
          <a
            href="#blog"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Blog
          </a>
          <a
            href="#community"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Community
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Contact
          </a>
          <Link
            href="/admin"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
