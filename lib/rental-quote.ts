// Pure quote math for rental date ranges. Deliberately import-free so client
// components can bundle it without dragging the full product catalog along.

export type RentalRates = {
  key: string;
  name: string;
  brand: string;
  kind: "oxygen" | "cpap";
  weeklyPrice: number | null;
  monthlyPrice: number | null;
};

export type RentalQuote = {
  days: number;
  weeks: number;
  months: number;
  weeklyTotal: number | null;
  monthlyTotal: number | null;
  bestTerm: "weekly" | "monthly" | null;
};

const DAY_MS = 86_400_000;

/** Parse a YYYY-MM-DD input value as UTC midnight, or null if malformed. */
function parseISODate(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const t = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
}

/**
 * Totals for a date range billed weekly vs. billed monthly. Terms round up
 * (a 10-day rental bills 2 weekly terms or 1 monthly term) — same as the
 * 7-day-minimum policy on shipped rentals. Null when the range is invalid.
 */
export function quoteForRange(rates: RentalRates, startISO: string, endISO: string): RentalQuote | null {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (start === null || end === null || end <= start) return null;

  const days = Math.round((end - start) / DAY_MS);
  const weeks = Math.max(1, Math.ceil(days / 7));
  const months = Math.max(1, Math.ceil(days / 30));
  const weeklyTotal = rates.weeklyPrice !== null ? weeks * rates.weeklyPrice : null;
  const monthlyTotal = rates.monthlyPrice !== null ? months * rates.monthlyPrice : null;

  let bestTerm: "weekly" | "monthly" | null = null;
  if (weeklyTotal !== null && monthlyTotal !== null) {
    bestTerm = monthlyTotal < weeklyTotal ? "monthly" : "weekly";
  } else if (weeklyTotal !== null) {
    bestTerm = "weekly";
  } else if (monthlyTotal !== null) {
    bestTerm = "monthly";
  }

  return { days, weeks, months, weeklyTotal, monthlyTotal, bestTerm };
}

export function formatUSD(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
