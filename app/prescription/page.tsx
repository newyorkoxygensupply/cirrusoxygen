import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, EditorialSection } from "@/components/EditorialPage";
import { VerifyGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/prescription" },
  title: "Prescription Verification",
  description: "Upload an existing prescription or connect us with your physician. Required by law for every device we sell — typically verified in under two minutes.",
};

const STEPS: [string, string][] = [
  ["Add items to cart", "Select the oxygen or sleep system your physician has prescribed."],
  ["Upload or e-verify", "At checkout, upload a photo or PDF of your prescription — or skip and let us contact your physician's office directly."],
  ["We verify", "Our clinical team confirms the prescription matches the device class and flow/pressure setting ordered, typically within two hours during business hours."],
  ["Order ships", "Once verified, your concierge specialist calls to finalize payment and your order ships within 48 hours."],
];

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<VerifyGraphic />}
        eyebrow="Compliance"
        title="Prescription verification, without the runaround."
        intro="Oxygen concentrators and CPAP/BiPAP devices are Class II medical devices under FDA regulation — a valid prescription is required by law, regardless of how you pay. Here's exactly how we handle it."
      />

      <EditorialSection heading="How it works">
        <ol className="flex flex-col gap-6">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="flex gap-4">
              <span className="font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold text-text">{title}</p>
                <p className="mt-1">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </EditorialSection>

      <EditorialSection heading="Don't have a prescription yet?">
        <p>
          If you don&rsquo;t yet have a prescription on file, our concierge team can connect you
          with a telehealth physician for an evaluation. This is a separate clinical service — we
          never write or approve prescriptions ourselves.
        </p>
        <Link href="/concierge" className="mt-2 w-fit cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          Talk to Concierge →
        </Link>
      </EditorialSection>

      <EditorialSection heading="What we don't require">
        <ul className="flex flex-col gap-3">
          {[
            "No insurance authorization — we don't bill insurance, Medicaid, or Medicare.",
            "No in-person fitting appointment for standard prescriptions.",
            "No separate account setup to begin the verification process.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </EditorialSection>
    </div>
  );
}
