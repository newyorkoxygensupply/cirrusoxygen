import type { Metadata } from "next";
import { EditorialHero, EditorialSection } from "@/components/EditorialPage";
import { PrivacyGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How CIRRUS collects, uses, and protects your personal and health information.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<PrivacyGraphic />}
        eyebrow="Legal"
        title="Privacy Policy"
        intro="Last updated July 12, 2026. This page describes what we collect, why, and how prescription and health information specifically is handled."
      />

      <EditorialSection heading="What we collect">
        <p>
          Contact details (name, email, phone, shipping address) submitted at checkout or through
          the concierge form; order history; and prescription documentation submitted for
          verification. We do not collect payment card information through this website — payment
          is completed by phone with a concierge specialist.
        </p>
      </EditorialSection>

      <EditorialSection heading="Browser storage & tracking">
        <p>
          Your shopping cart is stored directly in your browser (localStorage), not on our
          servers — it stays on your device until you clear it or complete checkout. We don't use
          third-party analytics, advertising, or tracking scripts on this site, and we don't set
          tracking cookies.
        </p>
      </EditorialSection>

      <EditorialSection heading="Prescription & health information">
        <p>
          Prescription documents are used solely to verify eligibility for the device ordered and
          to comply with FDA requirements for Class II medical devices. This information is not
          sold, and is not shared with insurers, employers, or any party outside the clinical
          verification process, since we do not bill insurance in the first place.
        </p>
      </EditorialSection>

      <EditorialSection heading="How information is used">
        <ul className="flex flex-col gap-3">
          {[
            "Processing and shipping your order.",
            "Verifying prescription eligibility as required by law.",
            "Warranty registration with the device manufacturer.",
            "Concierge follow-up related to your order.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection heading="Your rights">
        <p>
          You may request a copy of the information we hold on your account, or request deletion of
          non-order-related records, by contacting your concierge specialist. Order and prescription
          records tied to a shipped medical device are retained per FDA recordkeeping requirements
          regardless of deletion requests.
        </p>
      </EditorialSection>

      <EditorialSection heading="Contact">
        <p>Questions about this policy: info@cirrusoxygen.com</p>
      </EditorialSection>
    </div>
  );
}
