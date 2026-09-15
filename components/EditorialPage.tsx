import type { ReactNode } from "react";

export function EditorialHero({
  eyebrow,
  title,
  intro,
  graphic,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Optional hero icon (see EditorialGraphics.tsx) — a real, specific
   *  concept for the page, not decoration for its own sake. */
  graphic?: ReactNode;
}) {
  return (
    <section className="border-b border-border px-8 py-20">
      <div className="mx-auto max-w-[720px] text-center">
        {graphic && <div data-reveal className="mb-7">{graphic}</div>}
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{eyebrow}</p>
        <h1 className="font-display mt-4 text-[clamp(28px,4vw,44px)] font-semibold text-balance">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-muted">{intro}</p>
      </div>
    </section>
  );
}

export function EditorialSection({
  heading,
  children,
}: {
  heading?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border px-8 py-14">
      <div className="mx-auto max-w-[680px]">
        {heading && (
          <h2 className="font-display mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            {heading}
          </h2>
        )}
        <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-muted">{children}</div>
      </div>
    </section>
  );
}

export function StatRow({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
      {items.map(([v, l], i) => (
        <div
          key={v}
          className={`px-5 py-6 text-center ${i < items.length - 1 ? "border-r border-border" : ""}`}
        >
          <div className="font-mono text-[20px] font-medium">{v}</div>
          <div className="mt-1 text-[11px] text-muted">{l}</div>
        </div>
      ))}
    </div>
  );
}
