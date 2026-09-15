import { PRODUCTS, productHref } from "./products";
import { ARTICLES } from "./journal";
import { GLOSSARY } from "./glossary";
import { GUIDES } from "./guides";
import { COMPARISONS, resolveComparison } from "./comparisons";
import { CITIES } from "./cities";

export type SearchEntry = { title: string; description: string; href: string; type: string };

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const p of PRODUCTS) {
    entries.push({ title: p.name, description: `${p.brand}${p.spec ? " — " + p.spec : ""}`, href: productHref(p), type: "Product" });
  }
  for (const a of ARTICLES) {
    entries.push({ title: a.title, description: a.dek, href: `/journal/${a.slug}`, type: "Journal" });
  }
  for (const g of GLOSSARY) {
    entries.push({ title: g.term, description: g.definition[0], href: `/glossary/${g.slug}`, type: "Glossary" });
  }
  for (const g of GUIDES) {
    entries.push({ title: g.title, description: g.dek, href: `/guides/${g.slug}`, type: "Guide" });
  }
  for (const c of COMPARISONS) {
    const { a, b } = resolveComparison(c);
    if (a && b) entries.push({ title: `${a.name} vs. ${b.name}`, description: "Comparison", href: `/compare/${c.slug}`, type: "Compare" });
  }
  for (const city of CITIES.slice(0, 200)) {
    entries.push({ title: `${city.city}, ${city.state}`, description: "Shipping coverage", href: `/areas-served/${city.slug}`, type: "Areas Served" });
  }

  return entries;
}
