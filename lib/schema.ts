import { productHref, CATEGORY_META, PRODUCTS, RENTAL_PURCHASE_EQUIVALENT, type Product } from "./products";
import { productDescription } from "./metadata";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cirrus.example.com";

// ── Entity anchors ──────────────────────────────────────────────────
// Stable @id fragments let Google consolidate every mention of the brand
// (publisher, author, seller, provider) into ONE knowledge-graph node
// instead of treating each page's Organization block as a separate entity.
// This is the single highest-leverage "entity SEO" move on the site: the
// same @id string is emitted everywhere and referenced by @id elsewhere.
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// Reusable reference objects — emit these instead of re-declaring the
// Organization/WebSite inline, so the graph points back to the canonical node.
export const orgRef = { "@id": ORG_ID } as const;
export const websiteRef = { "@id": WEBSITE_ID } as const;

// Real /returns policy: all sales are final — no returns, no exchanges on
// any category, devices or masks alike. MerchantReturnNotPermitted is the
// schema.org / Google Merchant enum for exactly this; merchantReturnDays,
// returnMethod, restockingFee, etc. don't apply once returns aren't offered
// at all, so they're omitted rather than left stating a stale window or fee.
function noReturnsPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  };
}

// Real /shipping page facts only: ships within 48 hours of Rx verification
// (handling 0-2 days), continental US transit 2-5 business days. No
// shippingRate — no page on the site discloses a shipping cost, and a
// fabricated $0 or estimate would be a false claim. Google's shipping
// rich-result badge wants a rate, so this is semantic value without the
// badge until a real cost policy is published.
function offerShippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
    },
  };
}

const RENTAL_CATEGORIES = new Set(["oxygen-rental", "cpap-rental"]);

// Purchase slug → its rental-variant slugs (inverse of RENTAL_PURCHASE_EQUIVALENT).
const PURCHASE_RENTAL_VARIANTS: Record<string, string[]> = {};
for (const [rentalSlug, purchaseSlug] of Object.entries(RENTAL_PURCHASE_EQUIVALENT)) {
  (PURCHASE_RENTAL_VARIANTS[purchaseSlug] ??= []).push(rentalSlug);
}

// isRelatedTo edges connecting rental and purchase listings of the same
// physical device — tells the knowledge graph these are offer variants of
// one entity, not competing near-duplicate products.
function relatedVariantEdges(p: Product) {
  const targetSlugs = RENTAL_PURCHASE_EQUIVALENT[p.slug]
    ? [RENTAL_PURCHASE_EQUIVALENT[p.slug]]
    : (PURCHASE_RENTAL_VARIANTS[p.slug] ?? []);
  const targets = targetSlugs
    .map((slug) => PRODUCTS.find((x) => x.slug === slug))
    .filter((x): x is Product => Boolean(x));
  if (targets.length === 0) return {};
  return {
    isRelatedTo: targets.map((t) => ({
      "@type": ["Product", "MedicalDevice"],
      "@id": `${SITE_URL}${productHref(t)}#product`,
      name: t.name,
      url: `${SITE_URL}${productHref(t)}`,
    })),
  };
}

