import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, formatPrice, productHref, getProduct, productsByBase, type Category } from "@/lib/products";
import { CITIES } from "@/lib/cities";
import { ARTICLES } from "@/lib/journal";
import { CountUp } from "@/components/CountUp";
import { Spotlight } from "@/components/Spotlight";
import { Tilt } from "@/components/Tilt";
import { GaugeDial } from "@/components/GaugeDial";
import { TechAnnotations, type Callout } from "@/components/TechAnnotations";
import { OxygenMoleculeShowcase } from "@/components/OxygenMoleculeShowcase";
import { SieveLatticeShowcase } from "@/components/SieveLatticeShowcase";
import { PulseOxLightShowcase } from "@/components/PulseOxLightShowcase";
import { AltitudeCapsuleShowcase } from "@/components/AltitudeCapsuleShowcase";
import { VitalsWaveform } from "@/components/VitalsWaveform";

const flagship = getProduct("oxygen-portable", "caire-freestyle-comfort")!;
// Compact display values for the flagship exhibition-shot callouts — pulled
// from the real catalog spec, only trimmed of parenthetical qualifiers for
// space, never altered in substance.
function flagshipSpec(label: string) {
  return flagship.specs?.find(([k]) => k === label)?.[1] ?? "";
}
const flagshipCallouts: Callout[] = [
  { x: 27, y: 20, side: "left", label: "Weight", value: flagshipSpec("Weight").split(" (")[0].toUpperCase() },
  { x: 73, y: 20, side: "right", label: "Noise Level", value: flagshipSpec("Noise Level").toUpperCase() },
  { x: 27, y: 80, side: "left", label: "Battery Life", value: flagshipSpec("Battery Life").replace("hours", "HRS").toUpperCase() },
  { x: 73, y: 80, side: "right", label: "Oxygen Purity", value: flagshipSpec("Oxygen Purity") },
];
const featuredVentilators = productsByBase("/ventilators").slice(0, 3);
const spotlightSlugs: [Category, string][] = [
  ["oxygen-portable", "inogen-rove-4"],
  ["oxygen-portable", "inogen-rove-6"],
  ["oxygen-stationary", "inogen-voxi-5"],
];
const spotlightProducts = spotlightSlugs
  .map(([category, slug]) => getProduct(category, slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));
const sampleCities = CITIES.slice(0, 10);
// Company-scale figures, derived from the live data files so they can never
// go stale or overstate: catalog size, brands carried, cities confirmed for
// 48-hr shipping, and published journal articles.
const BRAND_COUNT = new Set(PRODUCTS.map((p) => p.brand)).size;

