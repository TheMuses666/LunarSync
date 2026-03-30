import { Solar } from 'lunar-javascript'
import type { BaZiDate } from './rules'
import type { NormalizedTime } from './time'

export interface LunarResult {
  lunarYear: string
  lunarMonth: string   // e.g. "正" or "闰三"
  lunarDay: string     // e.g. "初一"
  isLeapMonth: boolean
  yearGanZhi: string
  monthGanZhi: string
  dayGanZhi: string
  timeGanZhi: string
  shengXiao: string
}

/**
 * Compute full traditional coordinate data.
 *
 * Uses sect=1 (astronomical): day boundary is 00:00 midnight.
 * 子时 (23:00–00:59) does NOT advance the calendar day — the date
 * passed in (from getBaZiDate) is the Gregorian calendar date.
 */
export function computeLunar(baziDate: BaZiDate, t: NormalizedTime): LunarResult {
  const solar = Solar.fromYmdHms(
    baziDate.year,
    baziDate.month,
    baziDate.day,
    t.hour,
    t.minute,
    t.second
  )
  const lunar = solar.getLunar()
  const ec = lunar.getEightChar()
  ec.setSect(1) // Astronomical: day changes at midnight, not 23:00

  const rawMonth = lunar.getMonth()
  const isLeap = rawMonth < 0

  return {
    lunarYear: lunar.getYearInChinese(),
    lunarMonth: (isLeap ? '闰' : '') + lunar.getMonthInChinese(),
    lunarDay: lunar.getDayInChinese(),
    isLeapMonth: isLeap,
    yearGanZhi: ec.getYear(),
    monthGanZhi: ec.getMonth(),
    dayGanZhi: ec.getDay(),
    timeGanZhi: ec.getTime(),
    shengXiao: lunar.getYearShengXiao(),
  }
}
