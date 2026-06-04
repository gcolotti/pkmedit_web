import { describe, expect, it } from 'vitest'

import type { DonutFlavorEntry, DonutPreview } from '../../types/donut/donut'
import {
  computeVisibleFlavors,
  toggleFlavor,
  updateBerry,
} from './donutCreateLogic'

const flavor = (name: string, level = 1, cost = 1): DonutFlavorEntry => ({
  hash: name,
  flavor: 'sweet',
  name,
  displayName: name,
  level,
  cost,
  category: 'sweet',
})

const preview = (): DonutPreview => ({
  donutType: 0,
  stars: 0,
  levelBoost: 0,
  calories: 0,
  profile: { spicy: 0, fresh: 0, sweet: 0, bitter: 0, sour: 0 },
  budgets: {
    spicy: 0,
    fresh: 0,
    sweet: 100,
    bitter: 0,
    sour: 0,
    total: 100,
    rainbow: false,
  },
})

describe('computeVisibleFlavors', () => {
  it('returns empty array when preview is null', () => {
    expect(computeVisibleFlavors('', null, [flavor('a')])).toEqual([])
  })

  it('returns flavors filtered by case-insensitive substring on displayName', () => {
    const flavors = [flavor('Berry Smooth'), flavor('Candy Crunch'), flavor('Berry Tart')]
    const result = computeVisibleFlavors('berry', preview(), flavors)
    expect(result.map((f) => f.displayName).sort()).toEqual(['Berry Smooth', 'Berry Tart'])
  })

  it('trims the filter', () => {
    const flavors = [flavor('Berry'), flavor('Candy')]
    expect(computeVisibleFlavors('  berry  ', preview(), flavors).map((f) => f.displayName)).toEqual(['Berry'])
  })

  it('returns all available flavors when filter is empty', () => {
    const flavors = [flavor('A'), flavor('B'), flavor('C')]
    const result = computeVisibleFlavors('', preview(), flavors)
    expect(result).toHaveLength(3)
  })

  it('sorts results alphabetically by label', () => {
    const flavors = [flavor('Z'), flavor('A'), flavor('M')]
    const result = computeVisibleFlavors('', preview(), flavors)
    expect(result.map((f) => f.displayName)).toEqual(['A', 'M', 'Z'])
  })

  it('caps results at 80', () => {
    const flavors = Array.from({ length: 100 }, (_, i) => flavor(`name_${i.toString().padStart(3, '0')}`))
    const result = computeVisibleFlavors('', preview(), flavors)
    expect(result).toHaveLength(80)
  })
})

describe('updateBerry', () => {
  it('returns a new array with the value at the given index updated', () => {
    const result = updateBerry([1, 2, 3], 1, 99)
    expect(result).toEqual([1, 99, 3])
  })

  it('does not mutate the original array', () => {
    const original = [1, 2, 3]
    updateBerry(original, 0, 99)
    expect(original).toEqual([1, 2, 3])
  })

  it('returns the same values for an out-of-bounds index', () => {
    expect(updateBerry([1, 2, 3], 99, 50)).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(updateBerry([], 0, 5)).toEqual([])
  })
})

describe('toggleFlavor', () => {
  const catalog = [flavor('a'), flavor('b')]

  it('adds a hash when not present and under the limit', () => {
    expect(toggleFlavor([], 'a', catalog)).toEqual(['a'])
  })

  it('removes a hash when present', () => {
    expect(toggleFlavor(['a', 'b'], 'a', catalog)).toEqual(['b'])
  })

  it('does not exceed 3 selections', () => {
    expect(toggleFlavor(['a', 'b', 'c'], 'd', catalog)).toEqual(['a', 'b', 'c'])
  })

  it('preserves the order when adding', () => {
    expect(toggleFlavor(['a'], 'b', catalog)).toEqual(['a', 'b'])
  })

  it('preserves the order of remaining when removing from middle', () => {
    expect(toggleFlavor(['a', 'b', 'c'], 'b', catalog)).toEqual(['a', 'c'])
  })
})
