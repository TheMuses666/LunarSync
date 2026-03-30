import type { NormalizedTime } from "./time";

export interface BaZiDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Returns the calendar date for traditional coordinate calculation.
 *
 * Astronomical convention: day changes at 00:00 midnight.
 * 子时 spans 23:00–00:59 across the midnight boundary,
 * but the calendar date follows standard Gregorian midnight.
 *
 * The EightChar library (sect=1) handles 子时 cross-midnight logic internally.
 */
export function getBaZiDate(t: NormalizedTime): BaZiDate {
  return { year: t.year, month: t.month, day: t.day };
}
