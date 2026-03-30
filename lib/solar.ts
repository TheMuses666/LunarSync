function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Calculate approximate solar noon using the Spencer/Iqbal equation of time.
 *
 * @param longitude  Decimal degrees (positive east, negative west)
 * @param date       Local date (used for day-of-year)
 * @param tzOffset   UTC offset in hours (e.g. 8 for UTC+8, -4 for EDT)
 * @returns          "HH:MM:SS" string in the given local timezone
 */
export function calculateSolarNoon(
  longitude: number,
  date: Date,
  tzOffset: number
): string {
  const N = getDayOfYear(date)
  const B = (360 / 365) * (N - 81) * (Math.PI / 180)
  // Equation of time in minutes
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
  // Solar noon in local minutes from midnight
  const localMinutes = 12 * 60 - eot - (longitude / 15) * 60 + tzOffset * 60
  const totalMin = ((localMinutes % (24 * 60)) + 24 * 60) % (24 * 60)

  const h = Math.floor(totalMin / 60)
  const m = Math.floor(totalMin % 60)
  const s = Math.round((totalMin - Math.floor(totalMin)) * 60)

  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(s)}`
}
