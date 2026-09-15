import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tilt } from "@/components/Tilt";
import type { Crumb } from "@/lib/breadcrumbs";

type SubLink = { label: string; href: string; desc: string };
type Product = { name: string; spec: string; price: string; href: string };

export function CategoryHub({
  eyebrow,
  title,
  intro,
  subLinks,
  products,
  crumbs,
  pillar,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  subLinks: SubLink[];
  products: Product[];
  crumbs?: Crumb[];
  /** Optional link to the section's pillar guide, shown under the intro. */
  pillar?: { label: string; href: string };
}) {
  return (
    <div>
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{eyebrow}</p>
          <h1 className="font-display mt-4 text-[clamp(30px,4.5vw,48px)] font-semibold text-balance">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            {intro}
          </p>
          {pillar && (
            <Link
              href={pillar.href}
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-5 py-2 text-[13px] font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="text-accent">
                <path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {pillar.label}
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
        {subLinks.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className={`group cursor-pointer p-8 transition-colors hover:bg-surface-2 ${
              i < subLinks.length - 1 ? "border-b border-border sm:border-r sm:border-b-0" : ""
            }`}
          >
            <h2 className="text-[15px] font-semibold">{s.label}</h2>
            <p className="mt-2 text-[13px] text-muted">{s.desc}</p>
            <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
              Browse
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Available now
          </h2>
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {products.map((p) => (
              <Tilt key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                >
                  <div
                    className="mb-5 h-40 rounded-[2px]"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 18%, var(--surface-2)) 0%, var(--surface-2) 70%)",
                    }}
                    aria-hidden="true"
                  />
                  <h3 className="text-[15px] font-semibold">{p.name}</h3>
                  <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>
                  <p className="mt-4 font-mono text-[16px] tabular-nums">{p.price}</p>
                </Link>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
