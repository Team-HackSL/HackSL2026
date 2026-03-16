"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/blog-types";
import type { Hackathon } from "@/lib/hackathon-types";

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
    <div className="mx-auto max-w-sm rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
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
            className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
            className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    date: "",
    slug: "",
    image: "",
    content: "",
  });

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
      image: "",
      content: "",
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
      image: post.image,
      content: post.content,
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

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--accent-light)]">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--accent-light)] py-20">
        <LoginForm onSuccess={() => setAuthStatus("authenticated")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--accent-light)] py-20">
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
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white"
          >
            Log out
          </button>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-[var(--border)] bg-white p-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Colombo"
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Organizer</label>
            <input
              value={form.organizer}
              onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
              placeholder="e.g. NIBM IEEE"
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              >
                <option value="">In-person (default)</option>
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Image URL (optional)</label>
              <input
                value={form.image ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value || undefined }))}
                placeholder="/image.png or https://..."
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
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
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white p-4"
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

        <div className="mt-14 border-t border-[var(--border)] pt-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Blog posts</h2>
          <form onSubmit={submitBlog} className="mt-4 space-y-4 rounded-xl border border-[var(--border)] bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
                <input
                  required
                  value={blogForm.title ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Date</label>
                <input
                  type="date"
                  required
                  value={blogForm.date ?? ""}
                  onChange={(e) => setBlogForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
                />
              </div>
            </div>
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
              <label className="block text-sm font-medium text-[var(--foreground)]">Excerpt</label>
              <textarea
                value={blogForm.excerpt ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Image URL (optional)</label>
              <input
                value={blogForm.image ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, image: e.target.value || undefined }))}
                placeholder="/blog/image.jpg or https://..."
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Content (optional)</label>
              <textarea
                value={blogForm.content ?? ""}
                onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
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
                    image: "",
                    content: "",
                  })
                }
                className="ml-2 text-sm text-[var(--muted)] hover:underline"
              >
                Cancel edit
              </button>
            )}
          </form>

          <ul className="mt-6 space-y-3">
            {blogs.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white p-4"
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

        <p className="mt-8 text-sm text-[var(--muted)]">
          <a href="/" className="text-[var(--foreground)] hover:underline">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
