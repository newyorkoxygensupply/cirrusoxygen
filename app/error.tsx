"use client";

import Link from "next/link";
import { ScatteredWisps } from "@/components/Logo";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center px-8 py-32 text-center">
      <ScatteredWisps />
      <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Something went wrong</p>
      <h1 className="font-display mt-4 text-[clamp(26px,4vw,38px)] font-semibold">
        This page hit a snag.
      </h1>
      <p className="mt-4 max-w-[44ch] text-[14px] text-muted">
        Nothing on your order was affected. Try again, or go somewhere that already works.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
        >
          Try again
        </button>
        <Link
          href="/"
          className="cursor-pointer rounded-[3px] border border-border-strong px-6 py-3 text-[13px] font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
