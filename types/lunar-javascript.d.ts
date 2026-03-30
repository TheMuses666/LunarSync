declare module 'lunar-javascript' {
  interface EightCharObj {
    setSect(sect: number): void
    getSect(): number
    getYear(): string
    getMonth(): string
    getDay(): string
    getTime(): string
  }

  interface LunarObj {
    getYear(): number
    getMonth(): number
    getDay(): number
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
    getYearShengXiao(): string
    toString(): string
    toFullString(): string
    getEightChar(): EightCharObj
  }

  interface SolarObj {
    getLunar(): LunarObj
    getYear(): number
    getMonth(): number
    getDay(): number
    toString(): string
  }

  const Solar: {
    fromYmd(y: number, m: number, d: number): SolarObj
    fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): SolarObj
  }

  const Lunar: {
    fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): LunarObj
  }
}
