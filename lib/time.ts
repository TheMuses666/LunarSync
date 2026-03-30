import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export type TimeMode = 'beijing' | 'local'

export interface NormalizedTime {
  year: number
  month: number   // 1–12
  day: number     // 1–31
  hour: number    // 0–23
  minute: number
  second: number
  tzLabel: string
  tzOffset: number  // UTC offset in hours (e.g. 8 for UTC+8)
  isoString: string
}

export function normalizeTime(date: Date, mode: TimeMode): NormalizedTime {
  const tz = mode === 'beijing' ? 'Asia/Shanghai' : dayjs.tz.guess()
  const label = mode === 'beijing' ? 'UTC+8 (BEIJING)' : undefined
  return normalizeTimeInZone(date, tz, label)
}

export function normalizeTimeInZone(date: Date, tz: string, label?: string): NormalizedTime {
  const d = dayjs(date).tz(tz)
  return {
    year: d.year(),
    month: d.month() + 1,
    day: d.date(),
    hour: d.hour(),
    minute: d.minute(),
    second: d.second(),
    tzLabel: label ?? tz,
    tzOffset: d.utcOffset() / 60,
    isoString: d.toISOString(),
  }
}

export function getNow(mode: TimeMode): NormalizedTime {
  return normalizeTime(new Date(), mode)
}

export function parseDatetimeLocal(value: string): Date | null {
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export function formatDisplay(t: NormalizedTime): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${t.year}-${pad(t.month)}-${pad(t.day)} ${pad(t.hour)}:${pad(t.minute)}:${pad(t.second)}`
}

export function formatGregorianDate(t: NormalizedTime): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${t.year}.${pad(t.month)}.${pad(t.day)}`
}

export function formatTime(t: NormalizedTime): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(t.hour)}:${pad(t.minute)}:${pad(t.second)}`
}
