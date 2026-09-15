import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByBase, productsByBase } from "@/lib/products";
import { productMetadata } from "@/lib/metadata";
import { ProductDetail } from "@/components/ProductDetail";

const BASE = "/sleep/bipap-apap";

export function generateStaticParams() {
  return productsByBase(BASE).map((p) => ({ slug: p.slug }));
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
  const product = getProductByBase(BASE, slug);
  if (!product) return {};
  return productMetadata(product);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductByBase(BASE, slug);
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
