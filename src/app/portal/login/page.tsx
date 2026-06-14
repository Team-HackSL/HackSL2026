"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/portal-api";
import { usePortal } from "@/components/portal/PortalProvider";

export default function LoginPage() {
  const router = useRouter();
  const { profile, loading: sessionLoading, setProfile } = usePortal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in? Skip the form and go straight to the profile.
  useEffect(() => {
    if (!sessionLoading && profile) router.replace("/portal/profile");
  }, [sessionLoading, profile, router]);

  const inputClass =
    "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Admins sign in through this same form - there is no separate admin page.
      // Try the admin credentials first; a non-OK response just means this is a
      // regular member, so we fall through to the portal login below.
      const adminRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email.trim(), password }),
        credentials: "include",
      });
      if (adminRes.ok) {
        router.push("/admin");
        return;
      }

      const auth = await login(email, password);
      setProfile(auth.profile);
      router.push("/portal/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Log in</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Welcome back to the HackSL Portal.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        No account?{" "}
        <Link href="/portal/signup" className="text-[var(--accent)] hover:underline">Create one</Link>
      </p>
    </div>
  );
}
