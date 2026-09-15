"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CONCIERGE_HOURS, CONCIERGE_PHONE_DISPLAY, CONCIERGE_PHONE_TEL } from "@/lib/concierge";

// Honest by design: this opens real contact channels (phone/email/message form)
// with the actual support hours from /concierge — it never simulates a live
// agent or claims an instant human response we can't back up.
export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) firstActionRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 sm:right-5 sm:bottom-5"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) close();
      }}
    >
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[300px] rounded-[6px] border border-border bg-surface p-5 shadow-lg">
          <p className="font-mono text-[10px] tracking-[0.08em] text-accent uppercase">Concierge</p>
          <h3 className="mt-1.5 text-[14px] font-semibold">Talk to a specialist</h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            {CONCIERGE_HOURS}. Outside those hours, send a message and your specialist replies
            within one business day.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              ref={firstActionRef}
              href={`tel:${CONCIERGE_PHONE_TEL}`}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-[3px] bg-accent px-4 py-2.5 text-center text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              Call {CONCIERGE_PHONE_DISPLAY}
            </a>
            <Link
              href="/concierge"
              onClick={close}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-[3px] border border-border-strong px-4 py-2.5 text-center text-[13px] font-semibold transition-colors hover:bg-surface-2"
            >
              Send a message
            </Link>
          </div>
        </div>
      )}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close concierge panel" : "Open concierge panel"}
        aria-expanded={open}
        className="flex h-11 w-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent text-[13px] font-semibold text-accent-ink shadow-lg transition-transform hover:-translate-y-px sm:h-auto sm:w-auto sm:px-5 sm:py-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="shrink-0">
          <path d="M4 13v-1a8 8 0 0 1 16 0v1m-16 0v3a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v3a2 2 0 0 1-2 2h-1v-6h1a1 1 0 0 1 1 1Zm-3 5a3 3 0 0 1-3 3h-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">{open ? "Close" : "Concierge"}</span>
      </button>
    </div>
  );
}