export function productJsonLd(p: Product) {
  const url = `${SITE_URL}${productHref(p)}`;
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "MedicalDevice"],
    "@id": `${url}#product`,
    name: p.name,
    description: productDescription(p),
    brand: { "@type": "Brand", name: p.brand },
    // brand IS the maker for every SKU in this catalog, so manufacturer is a
    // real, non-fabricated field — it strengthens Product entity parsing.
    manufacturer: { "@type": "Organization", name: p.brand },
    category: CATEGORY_META[p.category].label,
    sku: p.slug,
    mpn: p.name,
    url,
    ...(p.image ? { image: [`${SITE_URL}${p.image}`] } : {}),
    ...(p.category.startsWith("oxygen")
      ? { relevantSpecialty: "https://schema.org/Pulmonology" }
      : {}),
    ...relatedVariantEdges(p),
    ...(p.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "USD",
            url,
            availability: "https://schema.org/InStock",
            validFrom: nowISO(),
            priceValidUntil: nextQuarterISO(),
            // The retailer of record — referenced by @id so this Offer's seller
            // resolves to the same Organization node as everywhere else.
            seller: orgRef,
            // Rentals are leases, not sales — GoodRelations businessFunction
            // is the standard way to say so, and UnitPriceSpecification marks
            // the price as per-week/per-month rather than a purchase price.
            ...(RENTAL_CATEGORIES.has(p.category)
              ? {
                  businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: p.price,
                    priceCurrency: "USD",
                    unitCode: p.slug.includes("weekly") ? "WEE" : "MON",
                  },
                }
              : {}),
            itemCondition:
              p.badge === "Refurbished"
                ? "https://schema.org/RefurbishedCondition"
                : "https://schema.org/NewCondition",
            shippingDetails: offerShippingDetails(),
            // Rentals are leases (see businessFunction above), not purchases —
            // a merchant return policy doesn't apply to a lease term, so it's
            // only attached to actual sale Offers.
            ...(RENTAL_CATEGORIES.has(p.category) ? {} : { hasMerchantReturnPolicy: noReturnsPolicy() }),
          },
        }
      : {}),
    ...(() => {
      // Compliance facts already stated as prose on the page (Rx requirement,
      // FAA approval), mirrored here as PropertyValue rows so a retrieval
      // system pulling the spec table gets these facts in the same
      // structured pass instead of needing a second parse over sentences.
      // Real boolean fields already on the product — never inferred.
      const complianceProps = [
        { "@type": "PropertyValue" as const, name: "Prescription Required", value: p.rxRequired ? "Yes" : "No" },
        ...(p.category.startsWith("oxygen")
          ? [{ "@type": "PropertyValue" as const, name: "FAA Approved for Air Travel", value: p.faaApproved ? "Yes" : "No" }]
          : []),
      ];
      const specProps = (p.specs ?? []).map(([name, value]) => ({ "@type": "PropertyValue" as const, name, value }));
      const all = [...specProps, ...complianceProps];
      return all.length > 0 ? { additionalProperty: all } : {};
    })(),
    // No aggregateRating: the only review data available at import time came
    // from a competitor's storefront, not real CIRRUS customer reviews.
    // Add this back once genuine on-page reviews exist to back it up.
  };
}

/** Fused entity graph for a product detail page: the Product node, its
 * FAQPage, and its BreadcrumbList in one @graph instead of parallel <script>
 * tags, so an extractor gets one document to read rather than reconciling
 * several. Crumbs come from the same array that drives the visible trail
 * (see components/ProductDetail.tsx) so the two can never drift apart. */
