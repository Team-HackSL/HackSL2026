"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, uploadResume, uploadPhoto } from "@/lib/portal-api";
import { usePortal } from "@/components/portal/PortalProvider";
import {
  ProfileFields,
  emptyProfileForm,
  formToProfileFields,
  type ProfileFormState,
} from "@/components/portal/ProfileFields";

export default function SignupPage() {
  const router = useRouter();
  const { setProfile } = usePortal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm());
  const [resume, setResume] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]";
  const labelClass = "block text-sm font-medium text-[var(--foreground)]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.consentToShareData) {
      setError("You must consent to HackSL using your data to create a profile.");
      return;
    }

    setLoading(true);
    try {
      const auth = await register({ email, password, ...formToProfileFields(form) });
      let profile = auth.profile;
      // Files require the auth token, which register() has now stored.
      if (resume) profile = await uploadResume(resume);
      if (photo) profile = await uploadPhoto(photo);
      setProfile(profile);
      router.push("/portal/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Create your profile</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Join the HackSL community - get matched with teams and discovered by partners.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Account */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        {/* Shared profile fields */}
        <ProfileFields state={form} onChange={setForm} />

        {/* Uploads */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="resume" className={labelClass}>
              Resume (PDF / Word) <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
              className={inputClass + " file:mr-3 file:rounded file:border-0 file:bg-[var(--surface)] file:px-3 file:py-1"}
            />
          </div>
          <div>
            <label htmlFor="photo" className={labelClass}>
              Profile photo <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className={inputClass + " file:mr-3 file:rounded file:border-0 file:bg-[var(--surface)] file:px-3 file:py-1"}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? "Creating your profile…" : "Create profile"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/portal/login" className="text-[var(--accent)] hover:underline">Log in</Link>
      </p>
    </div>
  );
}
