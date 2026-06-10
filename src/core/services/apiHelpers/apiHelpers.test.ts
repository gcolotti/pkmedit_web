import { describe, expect, it } from 'vitest'

import {
  buildArceusResearchActionsPayload,
  buildDonutPayload,
  buildPokedexActionsPayload,
} from './apiHelpers'

describe('buildPokedexActionsPayload', () => {
  it('returns null when keys is undefined or null', () => {
    expect(buildPokedexActionsPayload()).toBeNull()
    expect(buildPokedexActionsPayload(null)).toBeNull()
  })

  it('returns null when keys is empty', () => {
    expect(buildPokedexActionsPayload([])).toBeNull()
  })

  it('maps keys to { dexId, action } targets', () => {
    const result = buildPokedexActionsPayload([
      { dexId: 'national', action: 'seen' },
      { dexId: 'all', action: 'complete' },
    ])
    expect(result).toEqual({
      targets: [
        { dexId: 'national', action: 'seen' },
        { dexId: 'all', action: 'complete' },
      ],
    })
  })
})

describe('buildArceusResearchActionsPayload', () => {
  it('returns null when both keys and bulk are missing/empty', () => {
    expect(buildArceusResearchActionsPayload()).toBeNull()
    expect(buildArceusResearchActionsPayload(null, null)).toBeNull()
    expect(buildArceusResearchActionsPayload([], [])).toBeNull()
  })

  it('returns null when keys is empty and bulk is missing', () => {
    expect(buildArceusResearchActionsPayload([])).toBeNull()
  })

  it('produces targets from keys with taskIndex null when missing', () => {
    const result = buildArceusResearchActionsPayload([
      { species: 25, action: 'completeTask', taskIndex: 2 },
      { species: 26, action: 'completeSpecies' },
    ])
    expect(result?.targets).toEqual([
      { species: 25, action: 'completeTask', taskIndex: 2 },
      { species: 26, action: 'completeSpecies', taskIndex: null },
    ])
  })

  it('produces targets = [] when keys is undefined but bulk is present', () => {
    const result = buildArceusResearchActionsPayload(undefined, ['markAllPerfect'])
    expect(result?.targets).toEqual([])
    expect(result?.markAllPerfect).toBe(true)
    expect(result?.markAllComplete).toBe(false)
  })

  it('marks markAllPerfect / markAllComplete based on bulk presence', () => {
    const result = buildArceusResearchActionsPayload([], ['markAllPerfect', 'markAllComplete'])
    expect(result?.markAllPerfect).toBe(true)
    expect(result?.markAllComplete).toBe(true)
  })

  it('omits flags that are not in the bulk array', () => {
    const result = buildArceusResearchActionsPayload([], ['markAllComplete'])
    expect(result?.markAllPerfect).toBe(false)
    expect(result?.markAllComplete).toBe(true)
  })
})

describe('buildDonutPayload', () => {
  it('returns null when undefined, null, or empty', () => {
    expect(buildDonutPayload(undefined)).toBeNull()
    expect(buildDonutPayload(null)).toBeNull()
    expect(buildDonutPayload([])).toBeNull()
  })

  it('maps each draft to { berries, berryName, flavor0..2 }', () => {
    const result = buildDonutPayload([
      {
        id: 'a',
        label: 'X',
        berries: [1, 2],
        berryName: 10,
        flavor0: 0,
        flavor1: 1,
        flavor2: 2,
      } as never,
    ])
    expect(result).toEqual([
      { berries: [1, 2], berryName: 10, flavor0: 0, flavor1: 1, flavor2: 2 },
    ])
  })
})
