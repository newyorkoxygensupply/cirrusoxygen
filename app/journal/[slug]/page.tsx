import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, SERIES, getArticle } from "@/lib/journal";
import { ArticleCover } from "@/components/ArticleCover";
import { AutoLinkedBody } from "@/components/AutoLinkedBody";
import { blogPostingJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";

// Genuinely procedural articles only — steps are drawn verbatim from each
// article's own body paragraphs (never fabricated). Most journal articles
// are explanatory, not step-by-step, so this map stays intentionally short;
// add an entry only when an article's body actually walks through an
// ordered process.
const HOWTO_ARTICLES: Record<string, { name: string; steps: { title: string; body: string }[] }> = {
  "how-to-clean-cpap-equipment-schedule": {
    name: "How to clean CPAP equipment",
    steps: [
      {
        title: "Wipe the mask cushion daily",
        body: "The mask cushion gets a quick wash or CPAP wipe daily-ish — skin oils are what degrade the seal.",
      },
      {
        title: "Wash mask, tubing, and humidifier chamber weekly",
        body: "Weekly, the mask, tubing, and humidifier chamber get mild soap, warm water, a thorough rinse, and air-drying out of direct sunlight.",
      },
      {
        title: "Rinse or replace the intake filter per the manual",
        body: "The machine's intake filter gets rinsed or replaced per the manual.",
      },
      {
        title: "Use distilled water in the humidifier",
        body: "Distilled water in the humidifier, always — minerals scale the chamber and shorten its life.",
      },
    ],
  },
  "prior-authorization-medical-equipment-appeal-process": {
    name: "How to appeal a prior authorization denial for medical equipment",
    steps: [
      {
        title: "File an internal appeal with the insurer",
        body: "The appeals process typically starts with an internal appeal reviewed by the insurer.",
      },
      {
        title: "Request an external review if the internal appeal fails",
        body: "If the internal appeal is unsuccessful, most plans (particularly ACA-compliant plans) are required to offer an external review by an independent third party not affiliated with the insurer.",
      },
      {
        title: "Get a detailed letter of medical necessity that addresses the denial reason",
        body: "The single highest-leverage step in most successful appeals is a detailed letter of medical necessity from the prescribing physician, specifically addressing the insurer's stated denial reason rather than restating the original prescription.",
      },
    ],
  },
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// Without this, a slug outside generateStaticParams renders on-demand and a
// notFound() call there can get served as a cached 200 shell instead of a
// real 404 — this forces an immediate, uncached 404 for any unknown slug.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/journal/${article.slug}`;
  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      modifiedTime: article.date,
      section: article.category,
      authors: ["CIRRUS Editorial Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return notFound();

  const related = ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);
  const jsonLd = blogPostingJsonLd(article);
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Journal", url: "/journal" },
    { name: article.title, url: `/journal/${article.slug}` },
  ]);
  const howTo = HOWTO_ARTICLES[article.slug];
  const howToLd = howTo ? howToJsonLd(howTo.name, howTo.steps) : null;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      {howToLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      )}
      <ArticleCover slug={article.slug} title={article.title} category={article.category} className="h-56 w-full sm:h-72" sizes="100vw" />
      <div className="px-8 py-16">
        <div className="mx-auto max-w-[680px]">
          <Link href="/journal" className="cursor-pointer text-[12px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
            ← Journal
          </Link>
          <p className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-2">
            <span className="rounded-full border border-border-strong px-2.5 py-0.5 text-accent uppercase tracking-[0.04em]">
              {article.category}
            </span>
            <span>
              {new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              <span className="mx-2">·</span>
              {article.readTime} read
            </span>
          </p>
          <p className="mt-3 text-[12px] text-muted-2">
            By the CIRRUS Editorial Team —{" "}
            <Link href="/editorial-policy" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
              how we write and source this
            </Link>
          </p>
          <h1 className="font-display mt-3 text-[clamp(26px,4vw,38px)] font-semibold text-balance">
            {article.title}
          </h1>
          {article.series && (
            <Link
              href={SERIES[article.series].href}
              className="mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-[3px] border border-border-strong bg-surface-2 px-4 py-3 transition-colors hover:border-accent"
            >
              <span className="text-[12px] text-muted">
                Part of the series:{" "}
                <span className="font-semibold text-text">{SERIES[article.series].title}</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="shrink-0 text-accent">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          <p className="article-dek mt-4 text-[16px] leading-relaxed text-muted">{article.dek}</p>
          <div className="mt-10 flex flex-col gap-5 border-t border-border pt-10 text-[15px] leading-[1.8] text-muted">
            <AutoLinkedBody paragraphs={article.body} />
          </div>

          <p className="mt-10 border-t border-border pt-6 text-[12px] text-muted-2">
            This article is general health information, not medical advice, and doesn&rsquo;t
            replace evaluation by your own physician. Talk to a doctor about anything specific to
            your own diagnosis or treatment.
          </p>

          {article.sources && article.sources.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">Sources</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {article.sources.map((s) => (
                  <li key={s.url} className="text-[12px] text-muted-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12 border-t border-border pt-10">
              <h2 className="font-display mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                More in {article.category}
              </h2>
              <div className="flex flex-col gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/journal/${r.slug}`}
                    className="group cursor-pointer text-[14px] font-semibold transition-colors hover:text-accent"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
