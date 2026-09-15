import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { BiPAPDualPressureShowcase } from "@/components/BiPAPDualPressureShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/sleep/bipap-apap" },
  title: "BiPAP & APAP Machines for Sleep Apnea",
  description: "Bi-level and auto-titrating systems for more complex breathing patterns.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Sleep"
      title="BiPAP & APAP Systems"
      intro="Bi-level and auto-titrating systems for prescriptions standard CPAP therapy can't cover."
      base="/sleep/bipap-apap"
      science={[
        {
          eyebrow: "Two pressures, not one",
          heading: "Easier out than in.",
          imageSide: "right",
          visual: <BiPAPDualPressureShowcase />,
          body: (
            <>
              <p>
                A CPAP holds one constant pressure through the whole breath. BiPAP steps between
                two — a higher IPAP to keep the airway open on the inhale, a lower EPAP that eases
                off the moment you exhale, which is what makes it tolerable for prescriptions a
                single fixed pressure can&rsquo;t cover comfortably.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                How to tell which machine class you actually need, in{" "}
                <Link href="/journal/cpap-vs-bipap-vs-apap-which-machine" className="text-accent underline underline-offset-2 hover:no-underline">
                  CPAP vs. BiPAP vs. APAP
                </Link>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
