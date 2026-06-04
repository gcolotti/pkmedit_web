// v3 pokemon-knowledge schema (schemaVersion: 3).
// Source: GET /api/catalogs/move-details and /api/catalogs/ability-details (both
// accept ?ids= and ?id=; the ability endpoint also accepts ?slugs=).
// Backed by data/pokemon-knowledge/intermediate/moves.v3.json and abilities.v3.json.

import type { LocalizedText } from '../i18n/i18n'

export type { LocalizedText }

export type SourceRefs = {
  bulbapedia?: string
  pokeapi?: string
  wikidex?: string
}

export type Provenance = Record<string, string[] | null>
export type Confidence = Record<string, 'low' | 'medium' | 'high'>

export type FlavorTextEntry = {
  version: string
  text: string
}

// --- Catalog shared metadata (top of every entry) ---

export type V3Base = {
  id: number
  schemaVersion: 3
  slug: string
  names: {
    en: string | null
    es: string | null
    jp: string | null
  }
  urls: {
    bulbapedia: string | null
    wikidex: string | null
  }
  sourceRefs: SourceRefs
  provenance: Provenance
  confidence: Confidence
  generations: Record<string, GenerationChange>
}

export type GenerationChange = {
  introduced?: boolean | null
  effectChanges?: {
    description?: LocalizedText
  }
}

// --- Move-specific sub-types ---

export const MOVE_CATEGORIES = ['status', 'physical', 'special'] as const
export type MoveCategory = (typeof MOVE_CATEGORIES)[number]
export type MoveCategoryId = 0 | 1 | 2

export const PROTECT_DETECT_VALUES = [
  'blocked',
  'bypasses',
  'not-flagged',
] as const
export type ProtectDetectValue = (typeof PROTECT_DETECT_VALUES)[number]

export const SUBSTITUTE_VALUES = [
  'bypasses-substitute',
  'hits-substitute',
  'sound-bypasses-substitute',
] as const
export type SubstituteValue = (typeof SUBSTITUTE_VALUES)[number]

export type MoveInteractions = {
  bite: boolean
  bullet: boolean
  charge: boolean
  contact: boolean
  dance: boolean
  defrost: boolean
  gravity: boolean
  heal: boolean
  magicCoat: boolean
  mirrorMove: boolean
  powder: boolean
  protectDetect: ProtectDetectValue
  pulse: boolean
  punch: boolean
  recharge: boolean
  slicing: boolean
  snatch: boolean
  sound: boolean
  substitute: SubstituteValue
  wind: boolean
}

export type MoveAvailability = {
  introducedGeneration: number
  mainline: boolean
  unavailableInGenerations: number[]
}

export type MoveModifiedBy = {
  abilities: string[]
  items: string[]
  terrain: string[]
  weather: string[]
}

export type MoveDamageMeta = {
  critRate: number
  drain: number
  recoil: number
  healing: number
  flinchChance: number
}

export type SecondaryEffectRaw = Record<string, unknown>

export type MoveCurrent = {
  type: string
  typeId: number
  category: MoveCategory
  categoryId: MoveCategoryId
  power: number | null
  accuracy: number | null
  pp: number
  priority: number
  target: string
  generation: number
  availability: MoveAvailability
  interactions: MoveInteractions
  modifiedBy: MoveModifiedBy
  effect: {
    short: LocalizedText
    description: LocalizedText
    outOfBattle: LocalizedText | null
    secondaryEffects: SecondaryEffectRaw[]
  }
  damageMeta: MoveDamageMeta
  flavorText: FlavorTextEntry[]
}

export type MoveDetail = V3Base & {
  kind: 'move'
  current: MoveCurrent
}
