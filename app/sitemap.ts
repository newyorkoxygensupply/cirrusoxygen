import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { PRODUCTS, productHref } from "@/lib/products";
import { ARTICLES } from "@/lib/journal";
import { CITIES } from "@/lib/cities";
import { GLOSSARY } from "@/lib/glossary";
import { COMPARISONS } from "@/lib/comparisons";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/schema";

// Real last-modified dates instead of "now" on every build — reads the file's
// actual last git commit date, falling back to filesystem mtime for files
// that aren't committed yet (never a fabricated/arbitrary date).
function lastModifiedOf(relFile: string): Date {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%aI", "--", relFile], {
      cwd: process.cwd(),
      encoding: "utf-8",
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // not in git history yet — fall through to mtime
  }
  try {
    return statSync(path.join(process.cwd(), relFile)).mtime;
  } catch {
    return new Date();
  }
}

const PATHS: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "oxygen", priority: 0.9, changeFrequency: "daily" },
  { path: "oxygen/guide", priority: 0.75, changeFrequency: "monthly" },
  { path: "oxygen/portable", priority: 0.85, changeFrequency: "weekly" },
  { path: "oxygen/stationary", priority: 0.8, changeFrequency: "weekly" },
  { path: "oxygen/accessories", priority: 0.6, changeFrequency: "weekly" },
  { path: "oxygen/tanks", priority: 0.5, changeFrequency: "weekly" },
  { path: "sleep", priority: 0.9, changeFrequency: "daily" },
  { path: "sleep/guide", priority: 0.75, changeFrequency: "monthly" },
  { path: "sleep/cpap", priority: 0.85, changeFrequency: "weekly" },
  { path: "sleep/bipap-apap", priority: 0.8, changeFrequency: "weekly" },
  { path: "sleep/accessories", priority: 0.6, changeFrequency: "weekly" },
  { path: "respiratory-accessories", priority: 0.6, changeFrequency: "weekly" },
  { path: "the-standard", priority: 0.5, changeFrequency: "monthly" },
  { path: "why-cash-pay", priority: 0.6, changeFrequency: "monthly" },
  { path: "prescription", priority: 0.5, changeFrequency: "monthly" },
  { path: "concierge", priority: 0.5, changeFrequency: "monthly" },
  { path: "journal", priority: 0.6, changeFrequency: "weekly" },
  { path: "equipment", priority: 0.3, changeFrequency: "monthly" },
  { path: "equipment/mobility", priority: 0.2, changeFrequency: "monthly" },
  { path: "equipment/beds", priority: 0.2, changeFrequency: "monthly" },
  { path: "shipping", priority: 0.3, changeFrequency: "monthly" },
  { path: "returns", priority: 0.3, changeFrequency: "monthly" },
  { path: "privacy", priority: 0.1, changeFrequency: "monthly" },
  { path: "terms", priority: 0.1, changeFrequency: "monthly" },
  { path: "areas-served", priority: 0.4, changeFrequency: "monthly" },
  { path: "ventilators", priority: 0.5, changeFrequency: "weekly" },
  { path: "ventilators/guide", priority: 0.6, changeFrequency: "monthly" },
  { path: "glossary", priority: 0.4, changeFrequency: "monthly" },
  { path: "compare", priority: 0.5, changeFrequency: "monthly" },
  { path: "guides", priority: 0.5, changeFrequency: "monthly" },
  { path: "faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "editorial-policy", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productsFileDate = lastModifiedOf("lib/products.ts");
  const citiesFileDate = lastModifiedOf("lib/cities.ts");
  const glossaryFileDate = lastModifiedOf("lib/glossary.ts");
  const comparisonsFileDate = lastModifiedOf("lib/comparisons.ts");
  const guidesFileDate = lastModifiedOf("lib/guides.ts");

  const staticEntries = PATHS.map(({ path: p, priority, changeFrequency }) => ({
    url: `${SITE_URL}/${p}`,
    lastModified: lastModifiedOf(p ? `app/${p}/page.tsx` : "app/page.tsx"),
    changeFrequency,
    priority,
  }));

  const productEntries = PRODUCTS.map((p) => ({
    url: `${SITE_URL}${productHref(p)}`,
    lastModified: productsFileDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    ...(p.image ? { images: [`${SITE_URL}${p.image}`] } : {}),
  }));

  const articleEntries = ARTICLES.map((a) => ({
    url: `${SITE_URL}/journal/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  const cityEntries = CITIES.map((c) => ({
    url: `${SITE_URL}/areas-served/${c.slug}`,
    lastModified: citiesFileDate,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  const glossaryEntries = GLOSSARY.map((g) => ({
    url: `${SITE_URL}/glossary/${g.slug}`,
    lastModified: glossaryFileDate,
    changeFrequency: "monthly" as const,
    priority: 0.35,
  }));

  const comparisonEntries = COMPARISONS.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug}`,
    lastModified: comparisonsFileDate,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  const guideEntries = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: guidesFileDate,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  return [
    ...staticEntries,
    ...productEntries,
    ...articleEntries,
    ...cityEntries,
    ...glossaryEntries,
    ...comparisonEntries,
    ...guideEntries,
  ];
}
