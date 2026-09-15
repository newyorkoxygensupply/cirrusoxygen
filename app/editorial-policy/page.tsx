import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/editorial-policy" },
  title: "Editorial Policy",
  description: "How CIRRUS Journal content is written, sourced, and kept honest — and what it isn't a substitute for.",
};

export default function Page() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Editorial Policy", url: "/editorial-policy" },
  ]);

  return (
    <div className="px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <div className="mx-auto max-w-[680px]">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">About Our Content</p>
        <h1 className="font-display mt-4 text-[clamp(26px,4vw,38px)] font-semibold text-balance">
          Editorial Policy
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          The Journal exists to explain the equipment and conditions our customers are already
          researching — not to replace the physician who actually prescribes and manages their
          care. Here's what that means in practice.
        </p>

        <div className="mt-10 flex flex-col gap-8 border-t border-border pt-10 text-[15px] leading-[1.75] text-muted">
          <div>
            <h2 className="font-display text-[13px] font-semibold tracking-[0.08em] text-text uppercase">
              What it is
            </h2>
            <p className="mt-3">
              General health and equipment information — how a device class works, what a clinical
              term on a prescription means, what a spec sheet number actually measures. Where an
              article states a spec, price, or approval status (like FAA clearance), it reflects
              our own current catalog data, checked against manufacturer documentation, not a
              third-party summary.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[13px] font-semibold tracking-[0.08em] text-text uppercase">
              What it isn't
            </h2>
            <p className="mt-3">
              Medical advice, a diagnosis, or a substitute for evaluation by your own physician.
              Every article carries that disclaimer directly, not just in a footer link, because
              it's the most important line on the page. Nothing here should change a prescription,
              dosage, or treatment decision without your doctor.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[13px] font-semibold tracking-[0.08em] text-text uppercase">
              How it's kept current
            </h2>
            <p className="mt-3">
              Articles referencing specific products link to that product's live catalog page,
              which carries the actual current spec sheet — so a stale number in an article
              doesn't outlive the equipment update. We don't backdate or silently alter published
              dates; if an article is materially revised, the date reflects that.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[13px] font-semibold tracking-[0.08em] text-text uppercase">
              No name behind a claim we can't back up
            </h2>
            <p className="mt-3">
              We don't attribute articles to a named clinician or reviewer we can't actually
              produce. Where a claim needs clinical authority, we point to primary sources — a
              manufacturer's documentation, a device's regulatory classification — rather than
              an invented byline.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-8">
          <Link
            href="/journal"
            className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
          >
            Read the Journal
          </Link>
          <Link
            href="/faq"
            className="cursor-pointer rounded-[3px] border border-border-strong px-6 py-3 text-[13px] font-semibold"
          >
            General FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
