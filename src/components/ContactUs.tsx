"use client";

import { useState } from "react";

export function ContactUs() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    // Placeholder: in production, wire to an API or email service
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  return (
    <section id="contact" className="border-t border-[var(--border)] bg-[var(--surface)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Contact Us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Have questions or want to list your hackathon? Get in touch.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Reach out</h3>
            <p className="mt-2 text-[var(--muted)]">
              Connect with us on WhatsApp for the fastest response, or use the
              form and we&apos;ll get back to you.
            </p>
            <a
              href="https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#128C7E]"
            >
              WhatsApp Community
            </a>
            <div className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:hackslcontact@gmail.com"
                  className="text-[var(--accent)] transition-colors hover:underline"
                >
                  hackslcontact@gmail.com
                </a>
              </p>
            </div> 
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            {status === "sent" && (
              <p className="text-sm text-green-600">Thanks! We&apos;ll be in touch.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">Something went wrong. Try WhatsApp.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
