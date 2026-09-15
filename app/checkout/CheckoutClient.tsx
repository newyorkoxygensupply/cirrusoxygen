"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type CartLine } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

type OrderSnapshot = {
  lines: CartLine[];
  subtotal: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export function CheckoutClient() {
  const { lines, subtotal, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const rxRequired = true;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("first-name"),
          lastName: get("last-name"),
          email: get("email"),
          phone: get("phone"),
          address: get("address"),
          city: get("city"),
          state: get("state"),
          zip: get("zip"),
          prescriptionFileName: fileName,
          lines: lines.map((l) => ({ slug: l.slug, name: l.name, price: l.price, qty: l.qty })),
          website: data.get("website"), // honeypot
        }),
      });

      const resBody = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(resBody?.error || "Could not submit your order. Please try again.");
      }

      setOrder({
        lines,
        subtotal,
        name: `${get("first-name")} ${get("last-name")}`,
        email: get("email"),
        phone: get("phone"),
        address: get("address"),
        city: get("city"),
        state: get("state"),
        zip: get("zip"),
      });
      setOrderNumber(resBody?.orderNumber ?? null);
      setStatus("sent");
      clear();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not submit your order. Please try again.");
    }
  }

  if (status === "sent" && order) {
    return (
      <div className="mx-auto max-w-[680px] px-8 py-20">
        <div className="text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="mx-auto text-accent">
            <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Order Received</p>
          <h1 className="font-display mt-4 text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
            Your concierge specialist will call within one business day.
          </h1>
          {orderNumber && (
            <p className="mx-auto mt-5 inline-block rounded-[3px] border border-border-strong px-4 py-2 font-mono text-[13px] tracking-[0.06em]">
              Order # <span className="font-semibold text-accent">{orderNumber}</span>
            </p>
          )}
          <p className="mx-auto mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted">
            We verify prescriptions and finalize secure payment by phone before anything ships &mdash;
            no card details are ever collected on this page. Reference your order number if you
            call or email us before your specialist reaches out.
          </p>
        </div>

        <div className="mt-10 rounded-[3px] border border-border p-7">
          <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Order details</h2>
          <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5">
            {order.lines.map((l) => (
              <div key={l.slug} className="flex justify-between text-[13px]">
                <span>
                  {l.name} <span className="text-muted-2">× {l.qty}</span>
                </span>
                <span className="font-mono tabular-nums">{formatPrice(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-5 text-[14px] font-semibold">
            <span>Subtotal</span>
            <span className="font-mono tabular-nums">{formatPrice(order.subtotal)}</span>
          </div>
          <p className="mt-2 text-[12px] text-muted-2">Shipping and tax confirmed by your specialist.</p>

          <div className="mt-6 grid grid-cols-1 gap-5 border-t border-border pt-5 text-[13px] sm:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">Contact</p>
              <p className="mt-1.5 font-semibold">{order.name}</p>
              <p className="text-muted">{order.email}</p>
              <p className="text-muted">{order.phone}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">Ship to</p>
              <p className="mt-1.5">{order.address}</p>
              <p className="text-muted">
                {order.city}, {order.state} {order.zip}
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[48ch] text-center text-[13px] text-muted-2">
          A confirmation with these details was also sent to {order.email}.
        </p>
        <div className="mt-6 text-center">
          <Link href="/" className="cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-8 py-28 text-center">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Checkout</p>
        <h1 className="font-display mt-4 text-[clamp(26px,3.6vw,38px)] font-semibold">Your cart is empty.</h1>
        <div className="mt-9">
          <Link
            href="/oxygen"
            className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
          >
            Browse Oxygen Systems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-8 py-16 md:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Checkout</p>
        <h1 className="font-display mt-3 text-[clamp(24px,3vw,32px)] font-semibold">
          Request your order
        </h1>
        <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted">
          We collect prescription verification and shipping details here. Payment is completed
          securely by phone with your concierge specialist &mdash; we never collect card numbers
          through this form.
        </p>

        <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-7">
          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              Contact
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="first-name" label="First name" required />
              <Field id="last-name" label="Last name" required />
            </div>
            <Field id="email" label="Email" type="email" required />
            <Field id="phone" label="Phone" type="tel" required />
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              Shipping address
            </legend>
            <Field id="address" label="Street address" required />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field id="city" label="City" required />
              <Field id="state" label="State" required />
              <Field id="zip" label="ZIP" required />
            </div>
          </fieldset>

          {rxRequired && (
            <fieldset className="flex flex-col gap-3">
              <legend className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                Prescription verification
              </legend>
              <label
                htmlFor="rx-upload"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-[3px] border border-dashed border-border-strong px-6 py-8 text-center transition-colors hover:border-accent"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted">
                  <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[13px] font-semibold">
                  {fileName ?? "Upload prescription (PDF or photo)"}
                </span>
                <span className="text-[12px] text-muted">
                  Or skip — we can e-verify directly with your physician after you submit.
                </span>
                <input
                  id="rx-upload"
                  type="file"
                  accept="application/pdf,image/*"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </fieldset>
          )}

          {/* Honeypot: hidden from real users, only bots fill it in. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="order-website">Website</label>
            <input id="order-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {status === "error" && errorMessage && (
            <p className="text-[13px] text-accent-warm" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {status === "sending" ? "Submitting…" : "Submit Order Request"}
          </button>
          <p className="text-[12px] text-muted-2">
            Currently we don&rsquo;t accept Insurance, Medicaid, or Medicare. All orders are
            self-pay, finalized by phone. HSA/FSA cards are accepted, and financing may be
            available — ask your concierge specialist.
          </p>
        </form>
      </div>

      <aside className="h-fit rounded-[3px] border border-border p-7">
        <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Order summary</h2>
        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5">
          {lines.map((l) => (
            <div key={l.slug} className="flex justify-between text-[13px]">
              <span>
                {l.name} <span className="text-muted-2">× {l.qty}</span>
              </span>
              <span className="font-mono tabular-nums">{formatPrice(l.price * l.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-border pt-5 text-[14px] font-semibold">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-[12px] text-muted-2">Shipping and tax confirmed by your specialist.</p>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="rounded-[3px] border border-border-strong bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
