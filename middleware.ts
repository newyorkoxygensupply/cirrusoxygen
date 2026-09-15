import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Vercel Edge Middleware — runs at the edge, before the app, on every
// request. This site has no Cloudflare layer (DNS resolves straight to
// Vercel), so this is the real equivalent of a Cloudflare Worker for this
// stack: canonical-form enforcement, header governance for pages that must
// never be indexed, and lightweight bot-hit tagging for log analysis.
// Deliberately does NOT vary served content by user-agent — the whole site
// is statically prerendered HTML already, so there's nothing to
// bot-specific-prerender, and serving different bodies by UA is cloaking.
const NOINDEX_PREFIXES = ["/search", "/cart", "/checkout", "/account"];
const BOT_UA_PATTERN = /Googlebot|bingbot|GPTBot|ClaudeBot|Google-Extended|PerplexityBot|anthropic-ai/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Canonical host: the apex (cirrusoxygen.com) has never redirected to
  // www, so Google crawls and indexes both hosts as separate URLs — every
  // page on the site is duplicated in the index, splitting ranking
  // signals. Canonical tags/robots.txt/sitemap already declare www as
  // canonical; this makes that the actual served behavior, not just a hint.
  const host = request.headers.get("host") ?? "";
  if (host === "cirrusoxygen.com") {
    const url = request.nextUrl.clone();
    url.host = "www.cirrusoxygen.com";
    return NextResponse.redirect(url, 308);
  }

  // Canonical form: strip a trailing slash (except the root) with a
  // permanent redirect, before the app ever renders.
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  // Belt-and-suspenders noindex: these pages already carry per-page
  // `robots: { index: false }` metadata and a robots.txt disallow: this
  // header means a regression in either of those doesn't silently let the
  // page back into the index.
  if (NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // Logging-only bot tag — never used to alter the response body.
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_UA_PATTERN.test(ua)) {
    response.headers.set("X-Bot-Hit", "1");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
