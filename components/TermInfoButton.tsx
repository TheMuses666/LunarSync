'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'

interface TermInfoButtonProps {
  title: string
  body: string
  buttonClassName?: string
}

export default function TermInfoButton({
  title,
  body,
  buttonClassName = '',
}: TermInfoButtonProps) {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={t(language, `Explain ${title}`, `解释${title}`)}
        onClick={() => setOpen(true)}
        className={[
          'inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-[#8A8A8A] text-[9px] font-medium leading-none text-[#8A8A8A] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A]',
          buttonClassName,
        ].join(' ')}
      >
        !
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,16,16,0.28)] px-6 py-8 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden border border-[#D8D8D8] bg-[#FFFEFC] shadow-[0_24px_80px_rgba(0,0,0,0.14)]"
            onClick={event => event.stopPropagation()}
          >
            <div className="border-b border-[#ECE7E0] px-7 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.26em] text-[#8A8178]">
                    {t(language, 'Term Explanation', '术语解释')}
                  </div>
                  <h3 className="mt-3 font-serif-display text-[clamp(1.45rem,2.2vw,2.1rem)] leading-[1.08] text-[#1A1A1A]">
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-[10px] uppercase tracking-[0.22em] text-[#8A8178] transition-colors hover:text-[#1A1A1A]"
                >
                  {t(language, 'Close', '关闭')}
                </button>
              </div>
            </div>

            <div className="px-7 py-7">
              <div className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[#8A8178]">
                {t(language, 'Context', '说明')}
              </div>

              <p className="font-serif-display normal-case text-[clamp(1.2rem,1.8vw,1.65rem)] leading-[1.75] text-[#3A3A3A]">
                {body}
              </p>

              <div className="mt-7 border-t border-[#ECE7E0] pt-4 text-[10px] uppercase tracking-[0.2em] text-[#9A938B]">
                {t(language, 'Tap outside or press ESC to close', '点击外部或按 ESC 关闭')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
