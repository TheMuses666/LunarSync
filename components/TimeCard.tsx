import type { LunarResult } from '@/lib/lunar'
import type { Shichen } from '@/lib/shichen'
import { getShichenRange } from '@/lib/shichen'
import type { NormalizedTime } from '@/lib/time'
import { formatDisplay } from '@/lib/time'

interface TimeCardProps {
  normalizedTime: NormalizedTime
  shichen: Shichen
  lunar: LunarResult
  title?: string
}

interface PillarProps {
  label: string
  ganZhi: string
}

function Pillar({ label, ganZhi }: PillarProps) {
  return (
    <div className="flex flex-col items-center gap-1 bg-stone-800 rounded-xl px-4 py-3">
      <span className="text-xs text-stone-500 tracking-widest">{label}</span>
      <span className="text-2xl font-bold text-amber-400">{ganZhi}</span>
    </div>
  )
}

export default function TimeCard({ normalizedTime, shichen, lunar, title }: TimeCardProps) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-5">
      {title && (
        <div className="text-xs text-stone-500 uppercase tracking-widest">{title}</div>
      )}

      {/* Hero: 时辰 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-8xl font-bold text-amber-400 leading-none">{shichen.branch}</span>
        <span className="text-lg text-stone-300">{shichen.name}</span>
        <span className="text-xs text-stone-500">{getShichenRange(shichen)}</span>
      </div>

      {/* 农历 */}
      <div className="text-center text-stone-300 text-sm">
        {lunar.lunarYear}年&nbsp;
        {lunar.isLeapMonth && <span className="text-amber-500">闰</span>}
        {lunar.lunarMonth}月&nbsp;
        {lunar.lunarDay}
        <span className="ml-2 text-stone-500">({lunar.shengXiao}年)</span>
      </div>

      {/* 四柱 */}
      <div className="grid grid-cols-4 gap-2">
        <Pillar label="年柱" ganZhi={lunar.yearGanZhi} />
        <Pillar label="月柱" ganZhi={lunar.monthGanZhi} />
        <Pillar label="日柱" ganZhi={lunar.dayGanZhi} />
        <Pillar label="时柱" ganZhi={lunar.timeGanZhi} />
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-stone-500 font-mono">{formatDisplay(normalizedTime)}</span>
        <span className="text-xs text-stone-600">{normalizedTime.tzLabel}</span>
      </div>
    </div>
  )
}
