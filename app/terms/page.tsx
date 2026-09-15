import type { Metadata } from "next";
import { EditorialHero, EditorialSection } from "@/components/EditorialPage";
import { TermsGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description: "The terms governing purchases made through CIRRUS.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<TermsGraphic />}
        eyebrow="Legal"
        title="Terms of Service"
        intro="Last updated July 10, 2026. By placing an order through this website, you agree to the terms below."
      />

      <EditorialSection heading="Self-pay, no insurance billing">
        <p>
          Currently we don&rsquo;t accept Insurance, Medicaid, or Medicare. All purchases are
          self-pay. Payment is completed directly with a concierge specialist by phone — this
          website does not process payment card transactions.
        </p>
      </EditorialSection>

      <EditorialSection heading="Prescription requirement">
        <p>
          Oxygen concentrators and CPAP/BiPAP devices are Class II medical devices under FDA
          regulation. A valid prescription matching the device class ordered is required before any
          such item ships, regardless of payment method. Orders that fail prescription verification
          will not be fulfilled and will be refunded in full.
        </p>
      </EditorialSection>

      <EditorialSection heading="Pricing">
        <p>
          Prices shown are in USD and reflect the total device price; shipping is calculated and
          confirmed by your concierge specialist prior to payment. We reserve the right to correct
          pricing errors before an order is finalized.
        </p>
      </EditorialSection>

      <EditorialSection heading="Returns & warranty">
        <p>
          All sales are final — we don&rsquo;t accept returns or exchanges on any order. See our{" "}
          <a href="/returns" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
            Returns
          </a>{" "}
          page for details. Manufacturer warranties apply as stated on each product page and are
          registered under CIRRUS as the authorized seller.
        </p>
      </EditorialSection>

      <EditorialSection heading="Limitation of liability">
        <p>
          CIRRUS is a retailer of manufacturer-warrantied medical devices, not a healthcare
          provider. Nothing on this site constitutes medical advice; device settings and usage
          should be directed by your prescribing physician.
        </p>
      </EditorialSection>

      <EditorialSection heading="Contact">
        <p>Questions about these terms: info@cirrusoxygen.com</p>
      </EditorialSection>
    </div>
  );
}
