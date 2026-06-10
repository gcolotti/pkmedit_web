import { describe, expect, it } from 'vitest'

import { GEN_LABELS, GEN_TYPES, TYPE_CHARTS } from './typeChartData'

describe('GEN_LABELS', () => {
  it('has the expected labels for each gen', () => {
    expect(GEN_LABELS.gen1).toBe('Gen 1')
    expect(GEN_LABELS.gen2).toBe('Gen 2–5')
    expect(GEN_LABELS.gen6).toBe('Gen 6+')
  })
})

describe('GEN_TYPES', () => {
  it('lists the correct number of types for each generation', () => {
    expect(GEN_TYPES.gen1).toHaveLength(15)
    expect(GEN_TYPES.gen2).toHaveLength(17)
    expect(GEN_TYPES.gen6).toHaveLength(18)
  })

  it('gen1 excludes Steel, Dark, Fairy', () => {
    expect(GEN_TYPES.gen1).not.toContain(8)
    expect(GEN_TYPES.gen1).not.toContain(16)
    expect(GEN_TYPES.gen1).not.toContain(17)
  })

  it('gen2 includes Steel and Dark but not Fairy', () => {
    expect(GEN_TYPES.gen2).toContain(8)
    expect(GEN_TYPES.gen2).toContain(16)
    expect(GEN_TYPES.gen2).not.toContain(17)
  })

  it('gen6 includes all 18 types', () => {
    expect([...GEN_TYPES.gen6].sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    ])
  })
})

describe('TYPE_CHARTS', () => {
  it('each chart is 18x18', () => {
    for (const gen of ['gen1', 'gen2', 'gen6'] as const) {
      expect(TYPE_CHARTS[gen]).toHaveLength(18)
      for (const row of TYPE_CHARTS[gen]) {
        expect(row).toHaveLength(18)
      }
    }
  })

  it('every cell is one of 0, 0.5, 1, 2', () => {
    for (const gen of ['gen1', 'gen2', 'gen6'] as const) {
      for (const row of TYPE_CHARTS[gen]) {
        for (const cell of row) {
          expect([0, 0.5, 1, 2]).toContain(cell)
        }
      }
    }
  })

  it('gen6 has the standard "Ghost immune to Normal" and "Normal immune to Ghost"', () => {
    // Ghost (7) vs Normal (0): 0 (immune in gen6)
    expect(TYPE_CHARTS.gen6[7][0]).toBe(0)
    // Normal (0) vs Ghost (7): 0
    expect(TYPE_CHARTS.gen6[0][7]).toBe(0)
  })

  it('gen2 reflects the gen1 "Ghost vs Steel = 0.5" but Fairy does not exist', () => {
    // Ghost (7) vs Steel (8) in gen2 = 0.5
    expect(TYPE_CHARTS.gen2[7][8]).toBe(0.5)
  })

  it('gen1 has no Steel/Dark/Fairy interactions (all 1 in those rows/cols)', () => {
    for (const t of [8, 16, 17]) {
      for (let i = 0; i < 18; i++) {
        expect(TYPE_CHARTS.gen1[t][i]).toBe(1)
        expect(TYPE_CHARTS.gen1[i][t]).toBe(1)
      }
    }
  })

  it('gen1 has Ghost vs Psychic = 0 (game bug)', () => {
    expect(TYPE_CHARTS.gen1[7][13]).toBe(0)
  })

  it('gen2+ removes the gen1 "Poison vs Bug = 2" and "Bug vs Poison = 2"', () => {
    // gen2: Poison (3) vs Bug (6) → should not be 2
    expect(TYPE_CHARTS.gen2[3][6]).not.toBe(2)
    expect(TYPE_CHARTS.gen2[6][3]).not.toBe(2)
  })
})
