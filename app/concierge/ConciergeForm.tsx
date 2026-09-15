"use client";

import { useState } from "react";

export function ConciergeForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (status === "sent") {
    return (
      <div className="rounded-[3px] border border-border-strong p-8 text-center">
        <p className="text-[14px] font-semibold text-text">Message received.</p>
        <p className="mt-2 text-[13px] text-muted">
          A specialist will follow up within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage(null);

        const form = e.currentTarget;
        const data = new FormData(form);

        try {
          const res = await fetch("/api/concierge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.get("name"),
              email: data.get("email"),
              topic: data.get("topic"),
              message: data.get("message"),
              website: data.get("website"), // honeypot
            }),
          });

          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || "Could not send your message. Please try again.");
          }

          setStatus("sent");
        } catch (err) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Could not send your message. Please try again.");
        }
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-name" className="text-[12px] font-medium text-muted">
            Name
          </label>
          <input
            id="c-name"
            name="name"
            required
            className="rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-email" className="text-[12px] font-medium text-muted">
            Email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            className="rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-topic" className="text-[12px] font-medium text-muted">
          Topic
        </label>
        <select
          id="c-topic"
          name="topic"
          className="rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent"
        >
          <option>Order status</option>
          <option>Prescription verification</option>
          <option>Travel with my device</option>
          <option>Warranty / repair</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-message" className="text-[12px] font-medium text-muted">
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          required
          className="rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent"
        />
      </div>
      {/* Honeypot: hidden from real users, only bots fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" && errorMessage && (
        <p className="text-[13px] text-accent-warm" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "sending" ? "Sending…" : "Send to Concierge"}
      </button>
    </form>
  );
}
