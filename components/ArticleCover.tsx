import Image from "next/image";
import { coverImageFor } from "@/lib/journal-covers";

/** Article cover: a real, individually reviewed licensed photo when one
 * exists under public/journal (the Pixabay set sourced per-article), falling
 * back to procedurally generated vector art — a topic-matched line icon with
 * hash-seeded hue/rotation/layout — for any article without a photo yet. */

function hashSeed(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

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
  "Clinical & Institutional": 185,
};

// Each icon is a real, simple line-icon (24x24 viewBox, stroke-based) — same
// visual language as the nav/trust-bar icons elsewhere on the site.
const ICONS: Record<string, string> = {
  lungs:
    "M12 3v7m0 0c-1-3-3-4-5-4-2.5 0-4 2-4 5s1 7 3.5 7c1.8 0 2.5-1.2 2.5-3v-3m3 3v3c0 1.8.7 3 2.5 3 2.5 0 3.5-4 3.5-7s-1.5-5-4-5c-2 0-4 1-5 4",
  tank: "M9 2h6v2.5H9zM8 4.5h8a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Zm0 5h8",
  mountain: "m3 19 6-11 4 7 2-3 6 7z",
  flame: "M12 3c1 3-3 4-3 7.5a3 3 0 0 0 6 0C15 8 13 7 12 3Zm0 18c-3.5 0-6-2.5-6-6 0-2 1-3.5 2-5 0 2 1 3 2.5 3S13 11 13 9c1.5 1.5 3 3.5 3 6 0 3.5-2.5 6-4 6Z",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z",
  mask: "M4 10a8 8 0 0 1 16 0v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2Zm4 2h.01M14 12h.01",
  pulse: "M2 12h4l2-7 4 14 3-10 2 3h5",
  dumbbell: "M4 9v6M2 10v4m20-4v4m-2-5v6M8 12h8M6 8h2v8H6zM16 8h2v8h-2z",
  heart: "M12 20s-7-4.5-9.5-9C.5 7 2 3.5 5.5 3c2-.3 3.7.7 4.5 2.2C10.8 3.7 12.5 2.7 14.5 3 18 3.5 19.5 7 17.5 11c-2.5 4.5-9.5 9-9.5 9Z",
  scale: "M12 3v18M6 7l-3 6a3 3 0 0 0 6 0zm12 0-3 6a3 3 0 0 0 6 0zM5 7h14M9 21h6",
  apple: "M12 8c-3 0-5 2.2-5 6 0 3.3 2.2 7 4 7 1 0 1.3-.5 2-.5s1 .5 2 .5c1.8 0 4-3.5 4-7 0-2.6-1.3-4.6-3-5.5M12 8c0-2 1-3.5 2.5-4.5M12 8c-.3-1.6-1.3-3-3-4",
  droplet: "M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3Z",
  shield: "M12 3 4.5 6v6c0 4.5 3.2 7.9 7.5 9 4.3-1.1 7.5-4.5 7.5-9V6L12 3Z",
  ribbon: "M9 3 12 9l3-6M12 9v4m0 0c-3 1-5 3.5-5 6.5a3 3 0 0 0 6 0c0-1-.3-1.8-1-2.5m0 0c.7.7 1 1.5 1 2.5a3 3 0 0 0 6 0c0-3-2-5.5-5-6.5",
  magnifier: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5.7-5.7",
  dna: "M6 3c0 6 12 12 12 18M18 3c0 6-12 12-12 18M7.5 8h9M7.5 16h9",
  sun: "M12 4v2m0 12v2M4 12h2m12 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4M7.7 16.3l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  snowflake: "M12 2v20M4.5 7l15 10M19.5 7l-15 10M9 4l3 3 3-3M9 20l3-3 3 3M4 9.5l1-3 3.5-1M4 14.5l1 3 3.5 1M20 9.5l-1-3-3.5-1M20 14.5l-1 3-3.5 1",
  hourglass: "M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9",
  handshake: "M8 12 3 8v6l4 4m8-6 5-4v6l-4 4M8 12l3 3 1-1 1 1 3-3M8 12l2.5-3h3L16 12",
  house: "M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1Z",
  plane: "M12 3v9l7 4v2l-7-2-2 3H8l1-3-7 2v-2l7-4V3l1-2Z",
  pill: "M4.5 14.5 14.5 4.5a5 5 0 0 1 7 7L11.5 21.5a5 5 0 0 1-7-7Zm5-1 6 6",
  wifi: "M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01",
  bed: "M3 18v-7a2 2 0 0 1 2-2h5v5M3 18h18v-5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5M3 18v2m18-2v2M5 9V6a2 2 0 0 1 2-2h1",
  footprints: "M8 4a2 2 0 0 1 2 2c0 1.5-1 2-1 4s1 3 1 4.5A2 2 0 0 1 8 16a2 2 0 0 1-2-2c0-1.5.7-2.5.7-4S6 7.5 6 6a2 2 0 0 1 2-2Zm8 3a2 2 0 0 1 2 2c0 1.5-1 2-1 4s1 3 1 4.5a2 2 0 0 1-2 2.5 2 2 0 0 1-2-2c0-1.5.7-2.5.7-4S14 10.5 14 9a2 2 0 0 1 2-2Z",
  wind: "M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h8a2 2 0 1 1-2 2",
  cloud: "M6.5 10.5c9-6.5 19-1 15.5 6.5m-15.5-6.5C3 12.5 4 15 4.5 17M6.5 10.5C10 8 15 8 18 10.5",
};

type IconRule = { icon: string; keywords: string[] };

