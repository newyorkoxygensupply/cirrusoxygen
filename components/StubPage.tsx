import Link from "next/link";

/**
 * Shared shell for sitemap routes not yet given bespoke design treatment.
 * Keeps the IA fully navigable (no dead links) while making it obvious,
 * in the UI itself, which pages still need real design work.
 */
export function StubPage({
  eyebrow,
  title,
  description,
  status = "Coming next",
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
}) {
  return (
    <div className="mx-auto max-w-[720px] px-8 py-28 text-center">
      <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{eyebrow}</p>
      <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
        {description}
      </p>
      <span className="mt-8 inline-block rounded-full border border-border-strong px-4 py-1.5 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
        {status}
      </span>
      <div className="mt-10">
        <Link href="/" className="cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
