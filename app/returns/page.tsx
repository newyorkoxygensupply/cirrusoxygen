import type { Metadata } from "next";
import { EditorialHero, EditorialSection } from "@/components/EditorialPage";
import { ReturnGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/returns" },
  title: "Returns",
  description: "All sales are final. No returns, no exchanges.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<ReturnGraphic />}
        eyebrow="Support"
        title="Returns"
        intro="All sales are final. No returns, no exchanges."
      />

      <EditorialSection heading="Why we do it this way">
        <p>
          Because there are no returns, we build the verification in before your order ships, not
          after. Your concierge specialist confirms device model, mask fit, and prescription
          details with you directly, by phone, so what arrives is already the right unit — not
          something you have to hope fits.
        </p>
      </EditorialSection>

      <EditorialSection heading="Policy">
        <p>
          All sales are final. We do not accept returns or exchanges on any order, including
          devices, masks, and accessories.
        </p>
      </EditorialSection>

      <EditorialSection heading="Defective units">
        <p>
          If a device arrives defective or fails within its manufacturer warranty window, contact
          your concierge specialist directly — manufacturer warranty coverage applies as stated on
          each product page, separately from this no-return, no-exchange sales policy.
        </p>
      </EditorialSection>

      <EditorialSection heading="Questions before you order">
        <p>
          Because all sales are final, please confirm device model, mask size, and prescription
          details with your concierge specialist before completing your order.
        </p>
      </EditorialSection>
    </div>
  );
}
