import Link from "next/link";
import { buildLinkTerms, linkifyBody } from "@/lib/internal-links";

/** Renders body paragraphs with the first mention of each real category/glossary
 * term auto-linked — capped per piece so it reads as helpful, not stuffed. */
export function AutoLinkedBody({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  const linked = linkifyBody(paragraphs, buildLinkTerms());

  return (
    <>
      {linked.map((segments, i) => (
        <p
          key={i}
          id={i === linked.length - 1 ? "article-takeaway" : undefined}
          className={className}
        >
          {segments.map((seg, j) =>
            seg.href ? (
              <Link key={j} href={seg.href} className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                {seg.text}
              </Link>
            ) : (
              <span key={j}>{seg.text}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}
