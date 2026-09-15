import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, CATEGORIES } from "@/lib/journal";
import { ArticleCover } from "@/components/ArticleCover";
import { Tilt } from "@/components/Tilt";

export const metadata: Metadata = {
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/rss.xml" },
  },
  title: "Journal",
  description: "Accurate, plain-language articles on respiratory health, sleep, fitness, nutrition, and longevity from the CIRRUS team.",
};

export default function Page() {
  return (
    <div>
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Reading</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Journal
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            {ARTICLES.length} articles on respiratory health, sleep, fitness, nutrition, and
            longevity — written for accuracy first, not search rankings. General information, not
            medical advice; talk to your physician about anything specific to your own care.
          </p>
        </div>
        <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <a
              key={c}
              href={`#${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="cursor-pointer rounded-full border border-border-strong px-3.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {c}
            </a>
          ))}
        </div>
      </section>

      {CATEGORIES.map((category) => {
        const articles = ARTICLES.filter((a) => a.category === category);
        if (articles.length === 0) return null;
        const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        return (
          <section key={category} id={anchor} className="scroll-mt-20 border-b border-border px-8 py-14">
            <div className="mx-auto max-w-[1160px]">
              <h2 className="font-display mb-7 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <Tilt key={a.slug} className="overflow-hidden rounded-[3px]">
                    <Link
                      href={`/journal/${a.slug}`}
                      className="group flex h-full cursor-pointer flex-col border border-border transition-colors hover:bg-surface-2"
                    >
                      <ArticleCover
                        slug={a.slug}
                        title={a.title}
                        category={a.category}
                        className="h-36 w-full"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <p className="font-mono text-[10px] text-muted-2">
                          {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          <span className="mx-1.5">·</span>
                          {a.readTime} read
                        </p>
                        <h3 className="font-display mt-2 text-[16px] font-semibold text-balance">
                          {a.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-[13px] text-muted">{a.dek}</p>
                      </div>
                    </Link>
                  </Tilt>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
