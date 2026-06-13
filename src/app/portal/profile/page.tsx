"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, uploadResume, uploadPhoto, deleteProfile } from "@/lib/portal-api";
import { usePortal } from "@/components/portal/PortalProvider";
import {
  ProfileFields,
  profileToForm,
  formToProfileFields,
  type ProfileFormState,
} from "@/components/portal/ProfileFields";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, setProfile } = usePortal();

  const [form, setForm] = useState<ProfileFormState | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const resumeRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Redirect to login once we know there's no session (but not while deleting,
  // which clears the profile and navigates to /portal itself).
  useEffect(() => {
    if (!loading && !profile && !deleting) router.replace("/portal/login");
  }, [loading, profile, router, deleting]);

  // Seed the edit form from the loaded profile.
  useEffect(() => {
    if (profile && !form) setForm(profileToForm(profile));
  }, [profile, form]);

  if (loading || !profile || !form) {
    return <p className="text-center text-[var(--muted)]">Loading…</p>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.consentToShareData) {
      setMessage({ type: "err", text: "Consent to use your data is required." });
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile(formToProfileFields(form));
      setProfile(updated);
      setForm(profileToForm(updated));
      setMessage({ type: "ok", text: "Profile saved." });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (kind: "resume" | "photo", file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    setBusy(true);
    try {
      const updated = kind === "resume" ? await uploadResume(file) : await uploadPhoto(file);
      setProfile(updated);
      setMessage({ type: "ok", text: `${kind === "resume" ? "Resume" : "Photo"} uploaded.` });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setMessage(null);
    setDeleting(true);
    try {
      await deleteProfile();
      setProfile(null);
      router.replace("/portal");
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Delete failed" });
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card with photo + assets */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {profile.profilePhotoUrl ? (
            <Image
              src={profile.profilePhotoUrl}
              alt={profile.fullName}
              width={72}
              height={72}
              className="h-18 w-18 rounded-full object-cover"
              style={{ height: 72, width: 72 }}
              unoptimized
            />
          ) : (
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[var(--surface)] text-xl font-semibold text-[var(--muted)]" style={{ height: 72, width: 72 }}>
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[var(--foreground)]">{profile.fullName}</h1>
            <p className="text-sm text-[var(--muted)]">{profile.email}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => photoRef.current?.click()}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-60"
          >
            {profile.profilePhotoUrl ? "Replace photo" : "Upload photo"}
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleUpload("photo", e.target.files?.[0])}
          />

          <button
            type="button"
            disabled={busy}
            onClick={() => resumeRef.current?.click()}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-60"
          >
            {profile.resumeUrl ? "Replace resume" : "Upload resume"}
          </button>
          <input
            ref={resumeRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => handleUpload("resume", e.target.files?.[0])}
          />

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              View resume ({profile.resumeFileName})
            </a>
          )}
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8"
      >
        <h2 className="mb-6 text-lg font-semibold text-[var(--foreground)]">Edit details</h2>
        <ProfileFields state={form} onChange={setForm} />

        {message && (
          <p className={`mt-4 text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-300 bg-red-50/40 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/10">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Delete profile</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Permanently delete your account, profile, skills, and uploaded resume &amp; photo. This cannot be undone.
        </p>
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="mt-4 rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete my profile
          </button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Are you sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Yes, delete permanently"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
