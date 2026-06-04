import type { Translator } from '../../i18n/i18n/i18n'
import type { Language } from '../../types/index/index'

export function capitalize(value: string) {
  return value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => capitalize(part))
    .join(' ')
}

export function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export function numberValue(value: unknown) {
  return typeof value === 'number' ? value : null
}

export function formatNum(v: number | null | undefined) {
  return v && v > 0 ? String(v) : '-'
}

export function formatAccuracy(v: number | null | undefined, t: Translator) {
  return v == null ? '-' : v <= 0 ? t('moveNeverMisses') : `${v}%`
}

export function formatPriority(p: number) {
  return p > 0 ? `+${p}` : String(p)
}

export function formatChance(value: unknown) {
  if (typeof value === 'number') return `${value}%`
  if (typeof value === 'string' && value.length > 0) {
    return value.endsWith('%') ? value : `${value}%`
  }
  return '-'
}

export function statusLabel(value: string, language: Language) {
  const labels: Record<string, Record<Language, string>> = {
    burn: { en: 'burn the target', es: 'quemar al objetivo', ja: 'やけど' },
    brn: { en: 'burn the target', es: 'quemar al objetivo', ja: 'やけど' },
    burned: { en: 'burn the target', es: 'quemar al objetivo', ja: 'やけど' },
    freeze: {
      en: 'freeze the target',
      es: 'congelar al objetivo',
      ja: 'こおり',
    },
    frz: { en: 'freeze the target', es: 'congelar al objetivo', ja: 'こおり' },
    frozen: {
      en: 'freeze the target',
      es: 'congelar al objetivo',
      ja: 'こおり',
    },
    paralysis: {
      en: 'paralyze the target',
      es: 'paralizar al objetivo',
      ja: 'まひ',
    },
    par: { en: 'paralyze the target', es: 'paralizar al objetivo', ja: 'まひ' },
    paralyze: {
      en: 'paralyze the target',
      es: 'paralizar al objetivo',
      ja: 'まひ',
    },
    poison: {
      en: 'poison the target',
      es: 'envenenar al objetivo',
      ja: 'どく',
    },
    psn: { en: 'poison the target', es: 'envenenar al objetivo', ja: 'どく' },
    tox: {
      en: 'badly poison the target',
      es: 'envenenar gravemente al objetivo',
      ja: 'もうどく',
    },
    slp: {
      en: 'put the target to sleep',
      es: 'dormir al objetivo',
      ja: 'ねむり',
    },
    confusion: {
      en: 'confuse the target',
      es: 'confundir al objetivo',
      ja: 'こんらん',
    },
    flinch: {
      en: 'make the target flinch',
      es: 'amedrentar al objetivo',
      ja: 'ひるみ',
    },
  }
  return labels[value]?.[language] ?? humanizeSlug(value)
}

export function statLabel(value: string, language: Language) {
  const labels: Record<string, Record<Language, string>> = {
    attack: { en: 'Attack', es: 'el Ataque', ja: 'こうげき' },
    defense: { en: 'Defense', es: 'la Defensa', ja: 'ぼうぎょ' },
    'special-attack': {
      en: 'Special Attack',
      es: 'el Ataque Especial',
      ja: 'とくこう',
    },
    'special-defense': {
      en: 'Special Defense',
      es: 'la Defensa Especial',
      ja: 'とくぼう',
    },
    speed: { en: 'Speed', es: 'la Velocidad', ja: 'すばやさ' },
    accuracy: { en: 'accuracy', es: 'la precisión', ja: 'めいちゅう' },
    evasion: { en: 'evasion', es: 'la evasión', ja: 'かいひ' },
  }
  return labels[value]?.[language] ?? humanizeSlug(value)
}

export function abilityModifierLabel(value: string) {
  const labels: Record<string, string> = {
    'iron-fist': 'Iron Fist',
    'strong-jaw': 'Strong Jaw',
    sharpness: 'Sharpness',
    'mega-launcher': 'Mega Launcher',
    soundproof: 'Soundproof',
    'punk-rock': 'Punk Rock',
    bulletproof: 'Bulletproof',
    overcoat: 'Overcoat',
    'wind-rider': 'Wind Rider',
    dancer: 'Dancer',
  }
  return labels[value] ?? humanizeSlug(value)
}

export function itemModifierLabel(value: string) {
  const labels: Record<string, string> = {
    'loaded-dice': 'Loaded Dice',
    'protective-pads': 'Protective Pads',
    'punching-glove': 'Punching Glove',
  }
  return labels[value] ?? humanizeSlug(value)
}
