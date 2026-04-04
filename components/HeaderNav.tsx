'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'

const NAV_ITEMS = [
  { href: '/', labelEn: 'Observatory', labelZh: '观测台', icon: '◉' },
  { href: '/query', labelEn: 'Navigator', labelZh: '导航器', icon: '⊕' },
  { href: '/compare', labelEn: 'Compare', labelZh: '对比', icon: '⚙' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function HeaderNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  return (
    <nav className="border-b border-[#D4D4D4] bg-white text-[11px] tracking-widest uppercase">
      <div className="flex items-center justify-between border-b border-[#D4D4D4] px-4 py-3 md:hidden">
        <div className="font-bold text-[#1A1A1A] text-[12px] tracking-[0.2em]">
          LunarSync
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="cursor-pointer border border-[#D4D4D4] px-2 py-1 text-[10px] tracking-[0.16em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
          >
            {language === 'en' ? '中' : 'EN'}
          </button>
          <button type="button" className="cursor-pointer text-[#777777] transition-colors hover:text-[#1A1A1A] text-base">☽</button>
          <button type="button" className="cursor-pointer text-[#777777] transition-colors hover:text-[#1A1A1A] text-base">◯</button>
          <button
            type="button"
            aria-label={t(language, 'Toggle navigation menu', '切换导航菜单')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center border border-[#D4D4D4] text-[#1A1A1A]"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-[#D4D4D4] bg-white md:hidden">
          {NAV_ITEMS.map(item => {
            const active = isActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={[
                  'flex items-center justify-between border-b border-[#E9E9E9] px-4 py-4 transition-colors last:border-b-0',
                  active
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#777777] hover:bg-[#F7F7F7] hover:text-[#1A1A1A]',
                ].join(' ')}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px]">{item.icon}</span>
                  {t(language, item.labelEn, item.labelZh)}
                </span>
                <span>{active ? '●' : '○'}</span>
              </Link>
            )
          })}
          <div className="px-4 py-3 text-[9px] tracking-[0.15em] text-[#777777]">
            {t(language, 'Main Observatory Dashboard', '主观测面板')}
          </div>
        </div>
      )}

      <div className="hidden md:flex md:items-stretch">
        <div className="flex items-center px-5 py-3 font-bold text-[#1A1A1A] text-[12px] tracking-[0.2em] border-r border-[#D4D4D4] shrink-0">
          LunarSync
        </div>

        {NAV_ITEMS.map(item => {
          const active = isActive(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-2 px-5 py-3 border-r transition-colors shrink-0',
                active
                  ? 'bg-[#1A1A1A] text-white font-medium border-[#1A1A1A]'
                  : 'text-[#777777] hover:text-[#1A1A1A] border-[#D4D4D4]',
              ].join(' ')}
            >
              <span className="text-[10px]">{item.icon}</span>
              {t(language, item.labelEn, item.labelZh)}
            </Link>
          )
        })}

        <div className="flex-1 flex items-center justify-end px-5 gap-4">
          <span className="text-[#777777] text-[10px] tracking-[0.15em] hidden lg:block">
            {t(language, 'Main Observatory Dashboard', '主观测面板')}
          </span>
          <div className="flex items-center gap-3 text-[#777777]">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="cursor-pointer border border-[#D4D4D4] px-2 py-1 text-[10px] tracking-[0.16em] text-[#777777] transition-colors hover:text-[#1A1A1A]"
            >
              {language === 'en' ? '中' : 'EN'}
            </button>
            <button type="button" className="cursor-pointer hover:text-[#1A1A1A] transition-colors text-base">☽</button>
            <button type="button" className="cursor-pointer hover:text-[#1A1A1A] transition-colors text-base">◯</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
