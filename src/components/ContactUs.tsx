"use client";

import { useState } from "react";

export function ContactUs() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error("Contact form error", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Contact
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
            Get in touch
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
            Have questions or want to list your hackathon? We&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: contact info */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold text-[var(--foreground)]">
                Fastest response
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Join our WhatsApp community for real-time updates and the
                quickest reply.
              </p>
              <a
                href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#128C7E] hover:-translate-y-0.5 hover:shadow-md"
              >
                WhatsApp Community
              </a>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold text-[var(--foreground)]">Email</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                For partnerships, press, or general enquiries:
              </p>
              <a
                href="mailto:hackslcontact@gmail.com"
                className="mt-2 block text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
              >
                hackslcontact@gmail.com
              </a>
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            {status === "sent" && (
              <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                Thanks! We&apos;ll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                Something went wrong. Try WhatsApp instead.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] hover:shadow-md disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