// Checked in order — first keyword match on the article's title wins. This
// is what makes the cover *relevant*, not just visually distinct.
const RULES: IconRule[] = [
  // Most specific / distinguishing topics first, so e.g. "lung cancer
  // screening" reads as cancer+screening rather than falling into the
  // generic respiratory bucket just because it contains "lung".
  { icon: "ribbon", keywords: ["cancer", "mammogram"] },
  { icon: "magnifier", keywords: ["screening", "diagnostic"] },
  { icon: "dna", keywords: ["genetic", "family history"] },
  { icon: "tank", keywords: ["oxygen tank", "pulse dose", "continuous flow", "faa-approved", "faa approved"] },
  { icon: "plane", keywords: ["traveling with", "air travel"] },
  { icon: "mountain", keywords: ["altitude"] },
  { icon: "flame", keywords: ["flammability", "flame"] },
  { icon: "mask", keywords: ["mask"] },
  { icon: "sun", keywords: ["sunlight", "vitamin d"] },
  { icon: "moon", keywords: ["sleep", "insomnia", "nap", "circadian", "rem ", "melatonin", "blue light", "shift work"] },
  { icon: "bed", keywords: ["sleep quality"] },
  { icon: "pulse", keywords: ["ahi", "compliance data", "heart rate variability", "hrv", "resting heart rate"] },
  { icon: "dumbbell", keywords: ["strength training", "progressive overload", "zone 2", "vo2 max", "hiit", "steady-state", "grip strength", "mobility training"] },
  { icon: "footprints", keywords: ["steps", "walking"] },
  { icon: "wind", keywords: ["nasal breathing", "breathing technique", "air quality", "second-hand smoke", "radon"] },
  { icon: "heart", keywords: ["heart", "cardiac", "blood pressure", "atrial fibrillation", "cholesterol", "statin", "salt sensitivity"] },
  { icon: "lungs", keywords: ["copd", "pulmonary", "bronchodilator", "lung", "respiratory decline", "hypoxemia", "spo2", "oxygen saturation"] },
  { icon: "scale", keywords: ["bmi", "weight", "visceral", "metabolic rate", "bariatric"] },
  { icon: "apple", keywords: ["diet", "nutrition", "fiber", "microbiome", "mediterranean", "fasting", "protein intake", "ultra-processed", "sodium"] },
  { icon: "droplet", keywords: ["hydration", "electrolyte", "glucose"] },
  { icon: "snowflake", keywords: ["cold exposure", "sauna"] },
  { icon: "hourglass", keywords: ["longevity", "biological age", "aging", "blue zones", "nad+"] },
  { icon: "handshake", keywords: ["support network", "social connection", "caregiver"] },
  { icon: "house", keywords: ["home safety", "home for a family member", "home oxygen", "fall prevention"] },
  { icon: "pill", keywords: ["glp-1", "semaglutide", "medication", "prescription"] },
  { icon: "wifi", keywords: ["telehealth", "remote patient", "wearable", "smartwatch", "quantified self", "continuous glucose", "ecg", "ai in medical"] },
  { icon: "shield", keywords: ["insurance denial", "emergency preparedness", "immune"] },
];

// One sensible default per category for the rare title that matches nothing above.
const CATEGORY_FALLBACK: Record<string, string> = {
  "Oxygen & Respiratory": "lungs",
  "Sleep Health": "moon",
  "Fitness & Exercise": "dumbbell",
  Nutrition: "apple",
  "Heart Health": "heart",
  "Weight Management": "scale",
  "Health Technology": "wifi",
  "Cancer Screening & Prevention": "ribbon",
  Longevity: "hourglass",
  "Caregiving & Chronic Illness": "handshake",
  "Clinical & Institutional": "wind",
};

function pickIcon(title: string, category: string): string {
  const t = title.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.icon;
  }
  return CATEGORY_FALLBACK[category] ?? "cloud";
}

export function ArticleCover({
  slug,
  title,
  category,
  className,
  sizes = "(min-width: 640px) 33vw, 100vw",
}: {
  slug: string;
  title: string;
  category: string;
  className?: string;
  /** Must reflect the rendered width of this particular cover placement. */
  sizes?: string;
}) {
  // Real licensed photo when one exists on disk; procedural art otherwise.
  const photo = coverImageFor(slug);
  if (photo) {
    return (
      <div className={className} aria-hidden="true" style={{ position: "relative", overflow: "hidden" }}>
        <Image src={photo} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const seed = hashSeed(slug);
  const hue = CATEGORY_HUE[category] ?? seed % 360;
  const ringCount = 2 + (seed % 3);
  const angle = seed % 360;
  const offsetX = 30 + (seed % 40);
  const offsetY = 20 + ((seed >> 4) % 40);
  const iconRotate = ((seed >> 2) % 17) - 8;
  const iconPath = ICONS[pickIcon(title, category)];

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(circle at ${offsetX}% ${offsetY}%, hsl(${hue} 45% 88%) 0%, hsl(${hue} 30% 94%) 60%)`,
      }}
    >
      <svg
        viewBox="0 0 200 140"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`rotate(${angle} ${offsetX * 2} ${offsetY * 1.4})`}>
          {Array.from({ length: ringCount }).map((_, i) => (
            <circle
              key={i}
              cx={offsetX * 2}
              cy={offsetY * 1.4}
              r={18 + i * 16}
              fill="none"
              stroke={`hsl(${hue} 40% 42%)`}
              strokeOpacity={0.35 - i * 0.08}
              strokeWidth={1.5}
            />
          ))}
        </g>
        <g transform={`translate(${offsetX * 2} ${offsetY * 1.4}) rotate(${iconRotate}) translate(-12 -12)`}>
          <path
            d={iconPath}
            fill="none"
            stroke={`hsl(${hue} 45% 30%)`}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
