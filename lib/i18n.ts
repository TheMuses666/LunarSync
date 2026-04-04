import type { Language } from '@/contexts/LanguageContext'

export function t(language: Language, en: string, zh: string) {
  return language === 'zh' ? zh : en
}
