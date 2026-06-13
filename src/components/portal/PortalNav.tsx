"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePortal } from "./PortalProvider";
import { HackerModeToggle } from "../HackerModeToggle";
import { useHackerMode } from "../HackerModeProvider";

export function PortalNav() {
  const { profile, logout } = usePortal();
  const { hacker } = useHackerMode();
  const router = useRouter();

  const headerClass = hacker
    ? "border-[#00ff66]/20 bg-[#05080a]/90"
    : "border-white/10 bg-[var(--accent)]/95";

  const btnClass = "rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${headerClass}`}>
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex items-center gap-2">
            <Image
              src={hacker ? "/hacksl-logo-black.jpg" : "/hacksl-logo.png"}
              alt="HackSL"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <span className="text-sm font-semibold text-white/90">Portal</span>
          </Link>
          <HackerModeToggle />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-white/70 hover:text-white">
            Home
          </Link>
          {profile ? (
            <>
              <Link href="/portal/profile" className="text-sm font-medium text-white/80 hover:text-white">
                My profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/portal/login");
                }}
                className={btnClass}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/portal/login" className={btnClass}>
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
