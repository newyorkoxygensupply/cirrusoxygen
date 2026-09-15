import Image from "next/image";

/** Real product photo when available, falling back to the abstract gradient
 * placeholder used sitewide for products without licensed photography yet. */
export function ProductThumb({
  image,
  name,
  alt,
  className = "h-40 w-full",
  sizes = "(min-width: 640px) 33vw, 100vw",
}: {
  image?: string;
  name: string;
  alt?: string;
  className?: string;
  /** Must match the actual rendered width at each breakpoint for this
   * particular grid — a mismatched default here means next/image fetches
   * the wrong size. */
  sizes?: string;
}) {
  if (image) {
    return (
      <div className={`relative overflow-hidden rounded-[2px] bg-surface ${className}`}>
        <Image
          src={image}
          alt={alt ?? name}
          fill
          sizes={sizes}
          className="object-contain p-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
    );
  }
  return (
    <div
      className={`rounded-[2px] ${className}`}
      style={{
        background:
          "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 18%, var(--surface-2)) 0%, var(--surface-2) 70%)",
      }}
      aria-hidden="true"
    />
  );
}
