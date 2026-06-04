import type { I18nKey, Translator } from '../../i18n/i18n/i18n'

export type DonutBerryEntry = {
  itemId: number
  donutGroup: number
  spicy: number
  fresh: number
  sweet: number
  bitter: number
  sour: number
  boost: number
  calories: number
}

export type DonutFlavorEntry = {
  hash: string
  name: string
  displayName: string
  flavor: string
  level: number
  cost: number
  category: string
}

export type DonutEntry = {
  index: number
  donutType: number
  stars: number
  levelBoost: number
  calories: number
  berryName: number
  berries: number[]
  flavor0: string
  flavor1: string
  flavor2: string
}

export type DonutPocket = {
  donuts: DonutEntry[]
  berryCatalog: DonutBerryEntry[]
  flavorCatalog: DonutFlavorEntry[]
}

export type DonutPreview = {
  donutType: number
  stars: number
  levelBoost: number
  calories: number
  profile: DonutFlavorProfile
  budgets: DonutFlavorBudgets
}

export type DonutFlavorProfile = {
  spicy: number
  fresh: number
  sweet: number
  bitter: number
  sour: number
}

export type DonutFlavorBudgets = DonutFlavorProfile & {
  total: number
  rainbow: boolean
}

export type DonutDraft = {
  id: string
  berries: number[]
  berryName: number
  flavor0: string
  flavor1: string
  flavor2: string
  label: string
}

export const DONUT_TYPE_NAMES = [
  'Meringue',
  'Curry',
  'Jam',
  'Chocolate',
  'Cream',
  'Rainbow',
] as const

const DONUT_TYPE_KEYS = [
  'donutTypeMeringue',
  'donutTypeCurry',
  'donutTypeJam',
  'donutTypeChocolate',
  'donutTypeCream',
  'donutTypeRainbow',
] satisfies I18nKey[]

export function donutTypeName(donutType: number): string {
  if (donutType >= 198) return 'Special'
  return DONUT_TYPE_NAMES[donutType % 6] ?? 'Unknown'
}

export function localizedDonutType(t: Translator, donutType: number): string {
  if (donutType >= 198) return t('donutTypeSpecial')
  return t(DONUT_TYPE_KEYS[donutType % 6] ?? 'donutTypeUnknown')
}

export function donutDisplayName(
  t: Translator,
  berryName: string,
  donutType: number,
): string {
  return t('donutDisplayName', {
    berry: berryName,
    type: localizedDonutType(t, donutType),
  })
}
