import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/schema";
import type { Crumb } from "@/lib/breadcrumbs";

/**
 * Renders a visible breadcrumb trail AND its matching BreadcrumbList JSON-LD
 * from the same crumb array. Google requires the structured breadcrumb to
 * reflect on-page content, so the two are emitted together, never separately.
 * The last crumb is the current page (not a link).
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 2) return null;
  const ld = breadcrumbJsonLd(crumbs);
  const last = crumbs.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border px-8 py-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ol className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-2">
        {crumbs.map((c, i) => (
          <li key={c.url} className="flex items-center gap-2">
            {i === last ? (
              <span className="text-text" aria-current="page">
                {c.name}
              </span>
            ) : (
              <>
                <Link href={c.url} className="cursor-pointer hover:text-text">
                  {c.name}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
