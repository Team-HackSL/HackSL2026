"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          HackSL
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#hackathons"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Hackathons
          </a>
          <a
            href="#community"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Community
          </a>
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
