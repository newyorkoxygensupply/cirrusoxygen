import type { NextConfig } from "next";

// Conservative baseline CSP: 'unsafe-inline'/'unsafe-eval' on script-src are
// required because Next.js injects inline hydration/HMR scripts without a
// nonce here — tightening this further needs a nonce wired through
// middleware. Still real protection: no framing, no plugin objects, no
// injected <base> tag, no reading camera/mic/location.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Product photos under /public/products — real files, safe to cache
        // long-term since a changed photo gets a new filename, not overwritten.
        source: "/products/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.(jpg|jpeg|png|webp|avif|ico|svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Marketing homepage has no per-request personalization (no
        // cookies/headers() reads) — safe to let Vercel's edge cache it and
        // revalidate in the background instead of every hit going to origin.
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
