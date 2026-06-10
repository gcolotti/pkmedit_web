import { describe, expect, it } from 'vitest'

import type {
  DonutFlavorBudgets,
  DonutFlavorEntry,
  DonutPreview,
} from '../../types/donut/donut'
import {
  availableHighestFlavorLevels,
  hasSelectedFlavorCategory,
} from './donutFlavorLabels'

const flavor = (
  hash: string,
  flavorKey: string,
  name: string,
  level: number,
  cost: number,
  category = 'sweet',
): DonutFlavorEntry => ({
  hash,
  flavor: flavorKey,
  name,
  displayName: name,
  level,
  cost,
  category,
})

const preview = (budgets: Partial<DonutFlavorBudgets>): DonutPreview => ({
  donutType: 0,
  stars: 0,
  levelBoost: 0,
  calories: 0,
  profile: { spicy: 0, fresh: 0, sweet: 0, bitter: 0, sour: 0 },
  budgets: {
    spicy: 0,
    fresh: 0,
    sweet: 0,
    bitter: 0,
    sour: 0,
    total: 0,
    rainbow: false,
    ...budgets,
  },
})

describe('availableHighestFlavorLevels', () => {
  it('keeps only the highest level for each flavor identity', () => {
    const flavors = [
      flavor('a', 'sweet', 'berry_basic', 1, 5),
      flavor('b', 'sweet', 'berry_basic', 3, 15),
      flavor('c', 'sweet', 'berry_basic', 2, 10),
    ]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 50, total: 50 }),
    )
    expect(result.map((f) => f.hash)).toEqual(['b'])
  })

  it('groups by flavor + name (not just name) to allow multiple entries per category', () => {
    const flavors = [
      flavor('a', 'sweet', 'berry_basic', 5, 20),
      flavor('b', 'sweet', 'sprinkle_advanced', 1, 5),
    ]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 100, total: 100 }),
    )
    expect(result.map((f) => f.hash).sort()).toEqual(['a', 'b'])
  })

  it('excludes flavors marked sp (spicy suffix handled)', () => {
    const flavors = [
      flavor('a', 'sp', 'pepper_basic', 3, 10),
      flavor('b', 'sweet', 'candy_basic', 1, 5),
    ]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 50, total: 50 }),
    )
    expect(result.map((f) => f.hash)).toEqual(['b'])
  })

  it('excludes flavors whose cost exceeds the per-flavor budget', () => {
    const flavors = [flavor('a', 'sweet', 'candy_basic', 1, 100)]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 10, total: 1000 }),
    )
    expect(result).toEqual([])
  })

  it('excludes flavors whose cost exceeds the total budget', () => {
    const flavors = [flavor('a', 'sweet', 'candy_basic', 1, 50)]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 100, total: 30 }),
    )
    expect(result).toEqual([])
  })

  it('excludes flavors with cost <= 0', () => {
    const flavors = [
      flavor('a', 'sweet', 'candy_basic', 1, 0),
      flavor('b', 'sweet', 'candy_advanced', 1, 5),
    ]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 100, total: 100 }),
    )
    expect(result.map((f) => f.hash)).toEqual(['b'])
  })

  it('falls back to 0 budget for unknown flavor keys', () => {
    const flavors = [flavor('a', 'mystery', 'xxx_yyy', 1, 1)]
    // No entry in BUDGET_BY_FLAVOR for 'mystery' → budgetKey = undefined → flavorBudget = 0
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ total: 100 }),
    )
    expect(result).toEqual([])
  })

  it('falls back to whole name when no underscore split is possible', () => {
    // 'name' has no '_'; the key uses the whole name
    const flavors = [flavor('a', 'sweet', 'lonely', 1, 5)]
    const result = availableHighestFlavorLevels(
      flavors,
      preview({ sweet: 10, total: 10 }),
    )
    expect(result).toHaveLength(1)
  })

  it('returns empty when no flavors are given', () => {
    expect(availableHighestFlavorLevels([], preview({ total: 100 }))).toEqual(
      [],
    )
  })
})

describe('hasSelectedFlavorCategory', () => {
  const flavors: DonutFlavorEntry[] = [
    flavor('a', 'sweet', 'candy', 1, 5, 'sweet-cat'),
    flavor('b', 'sour', 'lemon', 1, 5, 'sour-cat'),
  ]

  it('returns true when any selected hash maps to the category', () => {
    expect(hasSelectedFlavorCategory(['a', 'x'], flavors, 'sweet-cat')).toBe(
      true,
    )
  })

  it('returns false when no selected hash matches the category', () => {
    expect(hasSelectedFlavorCategory(['a'], flavors, 'sour-cat')).toBe(false)
  })

  it('returns false when selected is empty', () => {
    expect(hasSelectedFlavorCategory([], flavors, 'sweet-cat')).toBe(false)
  })

  it('returns false when hash references a non-existent flavor', () => {
    expect(hasSelectedFlavorCategory(['zzz'], flavors, 'sweet-cat')).toBe(false)
  })
})
