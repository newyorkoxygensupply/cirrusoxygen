import Link from "next/link";
import { formatPrice, productHref, type Product } from "@/lib/products";

/** Real side-by-side spec table for a category listing — built from each
 * product's own disclosed specs, never a fabricated/normalized value. Rows
 * are the union of spec labels actually present; a blank cell means that
 * spec isn't disclosed for that unit, not that it's absent. */
export function SpecComparisonTable({ products }: { products: Product[] }) {
  const withSpecs = products.filter((p) => p.specs && p.specs.length > 0);
  if (withSpecs.length < 2) return null;

  const rowLabels: string[] = [];
  for (const p of withSpecs) {
    for (const [label] of p.specs!) {
      if (!rowLabels.includes(label)) rowLabels.push(label);
    }
  }

  return (
    <section className="border-t border-border px-8 py-16">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
          Compare specs side-by-side
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th scope="col" className="border-b border-border p-3 text-left text-muted-2"></th>
                {withSpecs.map((p) => (
                  <th key={p.slug} scope="col" className="border-b border-border p-3 text-left font-semibold">
                    <Link href={productHref(p)} className="cursor-pointer hover:text-accent">
                      {p.name}
                    </Link>
                    <div className="mt-1 font-mono text-[12px] font-normal text-muted">
                      {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLabels.map((label) => (
                <tr key={label}>
                  <th scope="row" className="border-b border-border p-3 text-left font-mono text-[11px] font-normal text-muted-2 uppercase">
                    {label}
                  </th>
                  {withSpecs.map((p) => {
                    const value = p.specs!.find(([l]) => l === label)?.[1];
                    return (
                      <td key={p.slug} className="border-b border-border p-3 tabular-nums">
                        {value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[12px] text-muted-2">
          Blank cells mean that spec isn't disclosed for that unit, not that it's absent — ask your
          concierge specialist to confirm before ordering.
        </p>
      </div>
    </section>
  );
}
