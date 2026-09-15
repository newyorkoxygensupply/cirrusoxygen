import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  alternates: { canonical: "/checkout" },
  title: "Checkout",
  description: "Prescription is verified here before any Rx-gated item can ship.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CheckoutClient />;
}
