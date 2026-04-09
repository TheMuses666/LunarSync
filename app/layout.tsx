import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ModeProvider } from '@/contexts/ModeContext'
import HeaderNav from '@/components/HeaderNav'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'LunarSync — Observatory',
  description: 'Precision traditional Chinese lunar timing across global timezones',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full flex flex-col bg-[#E8E8E8] text-[#1A1A1A]">
        <LanguageProvider>
          <ModeProvider>
            <HeaderNav />

            <main className="flex-1">
              {children}
            </main>
          </ModeProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
