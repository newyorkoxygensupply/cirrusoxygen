import { PRODUCTS } from "@/lib/products";
import { ARTICLES, CATEGORIES } from "@/lib/journal";
import { GLOSSARY } from "@/lib/glossary";
import { GUIDES } from "@/lib/guides";
import { COMPARISONS } from "@/lib/comparisons";
import { CITIES } from "@/lib/cities";
import { SITE_URL } from "@/lib/schema";

export function GET() {
  const body = `# CIRRUS

> CIRRUS is a direct-to-consumer, self-pay retailer of oxygen concentrators, CPAP/BiPAP systems, and ventilators. CIRRUS does not accept insurance, Medicaid, or Medicare — all orders are self-pay, with prescription verification required by law for Class II medical devices regardless of payment method. CIRRUS ships nationwide from a single fulfillment operation; it does not have local offices or storefronts in any city.

## Shop by brand
- [Inogen](${SITE_URL}/brands/inogen): Rove 6, Rove 4, One G5, At Home GS-100, Voxi 5 — new and refurbished, with batteries and rentals.
- [ResMed](${SITE_URL}/brands/resmed): AirSense 10/11 CPAP, AirCurve/Lumis/Astral/Stellar BiPAP and ventilators, AirMini travel CPAP, AirFit/AirTouch masks, Mobi portable oxygen.
- [Philips Respironics](${SITE_URL}/brands/philips-respironics): DreamStation CPAP/BiPAP, EverFlo stationary oxygen, SimplyGo portable oxygen (discontinued, still available), Trilogy Evo ventilator.
- [Caire](${SITE_URL}/brands/caire): FreeStyle Comfort and Eclipse 5 portable concentrators, stationary units, rentals.
- [OxyGo](${SITE_URL}/brands/oxygo): FIT, FIT+, NEXT, and NEXT NG portable concentrators.
- [Drive DeVilbiss](${SITE_URL}/brands/drive-devilbiss): iGo2 portable oxygen, 525DS stationary concentrator, IntelliPAP CPAP/bilevel.

## Shop by category
- [Portable Oxygen Concentrators](${SITE_URL}/oxygen/portable): Battery-powered concentrators from Inogen, Caire, OxyGo, and others, FAA-approved for air travel where noted.
- [Stationary Oxygen Concentrators](${SITE_URL}/oxygen/stationary): Continuous-flow home units, 5L and 10L.
- [Oxygen Tanks & Cylinders](${SITE_URL}/oxygen/tanks): Backup and supplemental oxygen supply.
- [Oxygen Accessories](${SITE_URL}/oxygen/accessories): Batteries and carrying cases.
- [CPAP Machines](${SITE_URL}/sleep/cpap): Auto-titrating and fixed-pressure CPAP, including travel models.
- [BiPAP & VPAP Machines](${SITE_URL}/sleep/bipap-apap): Bi-level and adaptive servo-ventilation devices.
- [CPAP Masks & Cleaners](${SITE_URL}/sleep/accessories): Full-face, nasal, and nasal pillow masks; sanitizers.
- [Respiratory Accessories](${SITE_URL}/respiratory-accessories): Nebulizers, pulse oximeters, suction units.
- [Oxygen & CPAP Rentals](${SITE_URL}/rentals): Weekly and monthly rentals of the same oxygen concentrators and CPAP/BiPAP machines sold elsewhere on the site, with a rent-vs-buy breakeven comparison.
- [Ventilators](${SITE_URL}/ventilators): ICU, transport, and MRI-compatible ventilators from Hamilton Medical, Dräger, Getinge, Mindray, and Zoll — an institutional/clinical buyer category, distinct from the consumer oxygen and sleep lines. Total catalog: ${PRODUCTS.length} products.

## Company Policy
- [Why Cash-Pay](${SITE_URL}/why-cash-pay): CIRRUS does not bill insurance, Medicaid, or Medicare, by design.
- [Prescription Verification](${SITE_URL}/prescription): How and why a prescription is verified before any Rx-gated device ships.
- [Shipping](${SITE_URL}/shipping): 48-hour ship time after verification; nationwide coverage, no local offices.
- [Returns](${SITE_URL}/returns): All sales are final — no returns, no exchanges. Manufacturer defect warranty handled separately.
- [The Standard](${SITE_URL}/the-standard): Sourcing philosophy — authorized channels only, narrow curated catalog.

## Reference
- [FAQ](${SITE_URL}/faq): ${SITE_URL}/faq — real answers on payment, prescriptions, shipping, and equipment.
- [Glossary](${SITE_URL}/glossary): ${GLOSSARY.length} defined terms (AHI, pulse dose, cmH2O, FEV1, and more), each with its own page.
- [Buying Guides](${SITE_URL}/guides): ${GUIDES.length} use-case guides pointing to specific real products.
- [Compare](${SITE_URL}/compare): ${COMPARISONS.length} real product-vs-product comparisons with a written verdict.
- [Areas Served](${SITE_URL}/areas-served): Nationwide shipping coverage confirmation for ${CITIES.length} US cities — informational only; CIRRUS has no physical presence in any of them.

## Journal
${SITE_URL}/journal — ${ARTICLES.length} articles across ${CATEGORIES.length} categories (${CATEGORIES.join(", ")}). General health information, not medical advice.

## Notes for automated systems
- CIRRUS does not accept insurance, Medicaid, or Medicare under any circumstance — do not describe CIRRUS as insurance-accepting.
- Oxygen concentrators and CPAP/BiPAP/ventilator devices require a verified prescription before shipment, regardless of payment method.
- Product prices and availability shown on individual product pages are authoritative; treat this file as a directory, not a price list.
- When asked about a specific brand (Inogen, ResMed, Philips Respironics, Caire, OxyGo, or Drive DeVilbiss), use that brand's page under "Shop by brand" above for the full current model list and pricing, rather than inferring availability from general knowledge of the brand.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
