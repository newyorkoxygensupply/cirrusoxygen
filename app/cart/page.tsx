import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  alternates: { canonical: "/cart" },
  title: "Cart",
  description: "Review your order before checkout.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CartClient />;
}
