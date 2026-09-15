import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="px-8 py-16">
      <div className="mx-auto mb-10 max-w-[600px] text-center">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Search</p>
        <h1 className="font-display mt-3 text-[clamp(24px,3.4vw,32px)] font-semibold">
          Search CIRRUS
        </h1>
      </div>
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
