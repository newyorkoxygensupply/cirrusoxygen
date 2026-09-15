import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";
import { formatPrice, productHref, getProduct } from "@/lib/products";

export const metadata: Metadata = {
  alternates: { canonical: "/oxygen" },
  title: "Portable & Stationary Oxygen Concentrators",
  description:
    "Portable and stationary oxygen concentrators from Inogen, Caire, ResMed, and more. FAA travel-approved, self-pay only.",
};

const rove6 = getProduct("oxygen-portable", "inogen-rove-6")!;
const freestyle = getProduct("oxygen-portable", "caire-freestyle-comfort")!;
const companion5 = getProduct("oxygen-stationary", "caire-companion-5")!;

export default function OxygenPage() {
  return (
    <CategoryHub
      crumbs={[
        { name: "Home", url: "/" },
        { name: "Oxygen", url: "/oxygen" },
      ]}
      pillar={{ label: "New to concentrators? Read the complete guide", href: "/oxygen/guide" }}
      eyebrow="Oxygen Therapy"
      title="Concentrators built for people who notice engineering."
      intro="Authorized inventory from Inogen, Caire, ResMed, OxyGo, Invacare, and Drive DeVilbiss — cleared for in-flight use, quiet enough for a boardroom."
      subLinks={[
        { label: "Portable Concentrators", href: "/oxygen/portable", desc: "Battery-powered, FAA-approved." },
        { label: "Stationary Concentrators", href: "/oxygen/stationary", desc: "Continuous, higher-flow home-base units." },
        { label: "Tanks & Cylinders", href: "/oxygen/tanks", desc: "Backup and supplemental oxygen supply." },
      ]}
      products={[
        { name: rove6.name, spec: "FAA Approved", price: "Call for Pricing", href: productHref(rove6) },
        { name: freestyle.name, spec: "FAA Approved", price: formatPrice(freestyle.price!), href: productHref(freestyle) },
        { name: companion5.name, spec: companion5.spec ?? "", price: formatPrice(companion5.price!), href: productHref(companion5) },
      ]}
    />
  );
}
