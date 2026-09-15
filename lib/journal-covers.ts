import { readdirSync } from "node:fs";
import path from "node:path";

/** Filenames actually present in public/journal — read once at module scope
 * (build/server time), so covers can use a real photo when one exists and the
 * procedural SVG art otherwise. Never guesses a path: if the file isn't on
 * disk, the article simply keeps its vector cover. */
const COVER_FILES: Set<string> = (() => {
  try {
    return new Set(readdirSync(path.join(process.cwd(), "public", "journal")));
  } catch {
    return new Set();
  }
})();

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function coverImageFor(slug: string): string | null {
  for (const ext of EXTENSIONS) {
    if (COVER_FILES.has(`${slug}.${ext}`)) return `/journal/${slug}.${ext}`;
  }
  return null;
}