export function productGraphJsonLd(
  p: Product,
  faqs: [string, string][],
  crumbs: { name: string; url: string }[]
) {
  const product = productJsonLd(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      product,
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: `${SITE_URL}${c.url}`,
        })),
      },
    ],
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.url}`,
    })),
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "CIRRUS",
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: orgRef,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  // Deliberately not MedicalOrganization — CIRRUS is a retailer, not a
  // clinical provider. In YMYL content, an aspirational schema type is a
  // bigger risk than the entity-recognition upside is worth.
  name: "CIRRUS",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  image: `${SITE_URL}/opengraph-image`,
  description:
    "CIRRUS is a direct-to-consumer, self-pay retailer of oxygen concentrators, CPAP/BiPAP systems, and ventilators. No insurance, Medicaid, or Medicare — prescription verification required for Rx-gated devices.",
  slogan: "Precision oxygen and sleep systems, self-pay only.",
  // Real, live, active CIRRUS-operated profiles only — the entity-consolidation
  // signal breaks if this list includes an inactive or personal account. No
  // LinkedIn entry yet: only a personal-profile presence exists today, no
  // company page, so it isn't a real CIRRUS-operated channel to claim here.
  sameAs: [
    "https://www.instagram.com/cirrusoxygen/",
    "https://x.com/cirrusoxygen",
    "https://www.tiktok.com/@cirrusoxygen",
    "https://www.facebook.com/profile.php?id=61592110411330",
  ],
  // Entity/topical signals: the real subject domains this brand is an
  // authority on. Helps entity disambiguation and topical association —
  // every term here is genuinely covered by the catalog or journal.
  knowsAbout: [
    "Oxygen therapy",
    "Portable oxygen concentrators",
    "Sleep apnea",
    "CPAP therapy",
    "BiPAP therapy",
    "Respiratory equipment",
    "Mechanical ventilation",
  ],
  areaServed: { "@type": "Country", name: "United States" },
  // A structured directory of the top-level shopping categories. Not a
  // rich-result driver on its own, but it strengthens the entity's
  // understanding of what CIRRUS actually sells.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "CIRRUS Catalog",
    itemListElement: [
      "oxygen-portable",
      "oxygen-stationary",
      "sleep-cpap",
      "sleep-bipap",
      "respiratory-accessory",
      "ventilator",
    ].map((c) => ({
      "@type": "OfferCatalog",
      name: CATEGORY_META[c as keyof typeof CATEGORY_META].label,
      url: `${SITE_URL}${CATEGORY_META[c as keyof typeof CATEGORY_META].base}`,
    })),
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-877-699-4365",
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: "English",
  },
};

// Categories that are genuinely clinical/condition content — MedicalWebPage
// is added only here, not for lifestyle categories like Nutrition or Fitness
// that don't actually cover a medical condition or treatment.
const MEDICAL_CATEGORIES = new Set([
  "Oxygen & Respiratory",
  "Sleep Health",
  "Heart Health",
  "Cancer Screening & Prevention",
  "Caregiving & Chronic Illness",
]);

// Entity linking: each journal category maps to a well-established Wikipedia
// concept. Emitting `about` with a sameAs to the canonical entity is genuine
// semantic SEO — it tells Google exactly which real-world topic the article
// is about, rather than leaving it to infer from text. Every URL here is a
// real, stable Wikipedia article that matches the category, never a guess.
const CATEGORY_ENTITY: Record<string, { name: string; sameAs: string }> = {
  "Oxygen & Respiratory": { name: "Oxygen therapy", sameAs: "https://en.wikipedia.org/wiki/Oxygen_therapy" },
  "Sleep Health": { name: "Sleep", sameAs: "https://en.wikipedia.org/wiki/Sleep" },
  "Fitness & Exercise": { name: "Physical fitness", sameAs: "https://en.wikipedia.org/wiki/Physical_fitness" },
  Nutrition: { name: "Nutrition", sameAs: "https://en.wikipedia.org/wiki/Nutrition" },
  "Heart Health": { name: "Cardiovascular disease", sameAs: "https://en.wikipedia.org/wiki/Cardiovascular_disease" },
  "Weight Management": { name: "Weight management", sameAs: "https://en.wikipedia.org/wiki/Weight_management" },
  "Health Technology": { name: "Health technology", sameAs: "https://en.wikipedia.org/wiki/Health_technology" },
  "Cancer Screening & Prevention": { name: "Cancer screening", sameAs: "https://en.wikipedia.org/wiki/Cancer_screening" },
  Longevity: { name: "Longevity", sameAs: "https://en.wikipedia.org/wiki/Longevity" },
  "Caregiving & Chronic Illness": { name: "Chronic condition", sameAs: "https://en.wikipedia.org/wiki/Chronic_condition" },
  // Verified live earlier this session (same URL as the glossary term's sameAs).
  "Clinical & Institutional": { name: "Medical ventilator", sameAs: "https://en.wikipedia.org/wiki/Medical_ventilator" },
};

export function blogPostingJsonLd(article: {
  slug: string;
  title: string;
  dek: string;
  date: string;
  category: string;
  body?: string[];
  sources?: { label: string; url: string }[];
}) {
  const url = `${SITE_URL}/journal/${article.slug}`;
  const isMedical = MEDICAL_CATEGORIES.has(article.category);
  const entity = CATEGORY_ENTITY[article.category];
  // Real word count from the actual article body — never a made-up number.
  const wordCount = article.body
    ? article.body.join(" ").trim().split(/\s+/).filter(Boolean).length
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": isMedical ? ["BlogPosting", "MedicalWebPage"] : "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.dek,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    image: {
      "@type": "ImageObject",
      url: `${url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    // author + publisher both resolve to the one canonical Organization node.
    author: orgRef,
    publisher: orgRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.category,
    ...(wordCount ? { wordCount } : {}),
    // Entity the article is about — connects the page to a real-world topic.
    ...(entity
      ? { about: { "@type": "Thing", name: entity.name, sameAs: entity.sameAs } }
      : {}),
    // Real primary-source citations, surfaced to search engines as `citation`.
    // Only present on the articles that actually have verified sources.
    ...(article.sources && article.sources.length > 0
      ? {
          citation: article.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.label,
            url: s.url,
          })),
        }
      : {}),
    // YMYL E-E-A-T signals for genuinely clinical content: a review date and
    // reviewer. reviewedBy points to the Organization (the editorial team),
    // never a fabricated named clinician.
    ...(isMedical ? { lastReviewed: article.date, reviewedBy: orgRef } : {}),
    // Voice-search / assistant hint: the headline and standfirst are the
    // parts worth reading aloud.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-dek", ".article-takeaway"],
    },
  };
}

export function howToJsonLd(name: string, steps: { title: string; body: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.body,
    })),
  };
}

export function itemListJsonLd(items: { name: string; url: string; image?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${item.url}`,
      name: item.name,
    })),
  };
}

export function faqJsonLd(qa: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function nextQuarterISO() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split("T")[0];
}

// Build-time "as of" date for the offer — real generation timestamp, not a
// business-recorded price-change date we don't actually have on file.
function nowISO() {
  return new Date().toISOString().split("T")[0];
}
