import { describe, expect, it } from 'vitest'

import type { MoveDetail } from '../../types/index/index'
import {
  CAT_ICONS,
  getAvailableGenerationNumbers,
  getIntroducedGeneration,
  getMaxGeneration,
  getMoveEffectChanges,
} from './generationData'

describe('CAT_ICONS', () => {
  it('has entries for status, physical, and special categories', () => {
    expect(CAT_ICONS[0]?.[0]).toContain('state')
    expect(CAT_ICONS[1]?.[0]).toContain('physical')
    expect(CAT_ICONS[2]?.[0]).toContain('special')
  })
})

describe('getMaxGeneration', () => {
  it('returns 9 when detail is null', () => {
    expect(getMaxGeneration(null)).toBe(9)
  })

  it('returns 9 when detail has no generations', () => {
    expect(getMaxGeneration({} as MoveDetail)).toBe(9)
  })

  it('returns the maximum numeric key from generations', () => {
    const detail = { generations: { '1': {}, '5': {}, '3': {} } } as unknown as MoveDetail
    expect(getMaxGeneration(detail)).toBe(5)
  })

  it('returns at least 1', () => {
    const detail = { generations: {} } as unknown as MoveDetail
    expect(getMaxGeneration(detail)).toBe(1)
  })

  it('ignores non-numeric keys', () => {
    const detail = { generations: { abc: {}, '2': {} } } as unknown as MoveDetail
    expect(getMaxGeneration(detail)).toBe(2)
  })
})

describe('getIntroducedGeneration', () => {
  it('returns 1 when detail is null', () => {
    expect(getIntroducedGeneration(null)).toBe(1)
  })

  it('returns 1 when availability is missing', () => {
    expect(getIntroducedGeneration({} as MoveDetail)).toBe(1)
  })

  it('returns the introducedGeneration value', () => {
    const detail = { current: { availability: { introducedGeneration: 4 } } } as unknown as MoveDetail
    expect(getIntroducedGeneration(detail)).toBe(4)
  })

  it('returns 1 when availability exists but lacks introducedGeneration', () => {
    // Synthetic case: availability object present, key missing → ?? 1 fallback.
    const detail = { current: { availability: {} } } as unknown as MoveDetail
    expect(getIntroducedGeneration(detail)).toBe(1)
  })
})

describe('getAvailableGenerationNumbers', () => {
  it('returns [1..9] when no generation data', () => {
    expect(getAvailableGenerationNumbers(null)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('uses introducedGeneration and maxGeneration to bound the list', () => {
    const detail = {
      current: { availability: { introducedGeneration: 2 } },
      generations: { '2': {}, '3': {}, '5': {} },
    } as unknown as MoveDetail
    expect(getAvailableGenerationNumbers(detail)).toEqual([2, 3, 4, 5])
  })

  it('excludes unavailableInGenerations', () => {
    const detail = {
      current: {
        availability: { introducedGeneration: 1, unavailableInGenerations: [3, 5] },
      },
      generations: { '1': {}, '5': {} },
    } as unknown as MoveDetail
    expect(getAvailableGenerationNumbers(detail)).toEqual([1, 2, 4])
  })
})

describe('getMoveEffectChanges', () => {
  it('returns an empty array when detail is null', () => {
    expect(getMoveEffectChanges(null, 'en')).toEqual([])
  })

  it('returns an empty array when no generations data', () => {
    expect(getMoveEffectChanges({} as MoveDetail, 'en')).toEqual([])
  })

  it('returns changes for each generation, sorted descending', () => {
    const detail = {
      generations: {
        '3': { effectChanges: { description: { en: 'Generation 3 effect.' } } },
        '5': { effectChanges: { description: { en: 'Generation 5 effect.' } } },
        '1': { effectChanges: { description: { en: 'Generation 1 effect.' } } },
      },
    } as unknown as MoveDetail
    const result = getMoveEffectChanges(detail, 'en')
    expect(result.map((r) => r.generation)).toEqual([5, 3, 1])
    expect(result[0].text).toBe('Generation 5 effect.')
  })

  it('strips out Contest paragraphs from the effect text', () => {
    const detail = {
      generations: {
        '5': {
          effectChanges: {
            description: {
              en: 'In-battle effect paragraph.\n\nThis move is used in Pokémon Contests.\n\nAnother in-battle paragraph.',
            },
          },
        },
      },
    } as unknown as MoveDetail
    const result = getMoveEffectChanges(detail, 'en')
    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('In-battle effect paragraph.\n\nAnother in-battle paragraph.')
  })

  it('drops the entry when only Contest paragraphs are present', () => {
    const detail = {
      generations: {
        '5': {
          effectChanges: {
            description: { en: 'Only contest info here.' },
          },
        },
      },
    } as unknown as MoveDetail
    expect(getMoveEffectChanges(detail, 'en')).toEqual([])
  })

  it('uses the language parameter to pick the description', () => {
    const detail = {
      generations: {
        '5': { effectChanges: { description: { en: 'EN text.', es: 'ES text.', jp: null } } },
      },
    } as unknown as MoveDetail
    expect(getMoveEffectChanges(detail, 'en')[0].text).toBe('EN text.')
    expect(getMoveEffectChanges(detail, 'es')[0].text).toBe('ES text.')
  })

  it('skips generations whose description localizes to an empty string', () => {
    // localizedText returns '' for the requested language → text is falsy →
    // the entry is dropped from the result.
    const detail = {
      generations: {
        '5': { effectChanges: { description: { en: '', es: null, jp: null } } },
      },
    } as unknown as MoveDetail
    expect(getMoveEffectChanges(detail, 'en')).toEqual([])
  })
})
