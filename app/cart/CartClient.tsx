"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export function CartClient() {
  const { lines, setQty, removeItem, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-8 py-28 text-center">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Cart</p>
        <h1 className="font-display mt-4 text-[clamp(28px,4vw,40px)] font-semibold">Your cart is empty.</h1>
        <p className="mx-auto mt-4 max-w-[44ch] text-[15px] text-muted">
          Browse Oxygen or Sleep systems to add an item.
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

  return (
    <div className="mx-auto max-w-[900px] px-8 py-16">
      <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Cart</p>
      <h1 className="font-display mt-3 text-[clamp(26px,3.6vw,38px)] font-semibold">
        {lines.reduce((n, l) => n + l.qty, 0)} item{lines.length === 1 && lines[0].qty === 1 ? "" : "s"}
      </h1>

      <div className="mt-9 border-t border-border">
        {lines.map((l) => (
          <div key={l.slug} className="flex items-center gap-5 border-b border-border py-6">
            <div
              className="h-20 w-20 shrink-0 rounded-[2px]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 18%, var(--surface-2)) 0%, var(--surface-2) 70%)",
              }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{l.name}</p>
              <p className="mt-1 font-mono text-[13px] text-muted">{formatPrice(l.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${l.name}`}
                onClick={() => setQty(l.slug, l.qty - 1)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[3px] border border-border-strong text-[15px] hover:border-text"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-[13px] tabular-nums">{l.qty}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${l.name}`}
                onClick={() => setQty(l.slug, l.qty + 1)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[3px] border border-border-strong text-[15px] hover:border-text"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-mono text-[15px] tabular-nums">
              {formatPrice(l.price * l.qty)}
            </p>
            <button
              type="button"
              aria-label={`Remove ${l.name} from cart`}
              onClick={() => removeItem(l.slug)}
              className="cursor-pointer text-muted-2 transition-colors hover:text-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M6 6h12M9 6V4h6v2M7 6l1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-1">
        <div className="flex w-full max-w-[280px] justify-between text-[14px] text-muted">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums text-text">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 max-w-[280px] text-right text-[12px] text-muted-2">
          Shipping and any applicable tax calculated at checkout.
        </p>
        <Link
          href="/checkout"
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
        >
          Proceed to Checkout
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
