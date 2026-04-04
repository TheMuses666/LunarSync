'use client'

import { useState } from 'react'
import { parseDatetimeLocal, normalizeTimeInZone, formatGregorianDate, formatTime } from '@/lib/time'
import { getBaZiDate } from '@/lib/rules'
import { getShichen, getShichenRange, getShichenRuleLabel } from '@/lib/shichen'
import { computeLunar } from '@/lib/lunar'

const REGION_OPTIONS = [
  { id: 'london', label: 'United Kingdom / London', timezone: 'Europe/London' },
  { id: 'beijing', label: 'China / Beijing', timezone: 'Asia/Shanghai' },
  { id: 'new-york', label: 'United States / New York', timezone: 'America/New_York' },
  { id: 'san-francisco', label: 'United States / San Francisco', timezone: 'America/Los_Angeles' },
  { id: 'paris', label: 'France / Paris', timezone: 'Europe/Paris' },
  { id: 'helsinki', label: 'Finland / Helsinki', timezone: 'Europe/Helsinki' },
  { id: 'amsterdam', label: 'Netherlands / Amsterdam', timezone: 'Europe/Amsterdam' },
  { id: 'tokyo', label: 'Japan / Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'singapore', label: 'Singapore / Singapore', timezone: 'Asia/Singapore' },
  { id: 'sydney', label: 'Australia / Sydney', timezone: 'Australia/Sydney' },
]

function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">{children}</div>
}

export default function QueryPage() {
  const [inputValue, setInputValue] = useState(() => toDatetimeLocal(new Date()))
  const [regionId, setRegionId] = useState('london')
  const selectedRegion = REGION_OPTIONS.find(region => region.id === regionId) ?? REGION_OPTIONS[0]
  const resetForm = () => {
    setInputValue(toDatetimeLocal(new Date()))
    setRegionId('london')
  }

  const date = parseDatetimeLocal(inputValue)
  const result = date ? (() => {
    const t = normalizeTimeInZone(date, selectedRegion.timezone, selectedRegion.timezone)
    const baziDate = getBaZiDate(t)
    const shichen = getShichen(t.hour)
    const lunar = computeLunar(baziDate, t)
    return { t, shichen, lunar }
  })() : null

  return (
    <div className="min-h-[calc(100vh-41px)] flex flex-col items-center justify-center py-10 px-6">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        {/* Input panel */}
        <div className="bg-white border border-[#D4D4D4] p-5">
          <Label>Select Time for Analysis</Label>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="mt-3 w-full bg-[#F5F5F5] border border-[#D4D4D4] text-[#1A1A1A] px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <Label>Region</Label>
              <button
                type="button"
                onClick={resetForm}
                className="border border-[#D4D4D4] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
              >
                Reset
              </button>
            </div>
            <select
              value={regionId}
              onChange={e => setRegionId(e.target.value)}
              className="mt-3 w-full bg-white border border-[#D4D4D4] text-[#1A1A1A] px-4 py-2.5 text-sm uppercase tracking-[0.12em] focus:outline-none focus:border-[#1A1A1A] transition-colors"
            >
              {REGION_OPTIONS.map(region => (
                <option key={region.id} value={region.id}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result ? (
          <>
            {/* Gregorian + Traditional side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-[#D4D4D4] p-5">
                <Label>Gregorian Coordinate</Label>
                <div className="mt-3 font-serif-display text-3xl">{formatGregorianDate(result.t)}</div>
                <div className="font-serif-display text-xl text-[#777777]">{formatTime(result.t)}</div>
                <div className="mt-2 text-[9px] tracking-[0.15em] uppercase text-[#777777]">{result.t.tzLabel}</div>
              </div>

              <div className="bg-white border border-[#D4D4D4] p-5">
                <Label>Traditional Coordinates</Label>
                <div className="mt-3 font-serif-display text-2xl leading-snug">
                  {result.lunar.lunarYear}年{' '}
                  {result.lunar.isLeapMonth && <span className="text-[#777777]">闰</span>}
                  {result.lunar.lunarMonth}月{' '}
                  {result.lunar.lunarDay}
                </div>
                <div className="mt-1 text-[11px] text-[#777777] tracking-widest uppercase">
                  {result.shichen.name} ({result.shichen.englishName}) · {getShichenRuleLabel(result.shichen)}
                </div>
              </div>
            </div>

            {/* 四柱 + Description */}
            <div className="bg-white border border-[#D4D4D4] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-serif-display text-2xl">{result.shichen.branch}</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{result.shichen.animal}</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{getShichenRuleLabel(result.shichen)}</span>
                  </div>
                  <div className="text-[9px] tracking-widest text-[#777777]">{getShichenRange(result.shichen)}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] tracking-widest text-right">
                  {(['年', '月', '日', '时'] as const).map((label, i) => {
                    const v = [result.lunar.yearGanZhi, result.lunar.monthGanZhi, result.lunar.dayGanZhi, result.lunar.timeGanZhi][i]
                    return (
                      <div key={label} className="contents">
                        <span className="text-[#777777] uppercase">{label}</span>
                        <span className="text-[#1A1A1A] font-medium">{v}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p className="mt-4 text-[12px] text-[#777777] italic font-serif-display leading-relaxed border-t border-[#EEEEEE] pt-3">
                {result.shichen.description}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-[#777777] text-sm py-8">Please enter a valid date and time.</div>
        )}
      </div>
    </div>
  )
}
