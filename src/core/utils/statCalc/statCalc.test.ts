import { describe, expect, it } from 'vitest'

import type {
  PokemonHyperTrain,
  PokemonStats,
} from '../../types/pokemon/pokemon'
import {
  calculateStats,
  calculateStatsGB,
  calculateStatsLA,
  getMaxGv,
} from './statCalc'

const ZERO_STATS: PokemonStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
const ZERO_HT: PokemonHyperTrain = {
  hp: false,
  atk: false,
  def: false,
  spa: false,
  spd: false,
  spe: false,
}
const NEUTRAL = 0 // Hardy: nature with no up/down
const LONELY = 1 // up atk, down def
const BOLD = 5 // up def, down atk

describe('getMaxGv', () => {
  it('returns 10 for low IVs (bias 0)', () => {
    expect(getMaxGv(0)).toBe(10)
    expect(getMaxGv(19)).toBe(10)
  })

  it('returns 9 for IVs in [20, 25] (bias 1)', () => {
    expect(getMaxGv(20)).toBe(9)
    expect(getMaxGv(25)).toBe(9)
  })

  it('returns 8 for IVs in [26, 30] (bias 2)', () => {
    expect(getMaxGv(26)).toBe(8)
    expect(getMaxGv(30)).toBe(8)
  })

  it('returns 7 for IV of 31 (bias 3)', () => {
    expect(getMaxGv(31)).toBe(7)
  })
})

describe('calculateStatsLA', () => {
  it('returns higher stats than the inputs would suggest (ganbaru + baseStatLA)', () => {
    const base: PokemonStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 }
    const result = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    expect(result.hp).toBeGreaterThan(0)
    expect(result.atk).toBeGreaterThan(0)
    expect(result.def).toBeGreaterThan(0)
    expect(result.spa).toBeGreaterThan(0)
    expect(result.spd).toBeGreaterThan(0)
    expect(result.spe).toBeGreaterThan(0)
  })

  it('produces higher atk under a beneficial atk nature than a neutral one', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const neutral = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    const beneficial = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, LONELY)
    expect(beneficial.atk).toBeGreaterThan(neutral.atk)
  })

  it('produces lower atk under a detrimental atk nature', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const neutral = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    const detrimental = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, BOLD)
    expect(detrimental.atk).toBeLessThan(neutral.atk)
  })

  it('Lonely (up atk, down def) raises atk AND lowers def together', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 100, spa: 0, spd: 0, spe: 0 }
    const neutral = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    const lonely = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, LONELY)
    expect(lonely.atk).toBeGreaterThan(neutral.atk)
    expect(lonely.def).toBeLessThan(neutral.def)
  })

  it('Bold (up def, down atk) lowers atk AND raises def together', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 100, spa: 0, spd: 0, spe: 0 }
    const neutral = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    const bold = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, BOLD)
    expect(bold.atk).toBeLessThan(neutral.atk)
    expect(bold.def).toBeGreaterThan(neutral.def)
  })

  it('treats unknown nature index as neutral (no up/down applied)', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 100, spa: 0, spd: 0, spe: 0 }
    const neutral = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL)
    const unknown = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 50, 999)
    expect(neutral.atk).toBe(unknown.atk)
    expect(neutral.def).toBe(unknown.def)
  })

  it('uses hyper-trained IV (31) when set, overriding the supplied IV', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivsLow: PokemonStats = { ...ZERO_STATS, atk: 0 }
    const ivsHigh: PokemonStats = { ...ZERO_STATS, atk: 31 }
    const ht: PokemonHyperTrain = { ...ZERO_HT, atk: true }
    const withoutHT = calculateStatsLA(base, ivsLow, ZERO_STATS, 50, NEUTRAL)
    const withHT = calculateStatsLA(base, ivsLow, ZERO_STATS, 50, NEUTRAL, ht)
    const highIV = calculateStatsLA(base, ivsHigh, ZERO_STATS, 50, NEUTRAL)
    expect(withHT.atk).toBe(highIV.atk)
    expect(withHT.atk).toBeGreaterThan(withoutHT.atk)
  })

  it('stats scale with level', () => {
    const base: PokemonStats = { hp: 100, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const low = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 10, NEUTRAL)
    const high = calculateStatsLA(base, ZERO_STATS, ZERO_STATS, 100, NEUTRAL)
    expect(high.hp).toBeGreaterThan(low.hp)
    expect(high.atk).toBeGreaterThan(low.atk)
  })
})

describe('calculateStatsGB', () => {
  it('returns higher stats than the inputs would suggest', () => {
    const base: PokemonStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 }
    const result = calculateStatsGB(base, ZERO_STATS, ZERO_STATS, 50)
    expect(result.hp).toBeGreaterThan(0)
    for (const key of ['atk', 'def', 'spa', 'spd', 'spe'] as const) {
      expect(result[key]).toBeGreaterThan(0)
    }
  })

  it('HP is the only stat that includes level+5 twice', () => {
    // calcStat returns +5 for everything; HP additionally adds level+5.
    // For base=iv=ev=0 at level 50: HP = 0 + 50 + 5 + 5 = 60
    const base: PokemonStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const result = calculateStatsGB(base, ZERO_STATS, ZERO_STATS, 50)
    expect(result.hp).toBe(60)
    expect(result.atk).toBe(5)
  })

  it('EV effort saturates around max EVs (252 vs 255 give same result)', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs252 = { ...ZERO_STATS, atk: 252 }
    const evs255 = { ...ZERO_STATS, atk: 255 }
    const r252 = calculateStatsGB(base, ZERO_STATS, evs252, 50)
    const r255 = calculateStatsGB(base, ZERO_STATS, evs255, 50)
    expect(r252.atk).toBe(r255.atk)
  })

  it('effort bonus increases with EVs (capped)', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs0 = { ...ZERO_STATS, atk: 0 }
    const evs100 = { ...ZERO_STATS, atk: 100 }
    const evs252 = { ...ZERO_STATS, atk: 252 }
    const r0 = calculateStatsGB(base, ZERO_STATS, evs0, 50)
    const r100 = calculateStatsGB(base, ZERO_STATS, evs100, 50)
    const r252 = calculateStatsGB(base, ZERO_STATS, evs252, 50)
    expect(r100.atk).toBeGreaterThan(r0.atk)
    expect(r252.atk).toBeGreaterThan(r100.atk)
  })

  it('returns all six stats', () => {
    const base: PokemonStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 }
    const result = calculateStatsGB(base, ZERO_STATS, ZERO_STATS, 50)
    expect(Object.keys(result).sort()).toEqual(['atk', 'def', 'hp', 'spa', 'spd', 'spe'])
  })
})

