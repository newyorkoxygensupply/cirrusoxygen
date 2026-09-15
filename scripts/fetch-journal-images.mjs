// One-off script: fetches one real, relevant Pixabay photo per Journal
// article and saves it under public/journal/. Run with:
//   node --experimental-strip-types scripts/fetch-journal-images.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const KEY = process.env.PIXABAY_API_KEY;
if (!KEY) {
  console.error("Missing PIXABAY_API_KEY in .env.local");
  process.exit(1);
}

const { ARTICLES } = await import("../lib/journal.ts");

// Deliberately scene/concept queries, not literal device or drug-package
// searches — those return real branded products (a competitor's oximeter,
// a specific inhaler brand) which is worse than generic imagery.
const RULES = [
  { q: "doctor consultation patient", keywords: ["cancer", "mammogram"] },
  { q: "medical clinic hallway", keywords: ["screening", "diagnostic"] },
  { q: "laboratory science research", keywords: ["genetic", "family history"] },
  { q: "doctor stethoscope medical exam", keywords: ["oxygen tank", "pulse dose", "continuous flow"] },
  { q: "airplane window travel", keywords: ["traveling with", "air travel", "faa-approved", "faa approved"] },
  { q: "mountain landscape hiking", keywords: ["altitude"] },
  { q: "cozy fireplace home", keywords: ["flammability", "flame"] },
  // CPAP-cluster routing: Pixabay has no genuine CPAP-device pool (q=cpap
  // returns zero hits), so each spoke routes to imagery matching its actual
  // topic — paperwork, cleaning, clinical, or air — rather than a fake stand-in.
  { q: "paperwork desk office", keywords: ["without insurance", "machine cost", "prescription for a cpap"] },
  { q: "washing soap water clean", keywords: ["clean cpap"] },
  { q: "doctor stethoscope medical exam", keywords: ["bipap"] },
  { q: "cirrus clouds blue sky", keywords: ["pressurized air"] },
  { q: "peaceful sleep bedroom", keywords: ["mask", "sleep", "insomnia", "nap", "circadian", "rem ", "melatonin", "blue light", "shift work"] },
  { q: "sunrise morning outdoor", keywords: ["sunlight", "vitamin d"] },
  { q: "senior wearable health monitor", keywords: ["continuous glucose"] },
  { q: "wrist wearable technology", keywords: ["ahi", "compliance data", "heart rate variability", "hrv", "resting heart rate"] },
  { q: "gym workout fitness", keywords: ["strength training", "progressive overload", "zone 2", "vo2 max", "hiit", "steady-state", "grip strength", "mobility training"] },
  { q: "walking outdoors path", keywords: ["steps", "walking"] },
  { q: "forest fresh air nature", keywords: ["nasal breathing", "breathing technique", "air quality", "second-hand smoke", "radon"] },
  { q: "stethoscope ekg heart medical", keywords: ["heart", "cardiac", "blood pressure", "atrial fibrillation", "cholesterol", "statin", "salt sensitivity"] },
  { q: "doctor stethoscope medical exam", keywords: ["copd", "pulmonary", "bronchodilator", "lung", "respiratory decline", "hypoxemia", "spo2", "oxygen saturation"] },
  { q: "healthy lifestyle scale", keywords: ["bmi", "weight", "visceral", "metabolic rate", "bariatric"] },
  { q: "fresh vegetables produce", keywords: ["diet", "nutrition", "fiber", "microbiome", "mediterranean", "fasting", "protein intake", "ultra-processed", "sodium"] },
  { q: "drinking water glass", keywords: ["hydration", "electrolyte"] },
  { q: "sauna wood benches steam", keywords: ["cold exposure", "sauna"] },
  { q: "senior couple active outdoors", keywords: ["longevity", "biological age", "aging", "blue zones", "nad+"] },
  { q: "support group therapy circle", keywords: ["support network"] },
  { q: "elderly care hands support", keywords: ["social connection", "caregiver"] },
  { q: "cozy living room home", keywords: ["home safety", "home for a family member", "home oxygen", "fall prevention"] },
  // Ventilator-cluster routing (order matters: specific before generic).
  { q: "hospital operating room", keywords: ["ventilator market"] },
  { q: "hospital operating room", keywords: ["fleet"] },
  { q: "cozy living room home", keywords: ["home ventilation"] },
  { q: "mri scanner", keywords: ["mri"] },
  { q: "ambulance emergency medical", keywords: ["transport ventilator"] },
  { q: "tools repair workshop", keywords: ["service plan"] },
  { q: "paperwork desk office", keywords: ["consumables", "gray-market"] },
  { q: "hospital ward bed", keywords: ["ventilator", "ventilation"] },
  // Cluster-article routing: titration/sizing pieces get a real consultation
  // scene; equipment-upkeep pieces get tools rather than another stethoscope.
  { q: "doctor consultation patient", keywords: ["lpm"] },
  { q: "tools repair workshop", keywords: ["maintenance"] },
  { q: "pharmacy shelf organized", keywords: ["glp-1", "semaglutide", "medication", "prescription"] },
  { q: "hospital monitor screen equipment", keywords: ["remote patient"] },
  { q: "laptop video call desk", keywords: ["telehealth", "wearable", "smartwatch", "quantified self", "continuous glucose", "ecg", "ai in medical"] },
  { q: "paperwork desk office", keywords: ["insurance denial", "emergency preparedness"] },
];

