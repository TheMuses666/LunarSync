'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Observatory', icon: '◉' },
  { href: '/query', label: 'Navigator', icon: '⊕' },
  { href: '/compare', label: 'Compare', icon: '⚙' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function HeaderNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-stretch border-b border-[#D4D4D4] bg-white text-[11px] tracking-widest uppercase">
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
            {item.label}
          </Link>
        )
      })}

      <div className="flex-1 flex items-center justify-end px-5 gap-4">
        <span className="text-[#777777] text-[10px] tracking-[0.15em] hidden md:block">
          Main Observatory Dashboard
        </span>
        <div className="flex items-center gap-3 text-[#777777]">
          <button type="button" className="hover:text-[#1A1A1A] transition-colors text-base">☽</button>
          <button type="button" className="hover:text-[#1A1A1A] transition-colors text-base">◯</button>
        </div>
      </div>
    </nav>
  )
}
