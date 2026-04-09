export const COUNTRY_ZH: Record<string, string> = {
  'United Kingdom': '英国',
  China: '中国',
  'United States': '美国',
  France: '法国',
  Finland: '芬兰',
  Netherlands: '荷兰',
  Japan: '日本',
  Singapore: '新加坡',
  Australia: '澳大利亚',
  'South Korea': '韩国',
  'United Arab Emirates': '阿联酋',
  Germany: '德国',
  Spain: '西班牙',
  Italy: '意大利',
  Switzerland: '瑞士',
  Canada: '加拿大',
  'New Zealand': '新西兰',
}

export const CITY_ZH: Record<string, string> = {
  London: '伦敦',
  Beijing: '北京',
  'New York': '纽约',
  'San Francisco': '旧金山',
  Paris: '巴黎',
  Helsinki: '赫尔辛基',
  Amsterdam: '阿姆斯特丹',
  Tokyo: '东京',
  Singapore: '新加坡',
  Sydney: '悉尼',
  Seoul: '首尔',
  'Hong Kong': '香港',
  Dubai: '迪拜',
  Berlin: '柏林',
  Madrid: '马德里',
  Rome: '罗马',
  Zurich: '苏黎世',
  Toronto: '多伦多',
  Vancouver: '温哥华',
  Auckland: '奥克兰',
}

export function getLocalizedCountry(language: 'en' | 'zh', country: string) {
  return language === 'zh' ? (COUNTRY_ZH[country] ?? country) : country
}

export function getLocalizedCity(language: 'en' | 'zh', city: string) {
  return language === 'zh' ? (CITY_ZH[city] ?? city) : city
}

export function formatRegionOption(language: 'en' | 'zh', country: string, city: string) {
  return language === 'zh'
    ? `${getLocalizedCountry(language, country)} / ${getLocalizedCity(language, city)}`
    : `${country} / ${city}`
}

export function formatLocationDisplay(language: 'en' | 'zh', city: string, country: string) {
  return language === 'zh'
    ? `${getLocalizedCountry(language, country)} · ${getLocalizedCity(language, city)}`
    : `${city}, ${country}`
}
