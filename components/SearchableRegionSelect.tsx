'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { formatRegionOption, getLocalizedCity, getLocalizedCountry } from '@/lib/locations'
import type { RegionOption } from '@/lib/regions'

interface SearchableRegionSelectProps {
  options: RegionOption[]
  value: string
  onChange: (id: string) => void
  className?: string
}

export default function SearchableRegionSelect({
  options,
  value,
  onChange,
  className = '',
}: SearchableRegionSelectProps) {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selected = options.find(option => option.id === value) ?? options[0]
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return options

    return options.filter(option => {
      const en = `${option.country} ${option.city} ${option.timezone}`.toLowerCase()
      const zh = `${getLocalizedCountry('zh', option.country)} ${getLocalizedCity('zh', option.city)}`.toLowerCase()
      return en.includes(normalized) || zh.includes(normalized)
    })
  }, [options, query])

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()

    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={['relative', className].join(' ')}>
      <button
        type="button"
        onClick={() => {
          setOpen(current => !current)
          setQuery('')
        }}
        className="flex w-full cursor-pointer items-center justify-between border border-[#D4D4D4] bg-white px-4 py-2.5 text-left text-sm text-[#1A1A1A] transition-colors hover:border-[#B8B0A8]"
      >
        <span className="truncate uppercase tracking-[0.12em]">
          {selected ? formatRegionOption(language, selected.country, selected.city) : ''}
        </span>
        <span className="ml-3 shrink-0 text-[#777777]">⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 border border-[#D4D4D4] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#EEEEEE] p-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={t(language, 'Search region or city', '搜索国家、城市或时区')}
              className="w-full border border-[#D4D4D4] bg-[#FAFAFA] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]"
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id)
                    setQuery('')
                    setOpen(false)
                  }}
                  className={[
                    'flex w-full cursor-pointer flex-col items-start px-4 py-3 text-left transition-colors hover:bg-[#F7F3EE]',
                    option.id === value ? 'bg-[#FBFAF8]' : '',
                  ].join(' ')}
                >
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#1A1A1A]">
                    {formatRegionOption(language, option.country, option.city)}
                  </span>
                  <span className="mt-1 text-[11px] text-[#8A8178]">
                    {option.timezone}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-[#8A8178]">
                {t(language, 'No matching regions', '没有匹配的地区')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
