"use client";

import { useState, useEffect, useRef } from "react";
import type { BlogPost } from "@/lib/blog-types";
import { BLOG_TYPES } from "@/lib/blog-types";
import type { Hackathon } from "@/lib/hackathon-types";

interface MemberSkill {
  category: string;
  level: number;
}

interface Member {
  userId: string;
  email: string;
  accountCreatedAt: string;
  fullName: string;
  dateOfBirth: string;
  institution: string;
  description?: string | null;
  programmingLanguages: string[];
  skills: MemberSkill[];
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  profilePhotoUrl?: string | null;
  consentToShareData: boolean;
  matchWithTeam: boolean;
  interestedInFellowship: boolean;
  subscribeToNewsletter: boolean;
}

function LoginForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      onSuccess();
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Login</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Sign in to manage hackathons
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[var(--foreground)]">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        <a href="/" className="hover:underline">← Back to Home</a>
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const [activeTab, setActiveTab] = useState<"hackathons" | "blog" | "users" | "analytics">("hackathons");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState<Partial<Hackathon>>({
    name: "",
    description: "",
    date: "",
    location: "",
    registrationUrl: "#",
    organizer: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberLanguage, setMemberLanguage] = useState("");
  const [memberSkill, setMemberSkill] = useState("");
  const [memberFlags, setMemberFlags] = useState({
    subscribeToNewsletter: false,
    matchWithTeam: false,
    interestedInFellowship: false,
  });
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    date: "",
    slug: "",
    author: "",
    image: "",
    content: "",
    type: "",
  });
  const [blogImageUploading, setBlogImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadBlogImage = async (file: File) => {
    setBlogImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blog");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setBlogForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setBlogImageUploading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setAuthStatus(data.authenticated ? "authenticated" : "unauthenticated"))
      .catch(() => setAuthStatus("unauthenticated"));
  }, []);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch("/api/hackathons")
      .then((r) => r.json())
      .then(setHackathons)
      .catch(() => setHackathons([]));

    fetch("/api/blogs")
      .then((r) => r.json())
      .then(setBlogs)
      .catch(() => setBlogs([]));

    fetch("/api/admin/members", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setMembers(Array.isArray(d) ? d : []))
      .catch(() => setMembers([]));
  }, [authStatus]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setForm((f) => ({
      ...f,
      tags: [...(f.tags || []), t],
    }));
    setTagInput("");
  };

  const removeTag = (i: number) => {
    setForm((f) => ({
      ...f,
      tags: (f.tags || []).filter((_, idx) => idx !== i),
    }));
  };

  const handleImageFile = async (file: File) => {
    setImageUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Upload failed" });
        return;
      }
      setForm((f) => ({ ...f, image: data.url }));
    } catch {
      setMessage({ type: "err", text: "Upload failed" });
    } finally {
      setImageUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Failed" });
      return;
    }
    setMessage({ type: "ok", text: "Hackathon saved." });
    setForm({
      name: "",
      description: "",
      date: "",
      location: "",
      registrationUrl: "#",
      organizer: "",
      tags: [],
      image: undefined,
      mode: undefined,
      status: undefined,
      length: undefined,
    });
    const list = await fetch("/api/hackathons").then((r) => r.json());
    setHackathons(list);
  };

  const deleteHackathon = async (id: string) => {
    if (!confirm("Delete this hackathon?")) return;
    const res = await fetch(`/api/admin/hackathons?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setHackathons((h) => h.filter((x) => x.id !== id));
      setMessage({ type: "ok", text: "Deleted." });
    } else {
      setMessage({ type: "err", text: "Delete failed." });
    }
  };

  const editHackathon = (h: Hackathon) => {
    setForm({
      id: h.id,
      name: h.name,
      description: h.description,
      date: h.date,
      location: h.location,
      registrationUrl: h.registrationUrl,
      organizer: h.organizer,
      tags: [...h.tags],
      image: h.image,
      mode: h.mode,
      status: h.status,
      length: h.length,
    });
    setMessage(null);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAuthStatus("unauthenticated");
  };

  const removeMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name}'s profile? This permanently deletes their account and data.`)) return;
    const res = await fetch(`/api/admin/members/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMembers((items) => items.filter((m) => m.userId !== userId));
      setMessage({ type: "ok", text: "Member removed." });
    } else {
      setMessage({ type: "err", text: "Failed to remove member." });
    }
  };

  const submitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(blogForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Failed to save blog post." });
      return;
    }
    setMessage({ type: "ok", text: "Blog post saved." });
    setBlogForm({
      title: "",
      excerpt: "",
      date: "",
      slug: "",
      author: "",
      image: "",
      content: "",
      type: "",
    });
    const list = await fetch("/api/blogs").then((r) => r.json());
    setBlogs(list);
  };

  const editBlog = (post: BlogPost) => {
    setBlogForm({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      slug: post.slug,
      author: post.author,
      image: post.image,
      content: post.content,
      type: post.type,
    });
    setMessage(null);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/admin/blogs?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setBlogs((items) => items.filter((b) => b.id !== id));
      setMessage({ type: "ok", text: "Blog post deleted." });
    } else {
      setMessage({ type: "err", text: "Failed to delete blog post." });
    }
  };

  // Unique programming languages and skill categories across all members, for filter dropdowns.
  const languageOptions = Array.from(
    new Set(members.flatMap((m) => m.programmingLanguages))
  ).sort((a, b) => a.localeCompare(b));
  const skillOptions = Array.from(
    new Set(members.flatMap((m) => m.skills.map((s) => s.category)))
  ).sort((a, b) => a.localeCompare(b));

  const filteredMembers = members.filter((m) => {
    const q = memberSearch.trim().toLowerCase();
    if (q) {
      const haystack = [m.fullName, m.email, m.institution]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (memberLanguage && !m.programmingLanguages.includes(memberLanguage)) return false;
    if (memberSkill && !m.skills.some((s) => s.category === memberSkill)) return false;
    if (memberFlags.subscribeToNewsletter && !m.subscribeToNewsletter) return false;
    if (memberFlags.matchWithTeam && !m.matchWithTeam) return false;
    if (memberFlags.interestedInFellowship && !m.interestedInFellowship) return false;
    return true;
  });

  const memberFiltersActive =
    memberSearch.trim() !== "" ||
    memberLanguage !== "" ||
    memberSkill !== "" ||
    memberFlags.subscribeToNewsletter ||
    memberFlags.matchWithTeam ||
    memberFlags.interestedInFellowship;

  const resetMemberFilters = () => {
    setMemberSearch("");
    setMemberLanguage("");
    setMemberSkill("");
    setMemberFlags({
      subscribeToNewsletter: false,
      matchWithTeam: false,
      interestedInFellowship: false,
    });
  };

  // High-level platform analytics, derived from the data already loaded above.
  const analytics = (() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const parsed = members
      .map((m) => ({ member: m, created: new Date(m.accountCreatedAt).getTime() }))
      .filter((x) => !Number.isNaN(x.created));

    const signupsInDays = (days: number) =>
      parsed.filter((x) => now - x.created <= days * DAY).length;

    const newLast7 = signupsInDays(7);
    const newLast30 = signupsInDays(30);
    const prev30 = parsed.filter(
      (x) => now - x.created > 30 * DAY && now - x.created <= 60 * DAY
    ).length;
    const signupTrend =
      prev30 === 0
        ? newLast30 > 0
          ? 100
          : 0
        : Math.round(((newLast30 - prev30) / prev30) * 100);

    // New sign-ups per month over the last 6 calendar months.
    const monthly: { label: string; count: number }[] = [];
    const base = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      const next = new Date(base.getFullYear(), base.getMonth() - i + 1, 1);
      const count = parsed.filter(
        (x) => x.created >= d.getTime() && x.created < next.getTime()
      ).length;
      monthly.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        count,
      });
    }
    const monthlyMax = Math.max(1, ...monthly.map((m) => m.count));

    const total = members.length;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

    // "Active / engaged" members: anyone who has opted into a program or shared a
    // profile link, i.e. did more than the bare-minimum sign-up.
    const engaged = members.filter(
      (m) =>
        m.matchWithTeam ||
        m.interestedInFellowship ||
        m.subscribeToNewsletter ||
        Boolean(m.resumeUrl) ||
        Boolean(m.linkedInUrl) ||
        Boolean(m.gitHubUrl)
    ).length;

    const engagement = [
      { label: "Newsletter subscribers", count: members.filter((m) => m.subscribeToNewsletter).length },
      { label: "Open to team matching", count: members.filter((m) => m.matchWithTeam).length },
      { label: "Interested in fellowship", count: members.filter((m) => m.interestedInFellowship).length },
    ];

    const completeness = [
      { label: "Resume", count: members.filter((m) => Boolean(m.resumeUrl)).length },
      { label: "GitHub", count: members.filter((m) => Boolean(m.gitHubUrl)).length },
      { label: "LinkedIn", count: members.filter((m) => Boolean(m.linkedInUrl)).length },
      { label: "Profile photo", count: members.filter((m) => Boolean(m.profilePhotoUrl)).length },
    ];

    const upcomingHackathons = hackathons.filter((h) => {
      const t = new Date(h.date).getTime();
      return !Number.isNaN(t) && t >= now;
    }).length;

    return {
      total,
      newLast7,
      newLast30,
      signupTrend,
      monthly,
      monthlyMax,
      engaged,
      engagedPct: pct(engaged),
      engagement,
      completeness,
      pct,
      blogCount: blogs.length,
      hackathonCount: hackathons.length,
      upcomingHackathons,
    };
  })();

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] py-20">
        <LoginForm onSuccess={() => setAuthStatus("authenticated")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin – HackSL</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage hackathons and blog posts.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            Log out
          </button>
        </div>

        <div className="mt-8 flex gap-2 border-b border-[var(--border)]">
          {([
            { key: "hackathons", label: "Hackathons" },
            { key: "blog", label: "Blog" },
            { key: "users", label: "User Admin" },
            { key: "analytics", label: "Analytics" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setMessage(null);
              }}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "hackathons" && (
        <>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Colombo"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Registration URL</label>
            <input
              type="url"
              value={form.registrationUrl}
              onChange={(e) => setForm((f) => ({ ...f, registrationUrl: e.target.value }))}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Organizer</label>
            <input
              value={form.organizer}
              onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
              placeholder="e.g. NIBM IEEE"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Mode</label>
              <select
                value={form.mode ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    mode: (e.target.value || undefined) as "online" | "in-person" | undefined,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                <option value="">In-person (default)</option>
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Event Image (optional)</label>
              <div className="mt-1 space-y-2">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] px-3 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${imageUploading ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <input
                    ref={imageFileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                  />
                  {imageUploading ? "Uploading…" : "Upload image"}
                </label>
                <input
                  value={form.image ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value || undefined }))}
                  placeholder="or paste URL: /image.png or https://..."
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
                {form.image && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="preview"
                      className="h-24 w-full rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, image: undefined }));
                        if (imageFileRef.current) imageFileRef.current.value = "";
                      }}
                      className="absolute right-1 top-1 rounded-full bg-black/50 px-1.5 py-0.5 text-xs text-white hover:bg-black/70"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Status</label>
              <select
                value={form.status ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: (e.target.value || undefined) as "upcoming" | "open" | "ended" | undefined,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                <option value="">Auto from date</option>
                <option value="upcoming">Upcoming</option>
                <option value="open">Open</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Length</label>
              <select
                value={form.length ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    length: (e.target.value || undefined) as "1-6 days" | "1-4 weeks" | "1+ month" | undefined,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                <option value="">Select</option>
                <option value="1-6 days">1-6 days</option>
                <option value="1-4 weeks">1-4 weeks</option>
                <option value="1+ month">1+ month</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Tags</label>
            <div className="mt-1 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag"
                className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--border)]"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.tags || []).map((t, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-0.5 text-sm"
                >
                  {t}{" "}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          {message && (
            <p
              className={
                message.type === "ok"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            {form.id ? "Update" : "Add"} Hackathon
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() =>
                setForm({
                  name: "",
                  description: "",
                  date: "",
                  location: "",
                  registrationUrl: "#",
                  organizer: "",
                  tags: [],
                  image: undefined,
                  mode: undefined,
                  status: undefined,
                  length: undefined,
                })
              }
              className="ml-2 text-sm text-[var(--muted)] hover:underline"
            >
              Cancel edit
            </button>
          )}
        </form>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Current hackathons</h2>
          <ul className="mt-4 space-y-3">
            {hackathons.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">{h.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {h.date} · {h.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editHackathon(h)}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHackathon(h.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        </>
        )}

        {activeTab === "blog" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Blog posts</h2>
          <form onSubmit={submitBlog} className="mt-4 space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
                <input
                  required
                  value={blogForm.title ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Date</label>
                <input
                  type="date"
                  required
                  value={blogForm.date ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Slug (optional)</label>
                <input
                  value={blogForm.slug ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="my-blog-post"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Author</label>
                <input
                  value={blogForm.author ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="e.g. Jane Perera"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Type</label>
              <select
                value={blogForm.type ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, type: e.target.value || undefined }))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              >
                <option value="">None</option>
                {BLOG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Excerpt</label>
              <textarea
                value={blogForm.excerpt ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Image (optional)</label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    value={blogForm.image ?? ""}
                    onChange={(e) => setBlogForm((f) => ({ ...f, image: e.target.value || undefined }))}
                    placeholder="Paste URL or upload a file →"
                    className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={blogImageUploading}
                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface)] disabled:opacity-60"
                  >
                    {blogImageUploading ? "Uploading…" : "Upload"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadBlogImage(file);
                      e.target.value = "";
                    }}
                  />
                </div>
                {blogForm.image && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-[var(--border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blogForm.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBlogForm((f) => ({ ...f, image: "" }))}
                      className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-[var(--surface)]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Content (optional)</label>
              <textarea
                value={blogForm.content ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              {blogForm.id ? "Update" : "Add"} Blog post
            </button>
            {blogForm.id && (
              <button
                type="button"
                onClick={() =>
                  setBlogForm({
                    title: "",
                    excerpt: "",
                    date: "",
                    slug: "",
                    author: "",
                    image: "",
                    content: "",
                    type: "",
                  })
                }
                className="ml-2 text-sm text-[var(--muted)] hover:underline"
              >
                Cancel edit
              </button>
            )}
          </form>

          {message && (
            <p className={`mt-4 ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}

          <ul className="mt-6 space-y-3">
            {blogs.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">{post.title}</p>
                  <p className="text-sm text-[var(--muted)]">{post.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editBlog(post)}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(post.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        )}

        {activeTab === "users" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            User Admin{" "}
            <span className="text-sm font-normal text-[var(--muted)]">
              ({memberFiltersActive
                ? `${filteredMembers.length} of ${members.length}`
                : members.length})
            </span>
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Everyone who signed up through the user portal. Passwords are never shown.
          </p>
          {members.length === 0 ? (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <p className="text-sm text-[var(--muted)]">No members yet.</p>
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search name, email, or institution"
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                  <select
                    value={memberLanguage}
                    onChange={(e) => setMemberLanguage(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  >
                    <option value="">All languages</option>
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <select
                    value={memberSkill}
                    onChange={(e) => setMemberSkill(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  >
                    <option value="">All skills</option>
                    {skillOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {([
                    ["subscribeToNewsletter", "Newsletter"],
                    ["matchWithTeam", "Team match"],
                    ["interestedInFellowship", "Fellowship"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <input
                        type="checkbox"
                        checked={memberFlags[key]}
                        onChange={(e) =>
                          setMemberFlags((f) => ({ ...f, [key]: e.target.checked }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                  {memberFiltersActive && (
                    <button
                      type="button"
                      onClick={resetMemberFilters}
                      className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              {filteredMembers.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">No members match these filters.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {filteredMembers.map((m) => (
                    <details key={m.userId} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-[var(--foreground)]">
                          {m.fullName}{" "}
                          <span className="font-normal text-[var(--muted)]">· {m.email}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {m.subscribeToNewsletter && (
                            <span className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]">newsletter</span>
                          )}
                          {m.matchWithTeam && (
                            <span className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]">team-match</span>
                          )}
                          {m.interestedInFellowship && (
                            <span className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]">fellow</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeMember(m.userId, m.fullName)}
                            className="rounded-lg border border-red-400 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </span>
                      </summary>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-[var(--muted)]">Institution</dt>
                          <dd className="text-[var(--foreground)]">{m.institution}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--muted)]">Date of birth</dt>
                          <dd className="text-[var(--foreground)]">{m.dateOfBirth}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-[var(--muted)]">Languages</dt>
                          <dd className="text-[var(--foreground)]">{m.programmingLanguages.join(", ") || "-"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-[var(--muted)]">Skills</dt>
                          <dd className="text-[var(--foreground)]">
                            {m.skills.map((s) => `${s.category} (${s.level})`).join(", ") || "-"}
                          </dd>
                        </div>
                        {m.description && (
                          <div className="sm:col-span-2">
                            <dt className="text-[var(--muted)]">About</dt>
                            <dd className="whitespace-pre-wrap text-[var(--foreground)]">{m.description}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-[var(--muted)]">LinkedIn</dt>
                          <dd>
                            {m.linkedInUrl ? (
                              <a href={m.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">profile</a>
                            ) : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--muted)]">GitHub</dt>
                          <dd>
                            {m.gitHubUrl ? (
                              <a href={m.gitHubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">profile</a>
                            ) : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--muted)]">Resume</dt>
                          <dd>
                            {m.resumeUrl ? (
                              <a href={m.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{m.resumeFileName || "download"}</a>
                            ) : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--muted)]">Photo</dt>
                          <dd>
                            {m.profilePhotoUrl ? (
                              <a href={m.profilePhotoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">view</a>
                            ) : "-"}
                          </dd>
                        </div>
                      </dl>
                    </details>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        )}

        {activeTab === "analytics" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Analytics</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            High-level metrics on sign-ups, active members, and platform engagement.
          </p>

          {/* Headline stat cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { label: "Total members", value: analytics.total, sub: "all-time sign-ups" },
              {
                label: "New (30 days)",
                value: analytics.newLast30,
                sub:
                  analytics.signupTrend === 0
                    ? "vs. previous 30 days"
                    : `${analytics.signupTrend > 0 ? "▲" : "▼"} ${Math.abs(analytics.signupTrend)}% vs. prev 30d`,
                trend: analytics.signupTrend,
              },
              { label: "New (7 days)", value: analytics.newLast7, sub: "recent sign-ups" },
              {
                label: "Active members",
                value: analytics.engaged,
                sub: `${analytics.engagedPct}% engaged`,
              },
            ] as const).map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <p className="text-sm text-[var(--muted)]">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{card.value}</p>
                <p
                  className={`mt-1 text-xs ${
                    "trend" in card && card.trend > 0
                      ? "text-green-600"
                      : "trend" in card && card.trend < 0
                        ? "text-red-600"
                        : "text-[var(--muted)]"
                  }`}
                >
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Sign-up trend over the last 6 months */}
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">New sign-ups (last 6 months)</h3>
            <div className="mt-6 flex items-end justify-between gap-3" style={{ height: "160px" }}>
              {analytics.monthly.map((m, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-medium text-[var(--foreground)]">{m.count}</span>
                  <div
                    className="w-full rounded-t-md bg-[var(--accent)] transition-all"
                    style={{
                      height: `${Math.round((m.count / analytics.monthlyMax) * 130)}px`,
                      minHeight: m.count > 0 ? "4px" : "0px",
                    }}
                  />
                  <span className="text-xs text-[var(--muted)]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Engagement breakdown */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Engagement</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Share of members opting into programs.</p>
              <div className="mt-4 space-y-4">
                {analytics.engagement.map((e) => (
                  <div key={e.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--foreground)]">{e.label}</span>
                      <span className="text-[var(--muted)]">
                        {e.count} ({analytics.pct(e.count)}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${analytics.pct(e.count)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile completeness */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Profile completeness</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Members who provided each field.</p>
              <div className="mt-4 space-y-4">
                {analytics.completeness.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--foreground)]">{c.label}</span>
                      <span className="text-[var(--muted)]">
                        {c.count} ({analytics.pct(c.count)}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${analytics.pct(c.count)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content overview */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {([
              { label: "Blog posts", value: analytics.blogCount },
              { label: "Hackathons", value: analytics.hackathonCount },
              { label: "Upcoming hackathons", value: analytics.upcomingHackathons },
            ] as const).map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <p className="text-sm text-[var(--muted)]">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">{card.value}</p>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <p className="mt-6 text-sm text-[var(--muted)]">
              Member metrics will populate once people sign up through the portal.
            </p>
          )}
        </div>
        )}

        <p className="mt-8 text-sm text-[var(--muted)]">
          <a href="/" className="text-[var(--foreground)] hover:underline">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
