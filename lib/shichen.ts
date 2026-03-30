export interface Shichen {
  name: string          // e.g. "子时"
  englishName: string   // e.g. "ZI SHI"
  animal: string        // e.g. "RAT"
  branch: string        // e.g. "子"
  startHour: number     // 23 for 子时
  endHour: number       // 1 for 子时 (exclusive — next 时辰 begins here)
  index: number         // 0–11
  description: string
}

const SHICHEN_DATA: Omit<Shichen, 'index'>[] = [
  {
    name: '子时', englishName: 'ZI SHI', animal: 'RAT', branch: '子',
    startHour: 23, endHour: 1,
    description: 'The deepest hour of night. Yin reaches its absolute peak as Yang begins its first imperceptible stir. A time of profound stillness and latent potential.',
  },
  {
    name: '丑时', englishName: 'CHOU SHI', animal: 'OX', branch: '丑',
    startHour: 1, endHour: 3,
    description: 'The earth holds its breath before dawn. Steady, enduring energy accumulates in silence. A time of quiet diligence and patient perseverance.',
  },
  {
    name: '寅时', englishName: 'YIN SHI', animal: 'TIGER', branch: '寅',
    startHour: 3, endHour: 5,
    description: 'The tiger stirs in the pre-dawn darkness. Bold, ascending energy gathers force. The potential of the new day begins its quiet mobilisation.',
  },
  {
    name: '卯时', englishName: 'MAO SHI', animal: 'RABBIT', branch: '卯',
    startHour: 5, endHour: 7,
    description: 'The sun breaks the horizon with gentle grace. Harmonious wood energy flows upward. A time of new beginnings and luminous perspective.',
  },
  {
    name: '辰时', englishName: 'CHEN SHI', animal: 'DRAGON', branch: '辰',
    startHour: 7, endHour: 9,
    description: 'The dragon ascends with the rising morning. Dynamic, transformative earth energy. Favours ambitious undertakings and decisive action.',
  },
  {
    name: '巳时', englishName: 'SI SHI', animal: 'SNAKE', branch: '巳',
    startHour: 9, endHour: 11,
    description: 'The sun climbs toward its zenith. Wise, intuitive fire energy. A time for careful strategy, penetrating insight, and deliberate planning.',
  },
  {
    name: '午时', englishName: 'WU SHI', animal: 'HORSE', branch: '午',
    startHour: 11, endHour: 13,
    description: 'Solar zenith. Yang reaches its absolute peak. Represents maximum outward expression, vitality, and the full flowering of the day\'s energy.',
  },
  {
    name: '未时', englishName: 'WEI SHI', animal: 'GOAT', branch: '未',
    startHour: 13, endHour: 15,
    description: 'The sun begins its measured descent. Yin energy gently returns. Represents maturity, completion, and the quiet turning of energy inwards.',
  },
  {
    name: '申时', englishName: 'SHEN SHI', animal: 'MONKEY', branch: '申',
    startHour: 15, endHour: 17,
    description: 'Afternoon clarity sharpens the mind. Quick, adaptable metal energy. A time for communication, flexible thinking, and nimble adjustment.',
  },
  {
    name: '酉时', englishName: 'YOU SHI', animal: 'ROOSTER', branch: '酉',
    startHour: 17, endHour: 19,
    description: 'The sun meets the horizon. Gathering and consolidation. A time to harvest the day\'s accomplishments and return to what endures.',
  },
  {
    name: '戌时', englishName: 'XU SHI', animal: 'DOG', branch: '戌',
    startHour: 19, endHour: 21,
    description: 'Dusk deepens into evening. Loyal, protective earth energy. A time for reflection, grounding, and guarding what truly matters.',
  },
  {
    name: '亥时', englishName: 'HAI SHI', animal: 'PIG', branch: '亥',
    startHour: 21, endHour: 23,
    description: 'Night descends and Yin deepens. The world turns inward. A time for restoration, release, and preparing the ground for what is yet to come.',
  },
]

export const SHICHEN_LIST: Shichen[] = SHICHEN_DATA.map((s, i) => ({ ...s, index: i }))

export function getShichen(hour: number): Shichen {
  if (hour === 23 || hour === 0) return SHICHEN_LIST[0]
  return SHICHEN_LIST.find(s => hour >= s.startHour && hour < s.endHour) ?? SHICHEN_LIST[11]
}

export function getShichenRange(shichen: Shichen): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  if (shichen.branch === '子') return '23:00 – 00:59'
  return `${pad(shichen.startHour)}:00 – ${pad(shichen.endHour - 1)}:59`
}
