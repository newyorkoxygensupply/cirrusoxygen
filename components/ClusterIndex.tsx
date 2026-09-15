import Link from "next/link";
import type { Article } from "@/lib/journal";

/** Complete-library index for a pillar guide: a compact text-link list of
 * every journal article in the pillar's category that isn't already shown
 * as a chapter card. Exists for link-graph reasons as much as for readers —
 * it puts the whole cluster exactly two clicks from the homepage instead of
 * leaving the long tail stranded behind journal pagination. */
export function ClusterIndex({
  title,
  subtitle,
  articles,
}: {
  title: string;
  subtitle: string;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border px-8 py-16">
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-8 max-w-[56ch]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
            The full library
          </p>
          <h2 className="font-display mt-2 text-[clamp(20px,2.6vw,28px)] font-semibold">{title}</h2>
          <p className="mt-2 text-[14px] text-muted">{subtitle}</p>
        </div>
        <ul className="gap-x-10 sm:columns-2 lg:columns-3">
          {articles.map((a) => (
            <li key={a.slug} className="mb-3 break-inside-avoid">
              <Link
                href={`/journal/${a.slug}`}
                className="group cursor-pointer text-[14px] leading-snug font-medium transition-colors hover:text-accent"
              >
                {a.title}
                <span className="ml-2 font-mono text-[10px] text-muted-2 uppercase group-hover:text-accent">
                  {a.readTime}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
