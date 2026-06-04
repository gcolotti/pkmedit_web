/**
 * Type effectiveness matrices.
 * Index order matches TYPE_LABEL_KEYS in typeData.ts:
 * 0=Normal 1=Fighting 2=Flying 3=Poison 4=Ground 5=Rock
 * 6=Bug 7=Ghost 8=Steel 9=Fire 10=Water 11=Grass
 * 12=Electric 13=Psychic 14=Ice 15=Dragon 16=Dark 17=Fairy
 *
 * chart[attacker][defender] = multiplier (0 | 0.5 | 1 | 2)
 */

const TYPE_COUNT = 18

function buildChart(entries: [number, number, number][]): number[][] {
  const chart: number[][] = Array.from({ length: TYPE_COUNT }, () =>
    Array.from<number>({ length: TYPE_COUNT }).fill(1),
  )
  for (const [atk, def, mult] of entries) {
    chart[atk][def] = mult
  }
  return chart
}

import { GEN6_ENTRIES } from './typeChartGen6Data'

/** Gen 2-5 changes vs Gen 6+: Steel resists Ghost and Dark; no Fairy */
const GEN2_EXTRA: [number, number, number][] = [
  [7, 8, 0.5], // Ghost vs Steel: resisted
  [16, 8, 0.5], // Dark vs Steel: resisted
]
const GEN2_REMOVE = new Set([
  // Fairy interactions
  `1,17`,
  `3,17`,
  `6,17`,
  `8,17`,
  `15,17`,
  `16,17`,
  `17,1`,
  `17,3`,
  `17,8`,
  `17,9`,
  `17,15`,
  `17,16`,
])

/** Gen 1 changes vs Gen 2-5: no Steel/Dark, Ghost bugs, Poison/Bug changes */
const GEN1_EXTRA: [number, number, number][] = [
  [7, 13, 0], // Ghost vs Psychic: immune (game bug)
  [3, 6, 2], // Poison vs Bug: super effective
  [6, 3, 2], // Bug vs Poison: super effective (changed to 0.5 in Gen 2)
]
const GEN1_REMOVE_TYPES = new Set([8, 16, 17]) // Steel, Dark, Fairy

export type GenKey = 'gen1' | 'gen2' | 'gen6'

export const GEN_LABELS: Record<GenKey, string> = {
  gen1: 'Gen 1',
  gen2: 'Gen 2–5',
  gen6: 'Gen 6+',
}

/** Types available per generation (indices into TYPE_LABEL_KEYS) */
export const GEN_TYPES: Record<GenKey, number[]> = {
  gen1: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15],
  gen2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  gen6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
}

function buildGen6Chart(): number[][] {
  return buildChart(GEN6_ENTRIES)
}

function buildGen2Chart(): number[][] {
  const filtered = GEN6_ENTRIES.filter(
    ([atk, def]) => !GEN2_REMOVE.has(`${atk},${def}`),
  )
  return buildChart([...filtered, ...GEN2_EXTRA])
}

function buildGen1Chart(): number[][] {
  const base = buildGen2Chart()
  // Reset Steel/Dark/Fairy rows and columns to 1
  for (let i = 0; i < TYPE_COUNT; i++) {
    for (const t of GEN1_REMOVE_TYPES) {
      base[t][i] = 1
      base[i][t] = 1
    }
  }
  // Apply Gen 1-specific overrides
  for (const [atk, def, mult] of GEN1_EXTRA) {
    base[atk][def] = mult
  }
  return base
}

export const TYPE_CHARTS: Record<GenKey, number[][]> = {
  gen6: buildGen6Chart(),
  gen2: buildGen2Chart(),
  gen1: buildGen1Chart(),
}
