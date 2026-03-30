'use client'

import { useMode } from '@/contexts/ModeContext'

export default function ModeToggle() {
  const { mode, setMode } = useMode()

  return (
    <div className="inline-flex border border-[#D4D4D4] bg-white text-[10px] tracking-[0.15em] uppercase">
      <button
        type="button"
        onClick={() => setMode('local')}
        className={`px-5 py-2 transition-colors ${
          mode === 'local'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#777777] hover:text-[#1A1A1A]'
        }`}
      >
        Local Time
      </button>
      <div className="w-px bg-[#D4D4D4]" />
      <button
        type="button"
        onClick={() => setMode('beijing')}
        className={`px-5 py-2 transition-colors ${
          mode === 'beijing'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#777777] hover:text-[#1A1A1A]'
        }`}
      >
        Beijing Time
      </button>
    </div>
  )
}
