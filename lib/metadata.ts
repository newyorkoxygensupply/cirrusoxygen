import type { Metadata } from "next";
import { formatPrice, productHref, type Product } from "./products";

export function productTitle(p: Product): string {
  const price = p.price !== null ? ` — ${formatPrice(p.price)}` : "";
  const badge = p.badge === "Refurbished" ? " (Refurbished)" : "";
  return `${p.name}${badge}${price}`;
}

export function productDescription(p: Product): string {
  const faa = p.faaApproved ? "FAA-approved for air travel. " : "";
  const ship = "Ships in 48 hours. ";
  const cash = "Cash-pay pricing — no insurance, Medicaid, or Medicare, no authorization wait.";
  const price = p.price !== null ? `${formatPrice(p.price)}. ` : "Call for pricing. ";
  return `${p.name} from ${p.brand}. ${faa}${price}${ship}${cash}`.slice(0, 158);
}

// One source of truth for every product [slug] page's <head>: title,
// description, self-canonical, and OpenGraph/Twitter cards. Centralizing this
// means all 9 product routes get identical, complete social metadata — and a
// real product image on the card whenever one exists (never a placeholder).
export function productMetadata(p: Product): Metadata {
  const url = productHref(p);
  const title = productTitle(p);
  const description = productDescription(p);
  const images = p.image ? [{ url: p.image, alt: `${p.name} — ${p.brand}` }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
