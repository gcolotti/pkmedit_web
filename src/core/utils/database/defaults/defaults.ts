import type {
  EncounterDatabaseSearchRequest,
  MysteryGiftDatabaseSearchRequest,
} from '../../../types/database/database'
import { readDatabasePageSize } from '../preferences/preferences'

export const defaultMoveFilters = { move1: 0, move2: 0, move3: 0, move4: 0 }

export function createDefaultEncounterSearch(
  gameVersion = 0,
): EncounterDatabaseSearchRequest {
  return {
    species: 0,
    form: 0,
    version: gameVersion,
    shiny: null,
    egg: null,
    moves: { ...defaultMoveFilters },
    types: ['Egg', 'Mystery', 'Static', 'Trade', 'Slot'],
    criteria: {
      nature: -1,
      gender: -1,
      ability: -1,
      levelMin: 0,
      levelMax: 0,
      ivHp: -1,
      ivAtk: -1,
      ivDef: -1,
      ivSpa: -1,
      ivSpd: -1,
      ivSpe: -1,
    },
    batchInstructions: '',
    limit: readDatabasePageSize(),
    page: 1,
  }
}

export function createDefaultMysteryGiftSearch(
  generation = 0,
): MysteryGiftDatabaseSearchRequest {
  return {
    species: -1,
    heldItem: -1,
    format: generation,
    formatComparator: generation > 0 ? '<=' : '',
    shiny: null,
    egg: null,
    includeLegal: true,
    includeUncertain: false,
    includeIllegal: false,
    moves: { ...defaultMoveFilters },
    batchInstructions: '',
    limit: readDatabasePageSize(),
    page: 1,
  }
}
