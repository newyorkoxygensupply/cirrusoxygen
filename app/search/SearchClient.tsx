"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildSearchIndex } from "@/lib/search-index";
import { CATEGORY_META, PRODUCTS, formatPrice, productAltText, productHref, type Product } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { Tilt } from "@/components/Tilt";

const INDEX = buildSearchIndex();

/** Every query word must appear somewhere in the haystack — so "inogen rove"
 *  matches "Inogen Rove 6" but not every Inogen unit. Case-insensitive. */
function tokenMatch(haystack: string, query: string): boolean {
  const h = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => h.includes(t));
}

function matchProducts(query: string): Product[] {
  return PRODUCTS.filter((p) =>
    tokenMatch(
      `${p.name} ${p.brand} ${p.spec ?? ""} ${CATEGORY_META[p.category].label}`,
      query
    )
  );
}

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initial);
  // The query that has actually been searched (via Enter, the "see all" row,
  // or arriving with ?q= in the URL). While the input differs from this, the
  // compact quick-list shows; once committed, the full listing shows.
  const [committed, setCommitted] = useState(initial.trim());

  const query = q.trim();
  const showFull = committed.length >= 2 && query === committed;

  const quickResults = useMemo(() => {
    if (query.length < 2) return [];
    return INDEX.filter((e) => tokenMatch(`${e.title} ${e.description}`, query)).slice(0, 8);
  }, [query]);

  const fullProducts = useMemo(
    () => (showFull ? matchProducts(committed) : []),
    [showFull, committed]
  );
  const fullOther = useMemo(
    () =>
      showFull
        ? INDEX.filter(
            (e) => e.type !== "Product" && tokenMatch(`${e.title} ${e.description}`, committed)
          )
        : [],
    [showFull, committed]
  );

  function commit() {
    if (query.length < 2) return;
    setCommitted(query);
    // Sync the URL so the search is shareable and survives back/refresh.
    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  }

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commit();
        }}
        className="mx-auto max-w-[600px]"
      >
        <label htmlFor="search-input" className="sr-only">
          Search CIRRUS
        </label>
        <div className="flex items-center gap-3 rounded-[3px] border border-border-strong px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="shrink-0 text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            id="search-input"
            type="search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, guides, glossary, journal…"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-2"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-[3px] bg-accent px-4 py-1.5 text-[12px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Quick list while typing — capped, with an explicit "see all" row ── */}
      {!showFull && query.length >= 2 && (
        <div className="mx-auto mt-10 max-w-[720px]">
          {quickResults.length === 0 ? (
            <p className="text-center text-[14px] text-muted">
              No results for &ldquo;{q}&rdquo;.{" "}
              <Link href="/concierge" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                Ask concierge
              </Link>{" "}
              instead.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {quickResults.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex items-center justify-between gap-4 rounded-[3px] px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">{r.title}</p>
                    <p className="truncate text-[12px] text-muted">{r.description}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">
                    {r.type}
                  </span>
                </Link>
              ))}
              <button
                type="button"
                onClick={commit}
                className="mt-2 flex cursor-pointer items-center justify-between rounded-[3px] border border-border-strong px-4 py-3 text-[13px] font-semibold text-accent transition-colors hover:border-accent"
              >
                See all results for &ldquo;{query}&rdquo;
                <span aria-hidden="true">⏎</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Full results after Enter — every matching product, then content ── */}
      {showFull && (
        <div className="mx-auto mt-10 max-w-[1240px]">
          <p className="mb-8 text-center font-mono text-[12px] text-muted-2">
            {fullProducts.length} product{fullProducts.length === 1 ? "" : "s"} ·{" "}
            {fullOther.length} article{fullOther.length === 1 ? "" : "s"} &amp; resources for{" "}
            &ldquo;{committed}&rdquo;
          </p>

          {fullProducts.length === 0 && fullOther.length === 0 && (
            <p className="text-center text-[14px] text-muted">
              Nothing matched &ldquo;{committed}&rdquo;.{" "}
              <Link href="/concierge" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                Ask concierge
              </Link>{" "}
              — if it exists through authorized channels, they can source it.
            </p>
          )}

          {fullProducts.length > 0 && (
            <section>
              <h2 className="font-display mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                Products
              </h2>
              <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
                {fullProducts.map((p) => (
                  <Tilt key={p.slug}>
                    <Link
                      href={productHref(p)}
                      className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                    >
                      <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
                      <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
                      <h3 className="mt-1 text-[15px] font-semibold">{p.name}</h3>
                      {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
                      <p className="mt-4 font-mono text-[16px] tabular-nums">
                        {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                      </p>
                    </Link>
                  </Tilt>
                ))}
              </div>
            </section>
          )}

          {fullOther.length > 0 && (
            <section className="mx-auto mt-12 max-w-[720px]">
              <h2 className="font-display mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                Guides, Glossary &amp; Journal
              </h2>
              <div className="flex flex-col gap-1">
                {fullOther.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group flex items-center justify-between gap-4 rounded-[3px] px-4 py-3 transition-colors hover:bg-surface-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold">{r.title}</p>
                      <p className="truncate text-[12px] text-muted">{r.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">
                      {r.type}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