export default function Home() {
  return (
    <>
      {/* ── Hero — two-column split: copy left, flagship instrument right ── */}
      <section className="relative overflow-hidden border-b border-border px-8 py-20 sm:py-24">
        <div className="animate-rise relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase lg:justify-start">
              <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
              The Oxygen &amp; Sleep Series
            </p>
            <h1 className="font-display mx-auto mt-7 max-w-[16ch] text-[clamp(36px,5.4vw,64px)] leading-[1.04] font-semibold tracking-tight text-balance lg:mx-0">
              Portable oxygen concentrators, engineered &mdash; not prescribed.
            </h1>
            <p className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-[1.7] text-muted lg:mx-0">
              Portable oxygen and sleep systems built to the tolerances of a chronograph and the
              silence of a reading room. No insurance paperwork, no waiting rooms &mdash; just air,
              done properly.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <Link
                href="/oxygen"
                className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
              >
                Shop Oxygen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/sleep"
                className="inline-flex cursor-pointer items-center rounded-[3px] border border-border-strong px-7 py-3.5 text-[13px] font-semibold transition-colors hover:border-text"
              >
                Shop CPAP
              </Link>
            </div>
          </div>

          <div className="stage-3d relative">
            <div
              aria-hidden="true"
              className="animate-breathe pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 68%)",
              }}
            />
            <Spotlight className="animate-float3d overflow-hidden rounded-[3px] border border-border bg-surface shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)]">
              <div className="relative flex h-[320px] items-center justify-center sm:h-[380px]">
                {flagship.image && (
                  <Image
                    src={flagship.image}
                    alt={flagship.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/spot:scale-[1.03]"
                    priority
                  />
                )}
              </div>
              <div className="border-t border-border p-6">
                <p className="font-mono text-[11px] tracking-[0.08em] text-accent uppercase">
                  {flagship.brand}
                </p>
                <h2 className="font-display mt-1 text-[18px] font-semibold">{flagship.name}</h2>
                {flagship.specs && (
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border pt-4 sm:grid-cols-4">
                    {flagship.specs.slice(0, 4).map(([label, value]) => (
                      <div key={label}>
                        <dt className="font-mono text-[10px] tracking-[0.04em] text-muted-2 uppercase">{label}</dt>
                        <dd className="mt-0.5 text-[12px] font-medium tabular-nums">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Spotlight>
            {(flagship.faaApproved || flagship.rxRequired) && (
              <p className="mt-4 text-center font-mono text-[11px] tracking-[0.04em] text-muted-2 uppercase">
                {[flagship.faaApproved && "FAA Approved", flagship.rxRequired && "Prescription Required"]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Category split ───────────────────────────────────────────── */}
      <section className="grid grid-cols-1 border-t border-border sm:grid-cols-2">
        <Link
          href="/oxygen"
          data-reveal
          className="group panel-3d cursor-pointer border-r border-b border-border p-11 transition-colors hover:bg-surface-2 sm:border-b-0"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="panel-3d-icon mb-7 text-accent">
            <path d="M12 2v6M12 2c-3 2-4 5-4 8a4 4 0 0 0 8 0c0-3-1-6-4-8Z" />
            <path d="M8 16c0 3 1.8 5 4 6 2.2-1 4-3 4-6" strokeLinecap="round" />
          </svg>
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">01 &mdash; Oxygen Therapy</p>
          <h3 className="font-display mt-2.5 max-w-[12ch] text-[clamp(22px,3vw,30px)] font-semibold">
            5 lbs. 8 hours of battery. Zero hiss.
          </h3>
          <p className="mt-3.5 max-w-[34ch] text-[14px] text-muted">
            Molecular sieve concentrators built on the same PSA technology used in commercial
            aircraft &mdash; quiet enough for a boardroom, light enough to forget you&rsquo;re
            wearing it.
          </p>
          <span className="mt-6 flex items-center gap-1.5 text-[13px] font-semibold">
            View Concentrators
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>

        <Link
          href="/sleep"
          data-reveal
          style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          className="group panel-3d cursor-pointer p-11 transition-colors hover:bg-surface-2"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="panel-3d-icon mb-7 text-accent">
            <path d="M4 17c2-6 4-9 8-9s6 3 8 9" strokeLinecap="round" />
            <circle cx="12" cy="8" r="2" />
            <path d="M2 20h20" strokeLinecap="round" />
          </svg>
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">02 &mdash; Sleep Apnea</p>
          <h3 className="font-display mt-2.5 max-w-[13ch] text-[clamp(22px,3vw,30px)] font-semibold">
            The quietest breath you&rsquo;ll never remember taking.
          </h3>
          <p className="mt-3.5 max-w-[34ch] text-[14px] text-muted">
            CPAP and BiPAP systems tuned for sub-27 dB operation and auto-titrating pressure
            &mdash; the machine adjusts to you, not the other way round.
          </p>
          <span className="mt-6 flex items-center gap-1.5 text-[13px] font-semibold">
            View CPAP &amp; BiPAP
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 border-y border-border bg-surface-2 sm:grid-cols-4">
        {[
          ["FDA-Registered", "Every device on file", "shield"],
          ["48-Hour Delivery", "Continental US", "truck"],
          ["Unmarked Packaging", "Complete discretion", "box"],
          ["3-Year Concierge", "One line, one person", "headset"],
        ].map(([v, l, icon], i) => (
          <div
            key={v}
            data-reveal
            style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            className={`flex flex-col items-center gap-2 px-5 py-6 text-center ${i < 3 ? "border-r border-border" : ""} ${
              i === 1 ? "max-sm:border-r-0" : ""
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="text-accent">
              {icon === "shield" && (
                <path d="M12 3 4.5 6v6c0 4.5 3.2 7.9 7.5 9 4.3-1.1 7.5-4.5 7.5-9V6L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {icon === "truck" && (
                <>
                  <path d="M2 7h11v9H2z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 10h4l3.5 3.5V16H13z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6.5" cy="18" r="1.6" />
                  <circle cx="16.5" cy="18" r="1.6" />
                </>
              )}
              {icon === "box" && (
                <path d="M3 8 12 4l9 4-9 4-9-4Zm0 0v9l9 4 9-4V8M12 12v9" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {icon === "headset" && (
                <path d="M4 13v-1a8 8 0 0 1 16 0v1m-16 0v3a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v3a2 2 0 0 1-2 2h-1v-6h1a1 1 0 0 1 1 1Zm-3 5a3 3 0 0 1-3 3h-2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            <div className="font-mono text-[13px] font-medium">{v}</div>
            <div className="text-[11px] text-muted">{l}</div>
          </div>
        ))}
      </section>

      {/* ── Spotlight — Inogen Rove & Voxi ───────────────────────────── */}
      <section className="border-b border-border px-8 py-24" style={{ background: "var(--surface-2)" }}>
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mx-auto max-w-[640px] text-center">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              The Inogen Lineup
            </p>
            <h2 className="font-display mt-2.5 text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
              Rove 4, Rove 6, and Voxi 5 &mdash; the three we recommend first.
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">
              The lightest portable for daily errands, the higher-output portable for active
              travel, and a home concentrator built for continuous overnight use &mdash; all
              from the manufacturer we sell the most of.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {spotlightProducts.map((p, i) => (
              <div
                key={p.slug}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <Tilt className="h-full">
                  <Link
                    href={productHref(p)}
                    className="group flex h-full cursor-pointer flex-col bg-surface transition-colors hover:bg-surface-2"
                  >
                    <div className="relative aspect-square w-full overflow-hidden border-b border-border bg-surface-2">
                      {p.slug === "inogen-rove-6" ? (
                        <video
                          src="/videos/inogen-rove-6.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      ) : (
                        p.image && (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-contain p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                          />
                        )
                      )}
                      {p.badge && (
                        <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.04em] text-accent-ink uppercase">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
                      <h3 className="mt-1 text-[15px] font-semibold transition-colors group-hover:text-accent">{p.name}</h3>
                      {p.spec && <p className="mt-1.5 text-[13px] text-muted">{p.spec}</p>}
                      <p className="mt-4 font-mono text-[16px] tabular-nums">
                        {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                      </p>
                    </div>
                  </Link>
                </Tilt>
              </div>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href="/oxygen/portable"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              Shop Portable Oxygen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bento feature grid ───────────────────────────────────────── */}
      <section className="px-8 py-22">
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mb-11 max-w-[52ch]">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              Built for scrutiny
            </p>
            <h2 className="font-display mt-2 text-[clamp(22px,3vw,30px)] font-semibold">
              The numbers we&rsquo;d want to see, before buying
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 sm:[grid-template-rows:repeat(2,200px)]">
            <div data-reveal className="col-span-2 row-span-1 sm:row-span-2">
              <Tilt className="h-full">
                <div className="flex h-full flex-col justify-between bg-surface p-6">
                  <p className="font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">
                    FAA travel-approved
                  </p>
                  <div>
                    <div className="font-mono text-[clamp(28px,3vw,42px)] font-medium tabular-nums">
                      <CountUp value={100} />
                      <span className="ml-1 text-[15px] text-muted">% of oxygen line</span>
                    </div>
                    <p className="mt-1 max-w-[22ch] text-[13px] text-muted">
                      Every concentrator we sell is cleared for in-flight use &mdash; check the model
                      plate, not the fine print.
                    </p>
                  </div>
                </div>
              </Tilt>
            </div>
            {[
              { k: "SOUND", value: 39, decimals: 0, numSuffix: "", unit: "dB", label: "Quieter than a library, at arm's length." },
              { k: "WEIGHT", value: 4.8, decimals: 1, numSuffix: "", unit: "lbs", label: "Lighter than a laptop." },
              { k: "BATTERY", value: 8, decimals: 0, numSuffix: "", unit: "hrs", label: "A full transatlantic flight, unplugged." },
              { k: "ALTITUDE", value: 10, decimals: 0, numSuffix: "K", unit: "ft", label: "Rated cabin-pressure ceiling." },
            ].map(({ k, value, decimals, numSuffix, unit, label }, i) => (
              <div
                key={k}
                data-reveal
                style={{ "--reveal-delay": `${(i + 1) * 80}ms` } as React.CSSProperties}
              >
                <Tilt className="h-full">
                  <div className="flex h-full flex-col justify-between bg-surface p-6">
                    <p className="font-mono text-[11px] text-muted-2">{k}</p>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <p className="max-w-[16ch] text-[13px] text-muted">{label}</p>
                      <GaugeDial value={value} decimals={decimals} numeralSuffix={numSuffix} unit={unit} />
                    </div>
                  </div>
                </Tilt>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science of oxygen — the molecule, rendered like a jewel ─────── */}
      <section className="border-y border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="order-2 sm:order-1">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              What we actually deliver
            </p>
            <VitalsWaveform className="mt-3 max-w-[220px] text-accent opacity-70" height={28} />
            <h2 className="font-display mt-4 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              Two atoms. That&rsquo;s the entire product.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] text-muted">
              Every concentrator on this site does one job: pull ambient air through a molecular
              sieve and hand you back O&#8322; at 87&ndash;96% purity. No proprietary chemistry, no
              trade secret &mdash; just diatomic oxygen, delivered quietly and on schedule.
            </p>
            <p className="mt-3 max-w-[46ch] text-[13px] text-muted-2">
              Read the mechanism in full in{" "}
              <Link href="/journal/how-oxygen-concentrators-work-psa-sieve-beds" className="underline underline-offset-2 hover:text-accent">
                how oxygen concentrators work
              </Link>
              .
            </p>
          </div>
          <div data-reveal className="order-1 flex justify-center sm:order-2">
            <OxygenMoleculeShowcase />
          </div>
        </div>
      </section>

      {/* ── The material — zeolite lattice, staged as the other half of
           the same "materials" collection as the O2 molecule above ──── */}
      <section className="px-8 py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="flex justify-center">
            <SieveLatticeShowcase />
          </div>
          <div data-reveal>
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              What actually filters it
            </p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              A mineral with the right-sized holes.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] text-muted">
              Zeolite &mdash; a crystal whose lattice structure adsorbs nitrogen molecules under
              pressure while letting the smaller oxygen molecule pass straight through. No
              chemical reaction, no consumable filter to replace on a schedule &mdash; just
              physics, run in reverse every few seconds as the twin beds swap.
            </p>
            <p className="mt-3 max-w-[46ch] text-[13px] text-muted-2">
              It&rsquo;s also the one part that ages. Read what that means for upkeep in{" "}
              <Link href="/journal/oxygen-concentrator-maintenance-lifespan" className="text-accent underline underline-offset-2 hover:no-underline">
                sieve bed maintenance and lifespan
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── How saturation is measured — pulse oximetry light physics ──── */}
      <section className="border-t border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="order-2 sm:order-1">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              How progress gets measured
            </p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              Two colors of light, one number.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] text-muted">
              A pulse oximeter shines red and infrared light through a fingertip and reads how
              much of each gets absorbed &mdash; oxygenated blood and deoxygenated blood absorb
              the two wavelengths differently, and the ratio, measured fresh with every heartbeat,
              is what becomes the SpO2 number on the display.
            </p>
            <p className="mt-3 max-w-[46ch] text-[13px] text-muted-2">
              Where that number is accurate and where it isn&rsquo;t, in{" "}
              <Link href="/journal/pulse-oximeters-how-they-work-accuracy-limits" className="text-accent underline underline-offset-2 hover:no-underline">
                how pulse oximeters actually work
              </Link>
              .
            </p>
          </div>
          <div data-reveal className="order-1 flex justify-center sm:order-2">
            <PulseOxLightShowcase />
          </div>
        </div>
      </section>

      {/* ── What FAA-approved actually certifies — cabin-pressure altitude ── */}
      <section className="border-t border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="flex justify-center">
            <AltitudeCapsuleShowcase />
          </div>
          <div data-reveal>
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              What &ldquo;FAA-approved&rdquo; certifies
            </p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              Rated for a pressurized cabin, not sea level.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] text-muted">
              Aircraft cabins are pressurized to roughly 6,000&ndash;8,000 feet of equivalent
              altitude, not ground level &mdash; an FAA-approved concentrator is certified to keep
              delivering rated output at that altitude, the same way a cockpit altimeter is built
              to read accurately under thinner air, not just on the runway.
            </p>
            <p className="mt-3 max-w-[46ch] text-[13px] text-muted-2">
              What to actually check before flying, in{" "}
              <Link href="/journal/air-travel-with-copd-oxygen-requirements" className="text-accent underline underline-offset-2 hover:no-underline">
                air travel oxygen requirements
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── Flagship product ─────────────────────────────────────────── */}
      <section className="px-8 pb-24">
        {/* Large single-card surface: a gentler max angle than the small
            grid cards, since the same rotation reads as more extreme across
            a wider box (the seam is only with this card's own children, so
            unlike the two edge-to-edge panels above, tilting it whole is safe). */}
        <Tilt max={4} className="mx-auto block max-w-[1240px]">
        <div data-reveal className="grid grid-cols-1 border border-border md:grid-cols-2">
          <div className="group relative flex min-h-[460px] items-center justify-center overflow-hidden bg-surface">
            {flagship.image ? (
              <Image
                src={flagship.image}
                alt={flagship.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain p-14 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                priority
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 22%, var(--surface-2)) 0%, var(--surface-2) 60%)",
                }}
              >
                <div className="absolute h-[220px] w-[220px] rounded-full border border-accent/50" />
                <div className="absolute h-[160px] w-[160px] rounded-full border border-accent/50" />
                <div className="absolute h-[100px] w-[100px] rounded-full bg-accent/30" />
              </div>
            )}
            <TechAnnotations callouts={flagshipCallouts} />
          </div>

          <div className="flex flex-col p-11">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              Flagship &mdash; {flagship.brand}
            </p>
            <h3 className="font-display mt-2.5 text-[clamp(24px,3vw,34px)] font-semibold">
              {flagship.name}
            </h3>
            <div className="text-metallic mt-3.5 font-mono text-[22px] font-semibold tabular-nums">
              {formatPrice(flagship.price!)}
            </div>

            <dl className="mt-7 border-t border-border">
              {[
                ["Brand", flagship.brand],
                ["FAA travel status", flagship.faaApproved ? "Approved" : "N/A"],
                ["Condition", flagship.badge === "Refurbished" ? "Refurbished" : "New"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-3 text-[13px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-mono font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <Link
              href={productHref(flagship)}
              className="mt-7 inline-flex w-fit cursor-pointer items-center rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              View {flagship.name}
            </Link>

            <div className="mt-4 flex items-start gap-2 text-[12px] text-muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent">
                <path
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Prescription required by law for this device class. Upload or e-verify in under
                two minutes at checkout &mdash; we handle the rest.
              </span>
            </div>
          </div>
        </div>
        </Tilt>
      </section>

      {/* ── Cash-pay editorial ───────────────────────────────────────── */}
      <section className="border-t border-border bg-surface-2 px-8 py-24">
        <div className="mx-auto max-w-[780px] text-center">
          <h2 data-reveal className="font-display text-[clamp(26px,3.6vw,40px)] font-semibold text-balance">
            We don&rsquo;t bill insurance. On purpose.
          </h2>
          <p data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties} className="mx-auto mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-muted">
            No prior authorization queues. No claim denials three weeks after delivery. You see
            one price, you pay it, your equipment ships. That trade &mdash; simplicity for the
            paperwork &mdash; is the whole idea.
          </p>

          <div className="mt-11 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
            {[
              ["Speed", "Orders ship in 48 hours — insurance authorization alone often takes longer than that."],
              ["Privacy", "No claim is filed, which means no record with your carrier of what you purchased or why."],
              ["Clarity", "The price on the page is the price at checkout. No adjudication, no surprise balance later."],
            ].map(([k, p], i) => (
              <div key={k} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <p className="font-mono text-[11px] tracking-[0.08em] text-accent uppercase">{k}</p>
                <p className="mt-2 text-[14px] text-muted">{p}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[3px] border border-border-strong p-5 text-left text-[13px] text-muted">
            <strong className="text-text">Insurance policy:</strong> Currently we don&rsquo;t
            accept Insurance, Medicaid, or Medicare. All orders are self-pay. This is stated here,
            at checkout, and in our FAQ &mdash; no exceptions, no fine print.
          </div>
        </div>
      </section>

      {/* ── At a glance — company scale in real numbers ──────────────── */}
      <section className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mb-10 flex items-baseline justify-between gap-6">
            <h2 className="font-display text-[clamp(20px,2.6vw,28px)] font-semibold">
              CIRRUS at a glance
            </h2>
            <p className="hidden font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase sm:block">
              Figures drawn from the live catalog
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
            {[
              { value: PRODUCTS.length, label: "Devices & accessories in catalog", suffix: "" },
              { value: BRAND_COUNT, label: "Manufacturers, authorized channels only", suffix: "" },
              { value: CITIES.length, label: "US cities with confirmed 48-hr delivery", suffix: "" },
              { value: ARTICLES.length, label: "Journal articles, sourced and cited", suffix: "" },
            ].map(({ value, label, suffix }, i) => (
              <div
                key={label}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <Tilt className="h-full">
                  <div className="flex h-full flex-col bg-surface p-8">
                    <div className="font-mono text-[clamp(30px,3.4vw,44px)] font-medium tabular-nums">
                      <CountUp value={value} suffix={suffix} />
                    </div>
                    <p className="mt-2 max-w-[24ch] text-[13px] text-muted">{label}</p>
                  </div>
                </Tilt>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional / ventilators ──────────────────────────────── */}
      <section className="border-t border-border px-8 py-24" style={{ background: "var(--surface-2)" }}>
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mx-auto max-w-[640px] text-center">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              For Clinical &amp; Institutional Buyers
            </p>
            <h2 className="font-display mt-2.5 text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
              Ventilators, sourced the same way &mdash; authorized channels, direct concierge support.
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">
              ICU, transport, and MRI-compatible mechanical ventilators from five manufacturers,
              for biomed and procurement teams, not individual patients. Different buyer, same
              standard.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-y border-border py-6 font-mono text-[12px] tracking-[0.04em] text-muted uppercase">
            <span>Hamilton Medical</span>
            <span>Dräger</span>
            <span>Getinge</span>
            <span>Mindray</span>
            <span>Zoll</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {featuredVentilators.map((v, i) => (
              <div
                key={v.slug}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <Tilt className="h-full">
                  <Link
                    href={productHref(v)}
                    className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                  >
                    <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{v.brand}</p>
                    <h3 className="mt-1 text-[15px] font-semibold transition-colors group-hover:text-accent">{v.name}</h3>
                    {v.spec && <p className="mt-1.5 text-[13px] text-muted">{v.spec}</p>}
                    <p className="mt-4 font-mono text-[16px] tabular-nums">{formatPrice(v.price!)}</p>
                  </Link>
                </Tilt>
              </div>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href="/ventilators"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-border-strong px-7 py-3.5 text-[13px] font-semibold transition-colors hover:border-text"
            >
              View All Ventilators
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Areas served ──────────────────────────────────────────────── */}
      <section className="border-t border-border px-8 py-24">
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mx-auto max-w-[640px] text-center">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              Areas Served
            </p>
            <h2 className="font-display mt-2.5 text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
              48-hour shipping to {CITIES.length} cities. No branch office in any of them.
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">
              We&rsquo;re a direct-ship retailer, not a chain of local storefronts &mdash; every
              order gets the same authorized inventory, prescription verification, and concierge
              line, wherever it&rsquo;s going.
            </p>
          </div>

          <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 border-y border-border py-7">
            {sampleCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas-served/${c.slug}`}
                className="cursor-pointer rounded-full border border-border-strong px-4 py-1.5 text-[12px] font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {c.city}, {c.state}
              </Link>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href="/areas-served"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-border-strong px-7 py-3.5 text-[13px] font-semibold transition-colors hover:border-text"
            >
              See All Areas Served
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lifestyle band ───────────────────────────────────────────── */}
      <section
        className="flex h-[380px] items-end"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, var(--surface-2)), var(--surface-2) 70%)",
        }}
      >
        <div data-reveal className="p-10">
          <p className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">
            Journal &mdash; 04.2026
          </p>
          <h3 className="font-display mt-2 max-w-[16ch] text-[clamp(22px,3vw,32px)] font-semibold text-white">
            Built for altitude. And for boarding gates.
          </h3>
        </div>
      </section>
    </>
  );
}
