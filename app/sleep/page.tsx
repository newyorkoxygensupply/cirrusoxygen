import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";
import { formatPrice, productHref, getProduct } from "@/lib/products";

export const metadata: Metadata = {
  alternates: { canonical: "/sleep" },
  title: "CPAP & BiPAP Machines for Sleep Apnea",
  description:
    "CPAP, BiPAP, and travel systems from ResMed, Philips, and Fisher & Paykel. Self-pay only.",
};

const airsense11 = getProduct("sleep-cpap", "resmed-airsense-11-autoset")!;
const aircurve10 = getProduct("sleep-bipap", "resmed-aircurve-10-vauto")!;
const airfitF30 = getProduct("sleep-mask", "resmed-airfit-f30")!;

export default function SleepPage() {
  return (
    <CategoryHub
      crumbs={[
        { name: "Home", url: "/" },
        { name: "Sleep", url: "/sleep" },
      ]}
      pillar={{ label: "New to CPAP? Read the complete guide", href: "/sleep/guide" }}
      eyebrow="Sleep Apnea"
      title="The machine adjusts to you, not the other way round."
      intro="Auto-titrating pressure and mask systems fitted rather than guessed at, from ResMed, Philips Respironics, and Fisher & Paykel."
      subLinks={[
        { label: "CPAP Machines", href: "/sleep/cpap", desc: "Standard and travel CPAP." },
        { label: "BiPAP & VPAP", href: "/sleep/bipap-apap", desc: "Bi-level and auto-titrating systems." },
        { label: "Masks & Cleaners", href: "/sleep/accessories", desc: "Full face, nasal, and nasal pillow masks." },
      ]}
      products={[
        { name: airsense11.name, spec: airsense11.spec ?? "", price: formatPrice(airsense11.price!), href: productHref(airsense11) },
        { name: aircurve10.name, spec: aircurve10.spec ?? "", price: formatPrice(aircurve10.price!), href: productHref(aircurve10) },
        { name: airfitF30.name, spec: airfitF30.spec ?? "", price: formatPrice(airfitF30.price!), href: productHref(airfitF30) },
      ]}
    />
  );
}
