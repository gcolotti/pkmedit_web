import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { defaultDatabasePageSize } from '../preferences/preferences'
import {
  createDefaultEncounterSearch,
  createDefaultMysteryGiftSearch,
  defaultMoveFilters,
} from './defaults'

describe('defaultMoveFilters', () => {
  it('is all zeros for move1-4', () => {
    expect(defaultMoveFilters).toEqual({ move1: 0, move2: 0, move3: 0, move4: 0 })
  })
})

describe('createDefaultEncounterSearch', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    window.localStorage.clear()
  })

  it('uses the supplied gameVersion', () => {
    const result = createDefaultEncounterSearch(45)
    expect(result.version).toBe(45)
  })

  it('defaults gameVersion to 0', () => {
    const result = createDefaultEncounterSearch()
    expect(result.version).toBe(0)
  })

  it('initialises shiny/egg to null', () => {
    const result = createDefaultEncounterSearch()
    expect(result.shiny).toBeNull()
    expect(result.egg).toBeNull()
  })

  it('starts at page 1 with all default criteria', () => {
    const result = createDefaultEncounterSearch()
    expect(result.page).toBe(1)
    expect(result.criteria.nature).toBe(-1)
    expect(result.criteria.gender).toBe(-1)
    expect(result.criteria.ability).toBe(-1)
    expect(result.criteria.levelMin).toBe(0)
    expect(result.criteria.levelMax).toBe(0)
    for (const key of ['ivHp', 'ivAtk', 'ivDef', 'ivSpa', 'ivSpd', 'ivSpe'] as const) {
      expect(result.criteria[key]).toBe(-1)
    }
  })

  it('starts with all encounter types enabled', () => {
    const result = createDefaultEncounterSearch()
    expect(result.types).toEqual(['Egg', 'Mystery', 'Static', 'Trade', 'Slot'])
  })

  it('reads page size from localStorage when set', () => {
    window.localStorage.setItem('pkmedit.database.pageSize', '50')
    const result = createDefaultEncounterSearch()
    expect(result.limit).toBe(50)
  })

  it('falls back to default page size when localStorage is empty', () => {
    const result = createDefaultEncounterSearch()
    expect(result.limit).toBe(defaultDatabasePageSize)
  })

  it('moves are initialized to a copy of defaultMoveFilters (not a reference)', () => {
    const a = createDefaultEncounterSearch()
    const b = createDefaultEncounterSearch()
    a.moves.move1 = 999
    expect(b.moves.move1).toBe(0)
  })
})

describe('createDefaultMysteryGiftSearch', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    window.localStorage.clear()
  })

  it('initialises shiny/egg to null and includes all legal/uncertain/illegal=false', () => {
    const result = createDefaultMysteryGiftSearch()
    expect(result.shiny).toBeNull()
    expect(result.egg).toBeNull()
    expect(result.includeLegal).toBe(true)
    expect(result.includeUncertain).toBe(false)
    expect(result.includeIllegal).toBe(false)
  })

  it('defaults format to 0 and formatComparator to ""', () => {
    const result = createDefaultMysteryGiftSearch()
    expect(result.format).toBe(0)
    expect(result.formatComparator).toBe('')
  })

  it('sets formatComparator to <= when generation > 0', () => {
    const result = createDefaultMysteryGiftSearch(8)
    expect(result.format).toBe(8)
    expect(result.formatComparator).toBe('<=')
  })

  it('reads page size from localStorage', () => {
    window.localStorage.setItem('pkmedit.database.pageSize', '60')
    const result = createDefaultMysteryGiftSearch()
    expect(result.limit).toBe(60)
  })
})
