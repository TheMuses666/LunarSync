'use client'

import { useState } from 'react'
import { parseDatetimeLocal, normalizeTimeInZone, formatGregorianDate, formatTime } from '@/lib/time'
import { getBaZiDate } from '@/lib/rules'
import { getShichen, getShichenRange } from '@/lib/shichen'
import { computeLunar } from '@/lib/lunar'

const ZONES = [
  { label: 'Beijing', city: '北京', tz: 'Asia/Shanghai' },
  { label: 'Tokyo', city: '東京', tz: 'Asia/Tokyo' },
  { label: 'London', city: 'London', tz: 'Europe/London' },
  { label: 'New York', city: 'New York', tz: 'America/New_York' },
]

function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">{children}</div>
}

export default function ComparePage() {
  const [inputValue, setInputValue] = useState(() => toDatetimeLocal(new Date()))
  const date = parseDatetimeLocal(inputValue)

  const results = date ? ZONES.map(({ label, city, tz }) => {
    const t = normalizeTimeInZone(date, tz, label)
    const baziDate = getBaZiDate(t)
    const shichen = getShichen(t.hour)
    const lunar = computeLunar(baziDate, t)
    return { label, city, t, shichen, lunar }
  }) : null

  return (
    <div className="min-h-[calc(100vh-41px)] flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header + input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">
            Multi-Timezone Comparison — Same UTC Moment
          </div>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="bg-white border border-[#D4D4D4] text-[#1A1A1A] px-4 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>

        {/* Zone cards */}
        {results ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {results.map(r => (
              <div key={r.label} className="bg-white border border-[#D4D4D4] p-5 flex flex-col gap-3">
                {/* Zone header */}
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{r.label}</span>
                  <span className="text-xs font-medium text-[#1A1A1A]">{r.t.tzLabel}</span>
                </div>

                {/* Gregorian time */}
                <div>
                  <Label>Local Time</Label>
                  <div className="mt-1 font-serif-display text-xl text-[#1A1A1A]">{formatTime(r.t)}</div>
                  <div className="text-[11px] text-[#777777]">{formatGregorianDate(r.t)}</div>
                </div>

                {/* Traditional */}
                <div>
                  <Label>Traditional</Label>
                  <div className="mt-1 text-sm text-[#1A1A1A]">
                    {r.lunar.lunarYear}年 {r.lunar.lunarMonth}月 {r.lunar.lunarDay}
                  </div>
                  <div className="text-[10px] text-[#777777] tracking-widest uppercase mt-0.5">
                    {r.shichen.name} · {r.shichen.englishName}
                  </div>
                </div>

                {/* 四柱 */}
                <div className="border-t border-[#EEEEEE] pt-2 grid grid-cols-4 gap-1 text-center">
                  {[
                    { label: '年', value: r.lunar.yearGanZhi },
                    { label: '月', value: r.lunar.monthGanZhi },
                    { label: '日', value: r.lunar.dayGanZhi },
                    { label: '时', value: r.lunar.timeGanZhi },
                  ].map(col => (
                    <div key={col.label}>
                      <div className="text-[8px] text-[#AAAAAA] tracking-wider">{col.label}</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{col.value}</div>
                    </div>
                  ))}
                </div>

                {/* Shichen indicator */}
                <div className="flex items-center justify-between text-[9px] text-[#777777]">
                  <span className="font-serif-display text-lg text-[#1A1A1A]">{r.shichen.branch}</span>
                  <span className="tracking-wider">{getShichenRange(r.shichen)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#777777] text-sm py-8">Please enter a valid date and time.</div>
        )}
      </div>
    </div>
  )
}
