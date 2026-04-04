export interface Shichen {
  name: string          // e.g. "子时"
  englishName: string   // e.g. "ZI SHI"
  animal: string        // e.g. "RAT"
  animalZh: string      // e.g. "鼠"
  branch: string        // e.g. "子"
  number: number        // 1–12, 子=1 ... 亥=12
  startHour: number     // 23 for 子时
  endHour: number       // 1 for 子时 (exclusive — next 时辰 begins here)
  index: number         // 0–11
  description: string
  descriptionZh: string
}

const SHICHEN_DATA: Omit<Shichen, 'index' | 'number'>[] = [
  {
    name: '子时', englishName: 'ZI SHI', animal: 'RAT', animalZh: '鼠', branch: '子',
    startHour: 23, endHour: 1,
    description: 'The deepest hour of night. Yin reaches its absolute peak as Yang begins its first imperceptible stir. A time of profound stillness and latent potential.',
    descriptionZh: '夜色最深之时，阴气至极，阳气初生。象征沉静、潜藏与新的开端。',
  },
  {
    name: '丑时', englishName: 'CHOU SHI', animal: 'OX', animalZh: '牛', branch: '丑',
    startHour: 1, endHour: 3,
    description: 'The earth holds its breath before dawn. Steady, enduring energy accumulates in silence. A time of quiet diligence and patient perseverance.',
    descriptionZh: '黎明之前，大地静默蓄势。象征稳重、耐心与默默积累的力量。',
  },
  {
    name: '寅时', englishName: 'YIN SHI', animal: 'TIGER', animalZh: '虎', branch: '寅',
    startHour: 3, endHour: 5,
    description: 'The tiger stirs in the pre-dawn darkness. Bold, ascending energy gathers force. The potential of the new day begins its quiet mobilisation.',
    descriptionZh: '天将破晓，万物欲动。象征奋发、起势与新一天力量的苏醒。',
  },
  {
    name: '卯时', englishName: 'MAO SHI', animal: 'RABBIT', animalZh: '兔', branch: '卯',
    startHour: 5, endHour: 7,
    description: 'The sun breaks the horizon with gentle grace. Harmonious wood energy flows upward. A time of new beginnings and luminous perspective.',
    descriptionZh: '旭日初升，木气渐旺。象征新生、舒展与清朗开阔的气象。',
  },
  {
    name: '辰时', englishName: 'CHEN SHI', animal: 'DRAGON', animalZh: '龙', branch: '辰',
    startHour: 7, endHour: 9,
    description: 'The dragon ascends with the rising morning. Dynamic, transformative earth energy. Favours ambitious undertakings and decisive action.',
    descriptionZh: '朝阳渐盛，龙气腾升。象征活力、变化与适合进取行动的时段。',
  },
  {
    name: '巳时', englishName: 'SI SHI', animal: 'SNAKE', animalZh: '蛇', branch: '巳',
    startHour: 9, endHour: 11,
    description: 'The sun climbs toward its zenith. Wise, intuitive fire energy. A time for careful strategy, penetrating insight, and deliberate planning.',
    descriptionZh: '日势渐高，火气明朗。象征洞察、筹谋与审慎推进的智慧。',
  },
  {
    name: '午时', englishName: 'WU SHI', animal: 'HORSE', animalZh: '马', branch: '午',
    startHour: 11, endHour: 13,
    description: 'Solar zenith. Yang reaches its absolute peak. Represents maximum outward expression, vitality, and the full flowering of the day\'s energy.',
    descriptionZh: '太阳中天，阳气最盛。象征外放、旺盛与一天能量的高峰。',
  },
  {
    name: '未时', englishName: 'WEI SHI', animal: 'GOAT', animalZh: '羊', branch: '未',
    startHour: 13, endHour: 15,
    description: 'The sun begins its measured descent. Yin energy gently returns. Represents maturity, completion, and the quiet turning of energy inwards.',
    descriptionZh: '日影渐斜，阴气缓回。象征成熟、收束与能量向内回转。',
  },
  {
    name: '申时', englishName: 'SHEN SHI', animal: 'MONKEY', animalZh: '猴', branch: '申',
    startHour: 15, endHour: 17,
    description: 'Afternoon clarity sharpens the mind. Quick, adaptable metal energy. A time for communication, flexible thinking, and nimble adjustment.',
    descriptionZh: '午后神清，金气渐显。象征灵活、沟通与快速应变。',
  },
  {
    name: '酉时', englishName: 'YOU SHI', animal: 'ROOSTER', animalZh: '鸡', branch: '酉',
    startHour: 17, endHour: 19,
    description: 'The sun meets the horizon. Gathering and consolidation. A time to harvest the day\'s accomplishments and return to what endures.',
    descriptionZh: '日近西沉，万物归收。象征整理、归拢与回到稳固之处。',
  },
  {
    name: '戌时', englishName: 'XU SHI', animal: 'DOG', animalZh: '狗', branch: '戌',
    startHour: 19, endHour: 21,
    description: 'Dusk deepens into evening. Loyal, protective earth energy. A time for reflection, grounding, and guarding what truly matters.',
    descriptionZh: '暮色渐沉，土气守成。象征反思、安定与守护重要之事。',
  },
  {
    name: '亥时', englishName: 'HAI SHI', animal: 'PIG', animalZh: '猪', branch: '亥',
    startHour: 21, endHour: 23,
    description: 'Night descends and Yin deepens. The world turns inward. A time for restoration, release, and preparing the ground for what is yet to come.',
    descriptionZh: '夜意更深，万物内敛。象征休养、放下与为来日蓄势。',
  },
]

export const SHICHEN_LIST: Shichen[] = SHICHEN_DATA.map((s, i) => ({
  ...s,
  number: i + 1,
  index: i,
}))

export function getShichen(hour: number): Shichen {
  if (hour === 23 || hour === 0) return SHICHEN_LIST[0]
  return SHICHEN_LIST.find(s => hour >= s.startHour && hour < s.endHour) ?? SHICHEN_LIST[11]
}

export function getShichenRange(shichen: Shichen): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  if (shichen.branch === '子') return '23:00 – 00:59'
  return `${pad(shichen.startHour)}:00 – ${pad(shichen.endHour - 1)}:59`
}

export function getShichenRuleLabel(shichen: Shichen): string {
  return `${shichen.branch}${shichen.number}`
}

export function getShichenAnimal(shichen: Shichen, language: 'en' | 'zh'): string {
  return language === 'zh' ? shichen.animalZh : shichen.animal
}

export function getShichenDescription(shichen: Shichen, language: 'en' | 'zh'): string {
  return language === 'zh' ? shichen.descriptionZh : shichen.description
}

export function getShichenDisplayName(shichen: Shichen, language: 'en' | 'zh'): string {
  return language === 'zh' ? shichen.name : `${shichen.name} (${shichen.englishName})`
}
