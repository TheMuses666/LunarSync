'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useMode } from '@/contexts/ModeContext'
import { t } from '@/lib/i18n'

export default function ModeToggle() {
  const { mode, setMode } = useMode()
  const { language } = useLanguage()

  return (
    <div className="inline-flex border border-[#D4D4D4] bg-white text-[10px] tracking-[0.15em] uppercase">
      <button
        type="button"
        onClick={() => setMode('local')}
        className={`cursor-pointer px-5 py-2 transition-colors ${
          mode === 'local'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#777777] hover:text-[#1A1A1A]'
        }`}
      >
        {t(language, 'Local Time', '地区时间')}
      </button>
      <div className="w-px bg-[#D4D4D4]" />
      <button
        type="button"
        onClick={() => setMode('beijing')}
        className={`cursor-pointer px-5 py-2 transition-colors ${
          mode === 'beijing'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#777777] hover:text-[#1A1A1A]'
        }`}
      >
        {t(language, 'Beijing Time', '北京时间')}
      </button>
    </div>
  )
}
