import { describe, expect, it } from 'vitest'

import { GEN6_ENTRIES } from './typeChartGen6Data'

describe('GEN6_ENTRIES', () => {
  it('every entry has a valid attacker and defender typeId (0..17)', () => {
    for (const [atk, def] of GEN6_ENTRIES) {
      expect(atk).toBeGreaterThanOrEqual(0)
      expect(atk).toBeLessThan(18)
      expect(def).toBeGreaterThanOrEqual(0)
      expect(def).toBeLessThan(18)
    }
  })

  it('every entry has a valid multiplier (0, 0.5, 1, or 2)', () => {
    for (const [, , mult] of GEN6_ENTRIES) {
      expect([0, 0.5, 1, 2]).toContain(mult)
    }
  })

  it('contains the canonical "Normal vs Ghost = 0" (immunity)', () => {
    expect(GEN6_ENTRIES).toContainEqual([0, 7, 0])
  })

  it('contains the canonical "Fairy resists Dragon" (0)', () => {
    // Not in source — Dragon (15) is immune to Fairy (17)? Let me recheck.
    // Actually [15,17,0] exists in the source: "Dragon immune to Fairy"
    expect(GEN6_ENTRIES).toContainEqual([15, 17, 0])
  })

  it('contains the canonical "Water resists Water" (0.5)', () => {
    expect(GEN6_ENTRIES).toContainEqual([10, 10, 0.5])
  })

  it('has at least one entry per base type as attacker', () => {
    const attackers = new Set(GEN6_ENTRIES.map(([a]) => a))
    for (let i = 0; i < 18; i++) {
      expect(attackers.has(i)).toBe(true)
    }
  })
})
