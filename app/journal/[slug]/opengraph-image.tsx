import { ImageResponse } from "next/og";
import { ARTICLES, getArticle } from "@/lib/journal";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_HUE: Record<string, number> = {
  "Oxygen & Respiratory": 165,
  "Sleep Health": 205,
  "Fitness & Exercise": 25,
  Nutrition: 95,
  "Heart Health": 350,
  "Weight Management": 280,
  "Health Technology": 195,
  "Cancer Screening & Prevention": 320,
  Longevity: 45,
  "Caregiving & Chronic Illness": 235,
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const hue = article ? (CATEGORY_HUE[article.category] ?? 165) : 165;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: `linear-gradient(135deg, hsl(${hue} 30% 96%), hsl(${hue} 45% 90%))`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700, color: "#14171a" }}>
          CIRRUS<span style={{ color: `hsl(${hue} 40% 32%)` }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {article && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: `hsl(${hue} 40% 32%)`,
                fontWeight: 600,
              }}
            >
              {article.category}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#14171a", lineHeight: 1.15, maxWidth: 1000 }}>
            {article?.title ?? "CIRRUS Journal"}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
