import { describe, expect, it } from 'vitest'

import {
  buildDefensiveRows,
  getOrderedTypes,
  WIKIDEX_TYPE_ORDER,
} from './typeChartHelpers'

describe('WIKIDEX_TYPE_ORDER', () => {
  it('contains 18 unique type ids 0..17', () => {
    expect(new Set(WIKIDEX_TYPE_ORDER).size).toBe(18)
    const sorted = [...WIKIDEX_TYPE_ORDER].sort((a, b) => a - b)
    expect(sorted).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
  })
})

describe('getOrderedTypes', () => {
  it('returns WIKIDEX_TYPE_ORDER filtered to gen6 types (all 18)', () => {
    expect(getOrderedTypes('gen6')).toEqual([...WIKIDEX_TYPE_ORDER])
  })

  it('filters out types not in gen2 (excludes Fairy = 17)', () => {
    const result = getOrderedTypes('gen2')
    expect(result).not.toContain(17)
    expect(result.every((id) => id !== 17)).toBe(true)
  })

  it('filters out Steel, Dark, and Fairy for gen1', () => {
    const result = getOrderedTypes('gen1')
    expect(result).not.toContain(8)
    expect(result).not.toContain(16)
    expect(result).not.toContain(17)
  })

  it('preserves the WIKIDEX order after filtering', () => {
    const result = getOrderedTypes('gen1')
    // WIKIDEX_TYPE_ORDER is a readonly tuple of literal numbers; indexOf
    // returns the union of those literals, which TypeScript won't narrow
    // against `number`. Cast the array to a plain number[] for indexOf.
    const wikidex = WIKIDEX_TYPE_ORDER as readonly number[]
    const indicesInWikidex = result.map((t) => wikidex.indexOf(t))
    const sorted = [...indicesInWikidex].sort((a, b) => a - b)
    expect(indicesInWikidex).toEqual(sorted)
  })
})

describe('buildDefensiveRows', () => {
  it('produces a single row for the primary type only', () => {
    const rows = buildDefensiveRows([], 9)
    expect(rows).toEqual([{ key: '9', primaryType: 9 }])
  })

  it('produces rows for the primary type plus each combination with secondary types', () => {
    const rows = buildDefensiveRows([10, 11], 9)
    expect(rows).toEqual([
      { key: '9', primaryType: 9 },
      { key: '9-10', primaryType: 9, secondaryType: 10 },
      { key: '9-11', primaryType: 9, secondaryType: 11 },
    ])
  })

  it('does not duplicate the primary type as a secondary', () => {
    const rows = buildDefensiveRows([9, 10], 9)
    expect(rows.filter((r) => r.secondaryType === 9)).toHaveLength(0)
  })
})
