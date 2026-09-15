"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatUSD, quoteForRange, type RentalRates } from "@/lib/rental-quote";

const inputClass =
  "rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent";

function QuotePanel({
  device,
  start,
  end,
}: {
  device: RentalRates | undefined;
  start: string;
  end: string;
}) {
  const quote = device && start && end ? quoteForRange(device, start, end) : null;

  return (
    <div className="rounded-[3px] border border-border-strong bg-surface-2 p-5">
      <p className="font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">Live quote</p>

      {!device ? (
        <p className="mt-3 text-[13px] text-muted">Choose a device to see rates.</p>
      ) : !quote ? (
        <p className="mt-3 text-[13px] text-muted">
          Pick your start and end dates to see weekly and monthly totals.
        </p>
      ) : device.weeklyPrice === null && device.monthlyPrice === null ? (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          The {device.name} is priced by phone. Send the request below and your specialist
          will quote your {quote.days}-day rental directly.
        </p>
      ) : (
        <div className="mt-3">
          <p className="text-[13px] text-muted">
            {quote.days}-day rental &mdash; {start} to {end}
          </p>
          <dl className="mt-4 flex flex-col gap-2.5">
            {([
              ["weekly", "Billed weekly", quote.weeks, device.weeklyPrice, quote.weeklyTotal],
              ["monthly", "Billed monthly", quote.months, device.monthlyPrice, quote.monthlyTotal],
            ] as const).map(([term, label, count, rate, total]) => (
              <div
                key={term}
                className={`flex items-baseline justify-between gap-3 rounded-[3px] border px-3.5 py-2.5 ${
                  quote.bestTerm === term ? "border-accent" : "border-border"
                }`}
              >
                <dt className="flex items-center gap-2 text-[13px] font-medium">
                  {label}
                  {quote.bestTerm === term && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] text-accent uppercase">
                      Best rate
                    </span>
                  )}
                </dt>
                <dd className="font-mono text-[14px] tabular-nums">
                  {rate === null || total === null ? (
                    <span className="text-muted-2">Call for pricing</span>
                  ) : (
                    <>
                      <span className="text-muted-2">
                        {count} &times; {formatUSD(rate)} ={" "}
                      </span>
                      <span className={quote.bestTerm === term ? "font-semibold text-accent" : "font-semibold"}>
                        {formatUSD(total)}
                      </span>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-muted-2">
        Estimate only, from live rates &mdash; partial terms round up, with a 7-day minimum on
        shipped rentals. Excludes shipping. Your specialist confirms availability, final
        pricing, and prescription verification before anything ships.
      </p>
    </div>
  );
}

function RentalBookingInner({ devices }: { devices: RentalRates[] }) {
  const params = useSearchParams();
  const requested = params.get("device");

  const [deviceKey, setDeviceKey] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preselect the device a rental PDP linked in with.
  useEffect(() => {
    if (requested && devices.some((d) => d.key === requested)) {
      setDeviceKey(requested);
    }
  }, [requested, devices]);

  // Computed after mount: the page is statically prerendered, so a build-time
  // "today" would go stale as a min-date the moment the deploy ages a day.
  const [todayISO, setTodayISO] = useState<string | undefined>(undefined);
  useEffect(() => {
    setTodayISO(new Date().toLocaleDateString("en-CA"));
  }, []);

  const device = useMemo(() => devices.find((d) => d.key === deviceKey), [devices, deviceKey]);
  const oxygenDevices = devices.filter((d) => d.kind === "oxygen");
  const cpapDevices = devices.filter((d) => d.kind === "cpap");

  if (status === "sent") {
    return (
      <div className="rounded-[3px] border border-border-strong p-8 text-center">
        <p className="text-[14px] font-semibold text-text">Rental request received.</p>
        <p className="mt-2 text-[13px] text-muted">
          A specialist will confirm availability and final pricing within one business day.
          Nothing ships until your prescription is verified.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage(null);

        const data = new FormData(e.currentTarget);

        try {
          const res = await fetch("/api/rental-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceKey,
              start,
              end,
              name: data.get("name"),
              email: data.get("email"),
              phone: data.get("phone"),
              zip: data.get("zip"),
              fulfillment,
              notes: data.get("notes"),
              website: data.get("website"), // honeypot
            }),
          });

          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || "Could not send your request. Please try again.");
          }

          setStatus("sent");
        } catch (err) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Could not send your request. Please try again.");
        }
      }}
      className="grid grid-cols-1 gap-10 lg:grid-cols-2"
    >
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[11px] tracking-[0.06em] text-accent uppercase">
          1 &middot; Device &amp; dates
        </p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rb-device" className="text-[12px] font-medium text-muted">
            Device
          </label>
          <select
            id="rb-device"
            required
            value={deviceKey}
            onChange={(e) => setDeviceKey(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a rental device
            </option>
            <optgroup label="Oxygen Concentrators">
              {oxygenDevices.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="CPAP & BiPAP">
              {cpapDevices.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-start" className="text-[12px] font-medium text-muted">
              Start date
            </label>
            <input
              id="rb-start"
              type="date"
              required
              min={todayISO}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-end" className="text-[12px] font-medium text-muted">
              End date
            </label>
            <input
              id="rb-end"
              type="date"
              required
              min={start || todayISO}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <QuotePanel device={device} start={start} end={end} />
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-mono text-[11px] tracking-[0.06em] text-accent uppercase">
          2 &middot; Contact &amp; delivery
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-name" className="text-[12px] font-medium text-muted">
              Name
            </label>
            <input id="rb-name" name="name" required autoComplete="name" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-email" className="text-[12px] font-medium text-muted">
              Email
            </label>
            <input id="rb-email" name="email" type="email" required autoComplete="email" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-phone" className="text-[12px] font-medium text-muted">
              Phone
            </label>
            <input id="rb-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rb-zip" className="text-[12px] font-medium text-muted">
              ZIP code{fulfillment === "pickup" ? " (optional)" : ""}
            </label>
            <input
              id="rb-zip"
              name="zip"
              required={fulfillment === "delivery"}
              autoComplete="postal-code"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </div>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-[12px] font-medium text-muted">Delivery or pickup</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {([
              ["delivery", "Deliver to me", "Shipped nationwide"],
              ["pickup", "Local pickup", "Arranged with your specialist"],
            ] as const).map(([value, label, hint]) => (
              <label
                key={value}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-[3px] border px-3.5 py-2.5 transition-colors ${
                  fulfillment === value ? "border-accent" : "border-border-strong hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value={value}
                  checked={fulfillment === value}
                  onChange={() => setFulfillment(value)}
                  className="sr-only"
                />
                <span className="text-[13px] font-semibold">{label}</span>
                <span className="text-[11px] text-muted-2">{hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rb-notes" className="text-[12px] font-medium text-muted">
            Notes <span className="text-muted-2">(optional)</span>
          </label>
          <textarea
            id="rb-notes"
            name="notes"
            rows={3}
            placeholder="Travel dates, flow setting, prescription questions…"
            className={inputClass}
          />
        </div>
        {/* Honeypot: hidden from real users, only bots fill it in. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="rb-website">Website</label>
          <input id="rb-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {status === "error" && errorMessage && (
          <p className="text-[13px] text-accent-warm" role="alert">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Request This Rental"}
        </button>
        <p className="text-[11px] text-muted-2">
          This sends a booking request, not a payment &mdash; nothing is charged until a
          specialist confirms your dates and verifies your prescription.
        </p>
      </div>
    </form>
  );
}

export function RentalBooking({ devices }: { devices: RentalRates[] }) {
  return (
    <Suspense fallback={null}>
      <RentalBookingInner devices={devices} />
    </Suspense>
  );
}
