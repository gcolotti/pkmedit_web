// Ability-specific sub-types of the v3 pokemon-knowledge schema.
// Shared base (V3Base, LocalizedText, FlavorTextEntry) lives in ./moveDetail.

import type { FlavorTextEntry, LocalizedText, V3Base } from './moveDetail'

export type { LocalizedText }

export type AbilityInteractions = {
  blockedBy: string[]
  effectClassesAffected: string[]
  fieldEffects: string[]
  ignoredBy: string[]
  ignores: string[]
  moveFlagsAffected: string[]
  movesAffected: string[]
}

export type AbilityAvailability = {
  introducedGeneration: number
  mainline: boolean
}

export type AbilityModifiedBy = {
  items: string[]
  moves: string[]
  terrain: string[]
  weather: string[]
  abilities: string[]
}

export type AbilityPokemon = {
  speciesId: number
  isHidden: boolean
  slot: number
}

export type AbilityCurrent = {
  generation: number
  availability: AbilityAvailability
  interactions: AbilityInteractions
  modifiedBy: AbilityModifiedBy
  effect: {
    short: LocalizedText
    description: LocalizedText
    outOfBattle: LocalizedText | null
  }
  pokemon: AbilityPokemon[]
  flavorText: FlavorTextEntry[]
}

export type AbilityDetail = V3Base & {
  kind: 'ability'
  current: AbilityCurrent
}
