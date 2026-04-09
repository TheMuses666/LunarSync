'use client'

import { useState } from 'react'
import SearchableRegionSelect from '@/components/SearchableRegionSelect'
import TermInfoButton from '@/components/TermInfoButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { t as tr } from '@/lib/i18n'
import { REGION_OPTIONS } from '@/lib/regions'
import { parseDatetimeLocal, normalizeTimeInZone, formatGregorianDate, formatTime } from '@/lib/time'
import { getBaZiDate } from '@/lib/rules'
import { getShichen, getShichenAnimal, getShichenDescription, getShichenDisplayName, getShichenRange, getShichenRuleLabel } from '@/lib/shichen'
import { computeLunar } from '@/lib/lunar'

function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">{children}</div>
}

export default function QueryPage() {
  const { language } = useLanguage()
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
          <Label>{tr(language, 'Select Time for Analysis', '选择分析时间')}</Label>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="mt-3 w-full bg-[#F5F5F5] border border-[#D4D4D4] text-[#1A1A1A] px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <Label>{tr(language, 'Region', '地区')}</Label>
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer border border-[#D4D4D4] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
              >
                {tr(language, 'Reset', '重置')}
              </button>
            </div>
            <SearchableRegionSelect
              options={REGION_OPTIONS}
              value={regionId}
              onChange={setRegionId}
              className="mt-3"
            />
          </div>
        </div>

        {result ? (
          <>
            {/* Gregorian + Traditional side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-[#D4D4D4] p-5">
                <div className="flex items-center gap-2">
                  <Label>{tr(language, 'Gregorian Coordinate', '公历坐标')}</Label>
                  <TermInfoButton
                    title={tr(language, 'Gregorian Coordinate', '公历坐标')}
                    body={tr(language, 'The standard calendar date and clock time for the selected region.', '所选地区下的标准公历日期与时钟时间。')}
                    buttonClassName="h-4 w-4 text-[9px]"
                  />
                </div>
                <div className="mt-3 font-serif-display text-3xl">{formatGregorianDate(result.t)}</div>
                <div className="font-serif-display text-xl text-[#777777]">{formatTime(result.t)}</div>
                <div className="mt-2 text-[9px] tracking-[0.15em] uppercase text-[#777777]">{result.t.tzLabel}</div>
              </div>

              <div className="bg-white border border-[#D4D4D4] p-5">
                <div className="flex items-center gap-2">
                  <Label>{tr(language, 'Traditional Coordinates', '传统坐标')}</Label>
                  <TermInfoButton
                    title={tr(language, 'Traditional Coordinates', '传统坐标')}
                    body={tr(language, 'The selected moment expressed with the Chinese lunar calendar and shichen system.', '将所选时刻转换为中国农历与时辰体系后的表达。')}
                    buttonClassName="h-4 w-4 text-[9px]"
                  />
                </div>
                <div className="mt-3 font-serif-display text-2xl leading-snug">
                  {result.lunar.lunarYear}年{' '}
                  {result.lunar.isLeapMonth && <span className="text-[#777777]">闰</span>}
                  {result.lunar.lunarMonth}月{' '}
                  {result.lunar.lunarDay}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#777777] tracking-widest uppercase">
                  <span>{getShichenDisplayName(result.shichen, language)} · {getShichenRuleLabel(result.shichen)}</span>
                  <TermInfoButton
                    title={`${result.shichen.name} / ${getShichenRuleLabel(result.shichen)}`}
                    body={tr(language, `${result.shichen.name} is the active double-hour. ${getShichenRuleLabel(result.shichen)} is its rule label.`, `${result.shichen.name} 是当前时辰，${getShichenRuleLabel(result.shichen)} 是它对应的规则编号。`)}
                    buttonClassName="h-4 w-4 text-[9px]"
                  />
                </div>
              </div>
            </div>

            {/* 四柱 + Description */}
            <div className="bg-white border border-[#D4D4D4] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-serif-display text-2xl">{result.shichen.branch}</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{getShichenAnimal(result.shichen, language)}</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{getShichenRuleLabel(result.shichen)}</span>
                    <TermInfoButton
                      title={tr(language, 'Shichen Rule Number', '时辰规则编号')}
                      body={tr(language, 'A short rule label like 子1, 酉10, or 戌11.', '例如 子1、酉10、戌11 这样的简短规则编号。')}
                      buttonClassName="h-4 w-4 text-[9px]"
                    />
                  </div>
                  <div className="text-[9px] tracking-widest text-[#777777]">{getShichenRange(result.shichen)}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] tracking-widest text-right">
                  {[
                    tr(language, 'Year', '年'),
                    tr(language, 'Month', '月'),
                    tr(language, 'Day', '日'),
                    tr(language, 'Hour', '时'),
                  ].map((label, i) => {
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
                {getShichenDescription(result.shichen, language)}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-[#777777] text-sm py-8">{tr(language, 'Please enter a valid date and time.', '请输入有效的日期与时间。')}</div>
        )}
      </div>
    </div>
  )
}
