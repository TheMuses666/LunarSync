'use client'

import { useState } from 'react'
import TermInfoButton from '@/components/TermInfoButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { t as tr } from '@/lib/i18n'
import { getLocalizedCity } from '@/lib/locations'
import { parseDatetimeLocal, normalizeTimeInZone, formatGregorianDate, formatTime } from '@/lib/time'
import { getBaZiDate } from '@/lib/rules'
import { getShichen, getShichenDisplayName, getShichenRange, getShichenRuleLabel } from '@/lib/shichen'
import { computeLunar } from '@/lib/lunar'

const ZONES = [
  { label: 'Beijing', tz: 'Asia/Shanghai' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' },
  { label: 'London', tz: 'Europe/London' },
  { label: 'New York', tz: 'America/New_York' },
]

function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">{children}</div>
}

export default function ComparePage() {
  const { language } = useLanguage()
  const [inputValue, setInputValue] = useState(() => toDatetimeLocal(new Date()))
  const date = parseDatetimeLocal(inputValue)

  const results = date ? ZONES.map(({ label, tz }) => {
    const t = normalizeTimeInZone(date, tz, label)
    const baziDate = getBaZiDate(t)
    const shichen = getShichen(t.hour)
    const lunar = computeLunar(baziDate, t)
    return { label, t, shichen, lunar }
  }) : null

  return (
    <div className="min-h-[calc(100vh-41px)] flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header + input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">
            {tr(language, 'Multi-Timezone Comparison — Same UTC Moment', '多时区对比 — 同一 UTC 时刻')}
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
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{getLocalizedCity(language, r.label)}</span>
                  <span className="text-xs font-medium text-[#1A1A1A]">{r.t.tzLabel}</span>
                </div>

                {/* Gregorian time */}
                <div>
                  <div className="flex items-center gap-2">
                  <Label>{tr(language, 'Local Time', '当地时间')}</Label>
                    <TermInfoButton
                      title={tr(language, 'Local Time', '当地时间')}
                      body={tr(language, 'The civil clock time for this city at the same shared UTC moment.', '同一个 UTC 时刻在该城市对应的当地民用时间。')}
                      buttonClassName="h-4 w-4 text-[9px]"
                    />
                  </div>
                  <div className="mt-1 font-serif-display text-xl text-[#1A1A1A]">{formatTime(r.t)}</div>
                  <div className="text-[11px] text-[#777777]">{formatGregorianDate(r.t)}</div>
                </div>

                {/* Traditional */}
                <div>
                  <div className="flex items-center gap-2">
                  <Label>{tr(language, 'Traditional', '传统')}</Label>
                    <TermInfoButton
                      title={tr(language, 'Traditional', '传统')}
                      body={tr(language, 'The same moment expressed with lunar calendar and shichen notation.', '将同一时刻转换为农历与时辰表示后的结果。')}
                      buttonClassName="h-4 w-4 text-[9px]"
                    />
                  </div>
                  <div className="mt-1 text-sm text-[#1A1A1A]">
                    {r.lunar.lunarYear}年 {r.lunar.lunarMonth}月 {r.lunar.lunarDay}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[#777777] tracking-widest uppercase">
                    <span>{getShichenDisplayName(r.shichen, language)} · {getShichenRuleLabel(r.shichen)}</span>
                    <TermInfoButton
                      title={`${r.shichen.name} / ${getShichenRuleLabel(r.shichen)}`}
                      body={tr(language, `${r.shichen.name} is the active double-hour here. ${getShichenRuleLabel(r.shichen)} is its rule label.`, `${r.shichen.name} 是该城市当前的时辰，${getShichenRuleLabel(r.shichen)} 是它对应的规则编号。`)}
                      buttonClassName="h-4 w-4 text-[9px]"
                    />
                  </div>
                </div>

                {/* 四柱 */}
                <div className="border-t border-[#EEEEEE] pt-2 grid grid-cols-4 gap-1 text-center">
                  {[
                    { label: tr(language, 'Year', '年'), value: r.lunar.yearGanZhi },
                    { label: tr(language, 'Month', '月'), value: r.lunar.monthGanZhi },
                    { label: tr(language, 'Day', '日'), value: r.lunar.dayGanZhi },
                    { label: tr(language, 'Hour', '时'), value: r.lunar.timeGanZhi },
                  ].map(col => (
                    <div key={col.label}>
                      <div className="text-[8px] text-[#AAAAAA] tracking-wider">{col.label}</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{col.value}</div>
                    </div>
                  ))}
                </div>

                {/* Shichen indicator */}
                <div className="flex items-center justify-between text-[9px] text-[#777777]">
                  <span className="font-serif-display text-lg text-[#1A1A1A]">{r.shichen.branch}{r.shichen.number}</span>
                  <span className="tracking-wider">{getShichenRange(r.shichen)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#777777] text-sm py-8">{tr(language, 'Please enter a valid date and time.', '请输入有效的日期与时间。')}</div>
        )}
      </div>
    </div>
  )
}
