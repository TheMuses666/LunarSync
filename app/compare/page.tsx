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
] as const

function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">{children}</div>
}

function compareBadgeClass(active: boolean) {
  return active
    ? 'border-[#1A1A1A] bg-[#F7F3EE] text-[#1A1A1A]'
    : 'border-[#E8E1D9] bg-[#FBFAF8] text-[#8A8178]'
}

export default function ComparePage() {
  const { language } = useLanguage()
  const [inputValue, setInputValue] = useState(() => toDatetimeLocal(new Date()))
  const [referenceCity, setReferenceCity] = useState('Beijing')
  const date = parseDatetimeLocal(inputValue)

  const results = date ? ZONES.map(({ label, tz }) => {
    const t = normalizeTimeInZone(date, tz, label)
    const baziDate = getBaZiDate(t)
    const shichen = getShichen(t.hour)
    const lunar = computeLunar(baziDate, t)
    return { label, t, shichen, lunar }
  }) : null

  const reference = results?.find(result => result.label === referenceCity) ?? results?.[0]

  const compared = results?.map(result => {
    const timeOffsetHours = reference ? result.t.tzOffset - reference.t.tzOffset : 0
    const gregorianDiffers = reference ? formatGregorianDate(result.t) !== formatGregorianDate(reference.t) : false
    const lunarDiffers = reference
      ? `${result.lunar.lunarYear}-${result.lunar.lunarMonth}-${result.lunar.lunarDay}` !== `${reference.lunar.lunarYear}-${reference.lunar.lunarMonth}-${reference.lunar.lunarDay}`
      : false
    const shichenDiffers = reference ? result.shichen.branch !== reference.shichen.branch : false
    const pillarsDiffers = reference
      ? [result.lunar.yearGanZhi, result.lunar.monthGanZhi, result.lunar.dayGanZhi, result.lunar.timeGanZhi].join('|') !==
        [reference.lunar.yearGanZhi, reference.lunar.monthGanZhi, reference.lunar.dayGanZhi, reference.lunar.timeGanZhi].join('|')
      : false

    return {
      ...result,
      isReference: result.label === reference?.label,
      timeOffsetHours,
      gregorianDiffers,
      lunarDiffers,
      shichenDiffers,
      pillarsDiffers,
    }
  })

  const diffSummary = compared ? {
    gregorian: compared.filter(item => !item.isReference && item.gregorianDiffers),
    lunar: compared.filter(item => !item.isReference && item.lunarDiffers),
    shichen: compared.filter(item => !item.isReference && item.shichenDiffers),
    pillars: compared.filter(item => !item.isReference && item.pillarsDiffers),
  } : null

  const summaryLines = diffSummary ? [
    diffSummary.gregorian.length > 0
      ? tr(
          language,
          `${diffSummary.gregorian.length} cities cross a different Gregorian date than ${reference?.label}.`,
          `${diffSummary.gregorian.length} 个城市与${getLocalizedCity(language, reference?.label ?? '')}处于不同的公历日期。`
        )
      : tr(language, `All cities remain on the same Gregorian date as ${reference?.label}.`, `所有城市与${getLocalizedCity(language, reference?.label ?? '')}处于同一公历日期。`),
    diffSummary.lunar.length > 0
      ? tr(
          language,
          `${diffSummary.lunar.length} cities differ in lunar date.`,
          `${diffSummary.lunar.length} 个城市的农历日期不同。`
        )
      : tr(language, 'All cities share the same lunar date.', '所有城市的农历日期相同。'),
    diffSummary.shichen.length > 0
      ? tr(
          language,
          `${diffSummary.shichen.length} cities fall in a different shichen.`,
          `${diffSummary.shichen.length} 个城市落在不同的时辰。`
        )
      : tr(language, 'All cities are in the same shichen.', '所有城市处于同一个时辰。'),
  ] : []

  return (
    <div className="min-h-[calc(100vh-41px)] flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">
              {tr(language, 'Compare Traditional Time Across Regions', '跨地区比较传统时间')}
            </div>
            <h1 className="mt-3 font-serif-display text-[clamp(1.5rem,2.6vw,2.35rem)] leading-[1.08] text-[#1A1A1A]">
              {tr(language, 'See what changes when the same UTC moment lands in different cities.', '查看同一个 UTC 时刻落在不同城市时，会发生哪些变化。')}
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[420px]">
            <div>
              <Label>{tr(language, 'Moment', '时刻')}</Label>
              <input
                type="datetime-local"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="mt-2 w-full bg-white border border-[#D4D4D4] px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <Label>{tr(language, 'Reference City', '参考城市')}</Label>
              <select
                value={referenceCity}
                onChange={e => setReferenceCity(e.target.value)}
                className="mt-2 w-full cursor-pointer bg-white border border-[#D4D4D4] px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]"
              >
                {ZONES.map(zone => (
                  <option key={zone.label} value={zone.label}>
                    {getLocalizedCity(language, zone.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {compared ? (
          <>
            <div className="border border-[#D4D4D4] bg-white p-5">
              <div className="flex items-center gap-2">
                <Label>{tr(language, 'Comparison Summary', '对比总结')}</Label>
                <TermInfoButton
                  title={tr(language, 'Comparison Summary', '对比总结')}
                  body={tr(language, 'A quick overview of which cities differ from the selected reference in date, lunar date, and shichen.', '快速概览哪些城市与参考城市在公历日期、农历日期和时辰上不同。')}
                  buttonClassName="h-4 w-4 text-[9px]"
                />
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="border border-[#ECE7E0] bg-[#FBFAF8] p-4">
                  <div className="text-[10px] tracking-[0.18em] uppercase text-[#8A8178]">
                    {tr(language, 'Reference', '参考基准')}
                  </div>
                  <div className="mt-2 font-serif-display text-2xl text-[#1A1A1A]">
                    {getLocalizedCity(language, reference?.label ?? '')}
                  </div>
                  <div className="mt-1 text-sm text-[#777777]">
                    {tr(language, 'Every other card is compared against this city.', '其他所有城市都以它作为对比基准。')}
                  </div>
                </div>

                <div className="grid gap-2">
                  {summaryLines.map(line => (
                    <div key={line} className="border border-[#ECE7E0] bg-[#FBFAF8] px-4 py-3 text-sm text-[#3A3A3A]">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {compared.map(result => (
                <div
                  key={result.label}
                  className={[
                    'border bg-white p-5 transition-colors',
                    result.isReference ? 'border-[#1A1A1A]' : 'border-[#D4D4D4]',
                  ].join(' ')}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 border-b border-[#EEEEEE] pb-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-display text-2xl text-[#1A1A1A]">
                            {getLocalizedCity(language, result.label)}
                          </span>
                          {result.isReference && (
                            <span className="border border-[#1A1A1A] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A]">
                              {tr(language, 'Reference', '基准')}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[10px] tracking-[0.16em] uppercase text-[#777777]">
                          {result.t.tzLabel}
                        </div>
                      </div>

                      {!result.isReference && (
                        <div className="text-left sm:text-right">
                          <div className="text-[9px] tracking-[0.18em] uppercase text-[#777777]">
                            {tr(language, 'Offset vs Reference', '相对基准时差')}
                          </div>
                          <div className="mt-1 font-serif-display text-xl text-[#1A1A1A]">
                            {result.timeOffsetHours > 0 ? '+' : ''}{result.timeOffsetHours}h
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className={`border p-4 ${compareBadgeClass(result.gregorianDiffers)}`}>
                        <div className="flex items-center gap-2">
                          <Label>{tr(language, 'Local Time', '当地时间')}</Label>
                          <TermInfoButton
                            title={tr(language, 'Local Time', '当地时间')}
                            body={tr(language, 'The civil clock time in this city for the same shared UTC moment.', '同一个 UTC 时刻在该城市对应的当地民用时间。')}
                            buttonClassName="h-4 w-4 text-[9px]"
                          />
                        </div>
                        <div className="mt-2 font-serif-display text-2xl text-[#1A1A1A]">{formatTime(result.t)}</div>
                        <div className="mt-1 text-sm text-[#777777]">{formatGregorianDate(result.t)}</div>
                        {!result.isReference && (
                          <div className="mt-3 text-[10px] tracking-[0.16em] uppercase">
                            {result.gregorianDiffers
                              ? tr(language, 'Different Gregorian date', '公历日期不同')
                              : tr(language, 'Same Gregorian date', '公历日期相同')}
                          </div>
                        )}
                      </div>

                      <div className={`border p-4 ${compareBadgeClass(result.lunarDiffers || result.shichenDiffers)}`}>
                        <div className="flex items-center gap-2">
                          <Label>{tr(language, 'Traditional Result', '传统结果')}</Label>
                          <TermInfoButton
                            title={tr(language, 'Traditional Result', '传统结果')}
                            body={tr(language, 'The same moment rendered in lunar calendar and shichen notation.', '将同一时刻转换为农历与时辰体系后的结果。')}
                            buttonClassName="h-4 w-4 text-[9px]"
                          />
                        </div>
                        <div className="mt-2 text-[15px] text-[#1A1A1A]">
                          {result.lunar.lunarYear}年 {result.lunar.lunarMonth}月 {result.lunar.lunarDay}
                        </div>
                        <div className="mt-1 text-[11px] tracking-[0.12em] text-[#777777] uppercase">
                          {getShichenDisplayName(result.shichen, language)} · {getShichenRuleLabel(result.shichen)}
                        </div>
                        {!result.isReference && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${compareBadgeClass(result.lunarDiffers)}`}>
                              {result.lunarDiffers ? tr(language, 'Lunar date differs', '农历日期不同') : tr(language, 'Lunar date matches', '农历日期一致')}
                            </span>
                            <span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${compareBadgeClass(result.shichenDiffers)}`}>
                              {result.shichenDiffers ? tr(language, 'Shichen differs', '时辰不同') : tr(language, 'Shichen matches', '时辰一致')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px]">
                      <div className={`border p-4 ${compareBadgeClass(result.pillarsDiffers)}`}>
                        <div className="flex items-center gap-2">
                          <Label>{tr(language, 'Four Pillars', '四柱')}</Label>
                          <TermInfoButton
                            title={tr(language, 'Four Pillars', '四柱')}
                            body={tr(language, 'Year, month, day, and hour stems and branches derived for this city.', '根据该城市时刻推算出的年、月、日、时四柱干支。')}
                            buttonClassName="h-4 w-4 text-[9px]"
                          />
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                          {[
                            { label: tr(language, 'Year', '年'), value: result.lunar.yearGanZhi },
                            { label: tr(language, 'Month', '月'), value: result.lunar.monthGanZhi },
                            { label: tr(language, 'Day', '日'), value: result.lunar.dayGanZhi },
                            { label: tr(language, 'Hour', '时'), value: result.lunar.timeGanZhi },
                          ].map(col => (
                            <div key={col.label} className="border border-[#ECE7E0] bg-white px-2 py-3">
                              <div className="text-[8px] tracking-[0.16em] uppercase text-[#AAAAAA]">{col.label}</div>
                              <div className="mt-1 text-sm font-medium text-[#1A1A1A]">{col.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-[#ECE7E0] bg-[#FBFAF8] p-4">
                        <Label>{tr(language, 'Current Shichen', '当前时辰')}</Label>
                        <div className="mt-3 font-serif-display text-[2rem] leading-none text-[#1A1A1A]">
                          {result.shichen.branch}
                        </div>
                        <div className="mt-1 text-[10px] tracking-[0.16em] uppercase text-[#777777]">
                          {getShichenRuleLabel(result.shichen)}
                        </div>
                        <div className="mt-3 text-[10px] tracking-[0.12em] text-[#777777]">
                          {getShichenRange(result.shichen)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-[#777777] text-sm py-8">{tr(language, 'Please enter a valid date and time.', '请输入有效的日期与时间。')}</div>
        )}
      </div>
    </div>
  )
}
