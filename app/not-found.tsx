import Link from "next/link";
import { ScatteredWisps } from "@/components/Logo";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center px-8 py-32 text-center">
      <ScatteredWisps />
      <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">404</p>
      <h1 className="font-display mt-4 text-[clamp(26px,4vw,38px)] font-semibold">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-4 max-w-[44ch] text-[14px] text-muted">
        It may have moved, or the model was discontinued. Try one of the two places everything
        else lives.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/oxygen"
          className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
        >
          Oxygen Systems
        </Link>
        <Link
          href="/sleep"
          className="cursor-pointer rounded-[3px] border border-border-strong px-6 py-3 text-[13px] font-semibold"
        >
          Sleep Systems
        </Link>
      </div>
    </div>
  );
}