describe('calculateStats', () => {
  it('forces HP=1 for Shedinja regardless of base/iv/ev', () => {
    const base: PokemonStats = { hp: 200, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivs: PokemonStats = { hp: 31, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs: PokemonStats = { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    expect(calculateStats(base, ivs, evs, 100, NEUTRAL, false, 292).hp).toBe(1)
  })

  it('non-Shedinja species never returns HP=1', () => {
    const base: PokemonStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const result = calculateStats(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL, false, 1)
    expect(result.hp).not.toBe(1)
    expect(result.hp).toBeGreaterThan(0)
  })

  it("Let's Go HP formula is floor(((2*base+iv)*level)/100) + level + 10 + ev", () => {
    const base: PokemonStats = { hp: 100, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivs: PokemonStats = { hp: 31, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs: PokemonStats = { hp: 100, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    // floor(((200+31)*50)/100) + 50 + 10 + 100 = 115 + 160 = 275
    const result = calculateStats(base, ivs, evs, 50, NEUTRAL, true, 1)
    expect(result.hp).toBe(275)
  })

  it("Let's Go EV is added after nature (not floored through)", () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs: PokemonStats = { ...ZERO_STATS, atk: 100 }
    // base = floor(((200+0)*50)/100) + 5 = 105; * 1.0 = 105; + 100 = 205
    const result = calculateStats(base, ZERO_STATS, evs, 50, NEUTRAL, true, 1)
    expect(result.atk).toBe(205)
  })

  it('standard HP formula uses floor(ev/4) bonus', () => {
    const base: PokemonStats = { hp: 100, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivs: PokemonStats = { hp: 31, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs: PokemonStats = { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    // floor(((200 + 31 + 63) * 50) / 100) + 50 + 10 = 147 + 60 = 207
    const result = calculateStats(base, ivs, evs, 50, NEUTRAL, false, 1)
    expect(result.hp).toBe(207)
  })

  it("Let's Go bonus is +level+10+ev, not +level+10 alone", () => {
    const base: PokemonStats = { hp: 100, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivs: PokemonStats = { hp: 31, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs0: PokemonStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs100: PokemonStats = { hp: 100, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    const r0 = calculateStats(base, ivs, evs0, 50, NEUTRAL, true, 1)
    const r100 = calculateStats(base, ivs, evs100, 50, NEUTRAL, true, 1)
    expect(r100.hp - r0.hp).toBe(100)
  })

  it('neutral nature for non-HP non-LetsGo = floor(((2b+iv+floor(ev/4))*lvl)/100) + 5', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivs: PokemonStats = { hp: 0, atk: 31, def: 0, spa: 0, spd: 0, spe: 0 }
    const evs: PokemonStats = { hp: 0, atk: 252, def: 0, spa: 0, spd: 0, spe: 0 }
    // floor(((200 + 31 + 63) * 50) / 100) + 5 = 147 + 5 = 152
    const result = calculateStats(base, ivs, evs, 50, NEUTRAL, false, 1)
    expect(result.atk).toBe(152)
  })

  it('Lonely nature raises atk, lowers def (NEUTRAL species)', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 100, spa: 0, spd: 0, spe: 0 }
    const result = calculateStats(base, ZERO_STATS, ZERO_STATS, 50, LONELY, false, 1)
    // neutral atk = floor(((200+0+0)*50)/100)+5 = 100+5 = 105
    // beneficial atk = floor(105*1.1) = 115
    // neutral def = 105; detrimental = floor(105*0.9) = 94
    expect(result.atk).toBe(115)
    expect(result.def).toBe(94)
  })

  it('hyper-trained IV replaces the supplied IV (matches iv=31 result)', () => {
    const base: PokemonStats = { hp: 0, atk: 100, def: 0, spa: 0, spd: 0, spe: 0 }
    const ivsLow: PokemonStats = { ...ZERO_STATS, atk: 0 }
    const ivsHigh: PokemonStats = { ...ZERO_STATS, atk: 31 }
    const ht: PokemonHyperTrain = { ...ZERO_HT, atk: true }
    const withHT = calculateStats(base, ivsLow, ZERO_STATS, 50, NEUTRAL, false, 1, ht)
    const highIV = calculateStats(base, ivsHigh, ZERO_STATS, 50, NEUTRAL, false, 1)
    expect(withHT.atk).toBe(highIV.atk)
  })

  it('unknown nature index is treated as neutral for all stats', () => {
    const base: PokemonStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 }
    const neutral = calculateStats(base, ZERO_STATS, ZERO_STATS, 50, NEUTRAL, false, 1)
    const unknown = calculateStats(base, ZERO_STATS, ZERO_STATS, 50, 999, false, 1)
    expect(unknown).toEqual(neutral)
  })
})
