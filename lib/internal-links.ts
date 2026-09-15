import { GLOSSARY } from "./glossary";

export type LinkTerm = { phrase: string; href: string };

// Curated, natural-language phrases mapped to real category pages — used to
// auto-link the first mention of each in article/guide body copy. Ordered
// most-specific-first isn't required; the linker itself picks the longest
// match at each position.
const CATEGORY_TERMS: LinkTerm[] = [
  { phrase: "portable oxygen concentrators", href: "/oxygen/portable" },
  { phrase: "portable oxygen concentrator", href: "/oxygen/portable" },
  { phrase: "stationary oxygen concentrators", href: "/oxygen/stationary" },
  { phrase: "stationary oxygen concentrator", href: "/oxygen/stationary" },
  { phrase: "oxygen concentrators", href: "/oxygen" },
  { phrase: "oxygen concentrator", href: "/oxygen" },
  { phrase: "CPAP machines", href: "/sleep/cpap" },
  { phrase: "CPAP machine", href: "/sleep/cpap" },
  { phrase: "CPAP therapy", href: "/sleep/cpap" },
  { phrase: "CPAP", href: "/sleep/cpap" },
  { phrase: "BiPAP machines", href: "/sleep/bipap-apap" },
  { phrase: "BiPAP machine", href: "/sleep/bipap-apap" },
  { phrase: "BiPAP therapy", href: "/sleep/bipap-apap" },
  { phrase: "BiPAP", href: "/sleep/bipap-apap" },
  { phrase: "ventilators", href: "/ventilators" },
  { phrase: "ventilator", href: "/ventilators" },
  { phrase: "pulse oximeters", href: "/respiratory-accessories" },
  { phrase: "pulse oximeter", href: "/respiratory-accessories" },
  { phrase: "nebulizers", href: "/respiratory-accessories" },
  { phrase: "nebulizer", href: "/respiratory-accessories" },
];

// Real glossary entries — the acronym/short form and the descriptive phrase
// inside parentheses (if any) both link to the same real glossary page.
function glossaryTerms(): LinkTerm[] {
  const terms: LinkTerm[] = [];
  for (const g of GLOSSARY) {
    const href = `/glossary/${g.slug}`;
    const m = g.term.match(/^(.+?)\s*\((.+)\)$/);
    if (m) {
      const [, short, long] = m;
      if (/^[A-Za-z0-9/ -]+$/.test(short)) terms.push({ phrase: short.trim(), href });
      terms.push({ phrase: long.trim(), href });
    } else {
      terms.push({ phrase: g.term.trim(), href });
    }
  }
  return terms;
}

// Hand-picked article-to-article cross-links, added deliberately (not derived
// from a general term list) where one journal article's body references
// another by name — e.g. to connect two pieces on a related but distinct
// angle of the same topic so neither reads as an orphan. Kept short; this is
// not a general auto-linker between all 450+ articles, just the specific
// pairs an editor chose to connect.
const JOURNAL_CROSS_TERMS: LinkTerm[] = [
  { phrase: "how common home oxygen fires actually are", href: "/journal/home-oxygen-fire-safety-statistics-precautions" },
  { phrase: "why oxygen needs can change overnight", href: "/journal/nocturnal-hypoxemia-why-oxygen-needs-change-sleep" },
  { phrase: "a structured pulmonary rehab program", href: "/journal/pulmonary-rehabilitation-what-to-expect" },
  { phrase: "our staging guide", href: "/journal/copd-stages-gold-criteria-explained" },
];

export function buildLinkTerms(): LinkTerm[] {
  return [...CATEGORY_TERMS, ...glossaryTerms(), ...JOURNAL_CROSS_TERMS];
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type BodySegment = { text: string; href?: string };

/**
 * Auto-links the first unlinked mention of each real term in a body of
 * paragraphs. Caps total links per article to keep it from reading as
 * keyword-stuffed, and never links the same href twice in one piece.
 */
export function linkifyBody(paragraphs: string[], terms: LinkTerm[], maxLinks = 6): BodySegment[][] {
  const compiled = terms
    .map((t) => ({ ...t, re: new RegExp(`\\b${escapeRegExp(t.phrase)}\\b`, "i") }))
    .sort((a, b) => b.phrase.length - a.phrase.length);

  const usedHrefs = new Set<string>();
  let linksLeft = maxLinks;

  return paragraphs.map((paragraph) => {
    if (linksLeft <= 0) return [{ text: paragraph }];

    let best: { index: number; length: number; href: string; match: string } | null = null;
    for (const t of compiled) {
      if (usedHrefs.has(t.href)) continue;
      const m = t.re.exec(paragraph);
      if (!m) continue;
      if (!best || m.index < best.index || (m.index === best.index && m[0].length > best.length)) {
        best = { index: m.index, length: m[0].length, href: t.href, match: m[0] };
      }
    }

    if (!best) return [{ text: paragraph }];

    usedHrefs.add(best.href);
    linksLeft -= 1;

    const before = paragraph.slice(0, best.index);
    const after = paragraph.slice(best.index + best.length);
    const segments: BodySegment[] = [];
    if (before) segments.push({ text: before });
    segments.push({ text: best.match, href: best.href });
    if (after) segments.push({ text: after });
    return segments;
  });
}