const CATEGORY_FALLBACK = {
  "Oxygen & Respiratory": "doctor stethoscope medical exam",
  "Sleep Health": "peaceful sleep bedroom",
  "Fitness & Exercise": "gym workout fitness",
  Nutrition: "fresh vegetables produce",
  "Heart Health": "stethoscope ekg heart medical",
  "Weight Management": "healthy lifestyle scale",
  "Health Technology": "laptop video call desk",
  "Cancer Screening & Prevention": "medical clinic hallway",
  Longevity: "senior couple active outdoors",
  "Caregiving & Chronic Illness": "elderly care hands support",
  "Clinical & Institutional": "hospital ward bed",
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary match, not substring — otherwise "imaging" false-matches the
// keyword "aging" (this really happened and picked the wrong query).
function hasKeyword(text, keyword) {
  return new RegExp(`\\b${escapeRegExp(keyword)}`, "i").test(text);
}

function pickQuery(title, category) {
  for (const rule of RULES) {
    if (rule.keywords.some((k) => hasKeyword(title, k))) return rule.q;
  }
  return CATEGORY_FALLBACK[category] ?? "health wellness";
}

function hashSeed(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const OUT_DIR = path.join(process.cwd(), "public", "journal");
mkdirSync(OUT_DIR, { recursive: true });

// Seed the dedup set from the previous run's manifest so partial runs (SLUGS=…)
// can never pick a photo already used by another article, and merge new results
// into the manifest instead of overwriting the full history.
const MANIFEST_PATH = path.join(process.cwd(), "scripts", "journal-images-manifest.json");
let previous = [];
try {
  previous = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
} catch {
  // no manifest yet — first run
}

const usedIds = new Set(previous.map((r) => r.pixabayId));
// Permanently retired ids: images rejected in review or already living in
// public/journal under a slug whose manifest entry got replaced. Re-picking
// any of these is always wrong, regardless of which slug is being fetched.
for (const id of (process.env.BLOCK_IDS ?? "").split(",").filter(Boolean)) {
  usedIds.add(Number(id));
}
const results = [];
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : ARTICLES.length;
const ONLY_SLUGS = process.env.SLUGS ? new Set(process.env.SLUGS.split(",")) : null;
const TARGET = ONLY_SLUGS ? ARTICLES.filter((a) => ONLY_SLUGS.has(a.slug)) : ARTICLES.slice(0, LIMIT);

for (const article of TARGET) {
  const query = pickQuery(article.title, article.category);
  const url = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=50&safesearch=true&orientation=horizontal&min_width=1200`;
  let hits = [];
  try {
    const res = await fetch(url);
    const data = await res.json();
    hits = (data.hits || []).filter((h) => !usedIds.has(h.id));
  } catch (e) {
    console.error("FETCH FAIL", article.slug, e.message);
    continue;
  }
  if (hits.length === 0) {
    console.warn("NO HITS", article.slug, query);
    continue;
  }
  const seed = hashSeed(article.slug);
  const pick = hits[seed % hits.length];
  usedIds.add(pick.id);

  const ext = pick.largeImageURL.match(/\.(jpg|jpeg|png)(\?|$)/i)?.[1] ?? "jpg";
  const filename = `${article.slug}.${ext}`;
  const outPath = path.join(OUT_DIR, filename);

  try {
    const imgRes = await fetch(pick.largeImageURL);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    writeFileSync(outPath, buf);
    results.push({ slug: article.slug, query, pixabayId: pick.id, file: `/journal/${filename}`, user: pick.user, pageURL: pick.pageURL });
    console.log("OK", article.slug, "->", query, "->", pick.id);
  } catch (e) {
    console.error("DOWNLOAD FAIL", article.slug, e.message);
  }

  // Be polite to the API.
  await new Promise((r) => setTimeout(r, 150));
}

// Merge: this run's slugs replace their previous entries; everything else keeps.
const fetchedSlugs = new Set(results.map((r) => r.slug));
const merged = [...previous.filter((r) => !fetchedSlugs.has(r.slug)), ...results];
writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2));
console.log(`\nDone. ${results.length} fetched this run; manifest now covers ${merged.length} articles.`);
