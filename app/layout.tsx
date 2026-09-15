import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ConciergeWidget } from "@/components/ConciergeWidget";
import { RevealObserver } from "@/components/RevealObserver";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AmbientWisps } from "@/components/AmbientWisps";
import { CartProvider } from "@/lib/cart-context";
import { organizationJsonLd, websiteJsonLd, SITE_URL } from "@/lib/schema";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_NAME = "CIRRUS";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CIRRUS | Portable Oxygen Concentrators & CPAP/BiPAP Systems",
    template: "%s | CIRRUS",
  },
  description:
    "Aviation-grade portable oxygen concentrators and CPAP/BiPAP systems. Self-pay only — no insurance, Medicaid, or Medicare. Prescription required.",
  alternates: { canonical: SITE_URL },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: "CIRRUS | Portable Oxygen Concentrators & CPAP/BiPAP Systems",
    description:
      "Aviation-grade portable oxygen concentrators and CPAP/BiPAP systems. Self-pay only.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIRRUS | Portable Oxygen Concentrators & CPAP/BiPAP Systems",
    description:
      "Aviation-grade portable oxygen concentrators and CPAP/BiPAP systems. Self-pay only.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff1ee" },
    { media: "(prefers-color-scheme: dark)", color: "#101312" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The anti-FOUC script below sets data-theme before hydration, which
      // will legitimately differ from the server-rendered markup — this is
      // the standard, expected way to suppress that specific warning.
      suppressHydrationWarning
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Runs before paint so a stored theme choice applies with no flash —
            without this the toggle would still work but flicker on load. The
            `reveal-ready` flag gates the scroll-reveal hidden state: it's added
            here (JS present) so content only starts hidden when JS can reveal
            it — no-JS visitors see everything immediately. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('cirrus-theme');if(t)document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add('reveal-ready');}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to main content
        </a>
        <AmbientWisps />
        <CartProvider>
          <ScrollProgress />
          <TopBar />
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ConciergeWidget />
          <RevealObserver />
        </CartProvider>
      </body>
    </html>
  );
}
