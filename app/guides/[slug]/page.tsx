import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide, resolveGuideProducts } from "@/lib/guides";
import { formatPrice, productAltText, productHref } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { AutoLinkedBody } from "@/components/AutoLinkedBody";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
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
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.dek,
    alternates: { canonical: `/guides/${g.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return notFound();
  const products = resolveGuideProducts(guide);
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Buying Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ]);
  // The guide's ranked product picks, exposed as an ItemList so the recommended
  // set is machine-readable — only the products that actually resolve to a real
  // catalog SKU are included.
  const listLd = itemListJsonLd(
    products
      .filter((x) => x.product)
      .map((x) => ({ name: x.product!.name, url: productHref(x.product!) }))
  );

  return (
    <div className="px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      {products.some((x) => x.product) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      )}
      <div className="mx-auto max-w-[760px]">
        <Link href="/guides" className="cursor-pointer text-[12px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          ← Buying Guides
        </Link>
        <h1 className="font-display mt-5 text-[clamp(26px,3.6vw,38px)] font-semibold text-balance">
          {guide.title}
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">{guide.dek}</p>
        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 text-[15px] leading-[1.75] text-muted">
          <AutoLinkedBody paragraphs={guide.intro} />
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {products.map(({ product, note }) =>
            product ? (
              <Link
                key={product.slug}
                href={productHref(product)}
                className="group flex cursor-pointer items-center gap-5 rounded-[3px] border border-border p-5 transition-colors hover:bg-surface-2"
              >
                <ProductThumb image={product.image} name={product.name} alt={productAltText(product)} className="h-16 w-16 shrink-0" sizes="64px" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{product.brand}</p>
                  <h2 className="text-[15px] font-semibold">{product.name}</h2>
                  <p className="mt-1 text-[13px] text-muted">{note}</p>
                </div>
                <p className="shrink-0 font-mono text-[15px] tabular-nums">
                  {product.price === null ? "Call for Pricing" : formatPrice(product.price)}
                </p>
              </Link>
            ) : null
          )}
        </div>

        <p className="mt-10 border-t border-border pt-6 text-[14px] leading-relaxed text-muted">
          {guide.closing}
        </p>
      </div>
    </div>
  );
}
