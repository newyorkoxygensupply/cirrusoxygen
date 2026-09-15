import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "@/components/EditorialPage";
import { AccountGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/account" },
  title: "Account",
  description: "Order history, prescriptions on file, and supply subscriptions.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<AccountGraphic />}
        eyebrow="Account"
        title="Accounts are opened by your concierge specialist."
        intro="Because every order runs through prescription verification and a phone-based checkout, your account and order history are set up by your specialist rather than a self-serve sign-up form."
      />
      <section className="px-8 py-16 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center gap-3">
          <Link
            href="/concierge"
            className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
          >
            Talk to Concierge
          </Link>
          <p className="text-[13px] text-muted">
            Already a customer? Your specialist&rsquo;s direct line is on your order confirmation
            email.
          </p>
        </div>
      </section>
    </div>
  );
}
