import type {
  PokemonHyperTrain,
  PokemonStats,
} from '../../types/pokemon/pokemon'

// Nature n raises stat n/5 and lowers stat n%5 over the amp order
// [Atk, Def, Spe, SpA, SpD] (PKHeX rule); equal indices = neutral nature.
// Values map into STAT_INDEX positions; [0, 0] = neutral/hp.
const AMP_TO_STAT_INDEX = [1, 2, 5, 3, 4] as const

function natureEffects(nature: number): [number, number] {
  if (nature < 0 || nature >= 25) return [0, 0]
  const up = Math.trunc(nature / 5)
  const down = nature % 5
  if (up === down) return [0, 0]
  return [AMP_TO_STAT_INDEX[up], AMP_TO_STAT_INDEX[down]]
}

const STAT_INDEX: Record<keyof PokemonStats, number> = {
  hp: 0,
  atk: 1,
  def: 2,
  spa: 3,
  spd: 4,
  spe: 5,
}

// Legends Arceus: grit-item multiplier table, indexed by min(gv + bias(iv), 10).
// Source: PKHeX GanbaruExtensions.GanbaruMultiplier / PA8.GetGanbaruStat.
const GANBARU_MUL = [0, 2, 3, 4, 7, 8, 9, 14, 15, 16, 25] as const

function gvBias(iv: number): number {
  return iv >= 31 ? 3 : iv >= 26 ? 2 : iv >= 20 ? 1 : 0
}

export function getMaxGv(iv: number): number {
  return 10 - gvBias(iv)
}

function ganbaruBonus(
  base: number,
  iv: number,
  gv: number,
  level: number,
): number {
  const mul = GANBARU_MUL[Math.min(gv + gvBias(iv), 10)]
  return Math.round((Math.sqrt(base) * mul + level) / 2.5)
}

export function calculateStatsLA(
  base: PokemonStats,
  ivs: PokemonStats,
  gvs: PokemonStats,
  level: number,
  statNature: number,
  hyperTrainedIvs?: PokemonHyperTrain,
): PokemonStats {
  const [beneficial, detrimental] = natureEffects(statNature)
  const iv = (key: keyof PokemonStats): number =>
    hyperTrainedIvs?.[key] ? 31 : ivs[key]

  function baseStatLA(key: keyof PokemonStats): number {
    if (key === 'hp') {
      // PKHeX: (int)((((level / 100f) + 1f) * base) + level)
      return Math.trunc((level / 100 + 1) * base[key] + level)
    }
    const idx = STAT_INDEX[key]
    const nature = idx === beneficial ? 1.1 : idx === detrimental ? 0.9 : 1.0
    // PKHeX: (int)((((level / 50f) + 1f) * base) / 1.5f) then floor(x * nature)
    const initial = Math.trunc(((level / 50 + 1) * base[key]) / 1.5)
    return Math.trunc(initial * nature)
  }

  return {
    hp: ganbaruBonus(base.hp, iv('hp'), gvs.hp, level) + baseStatLA('hp'),
    atk: ganbaruBonus(base.atk, iv('atk'), gvs.atk, level) + baseStatLA('atk'),
    def: ganbaruBonus(base.def, iv('def'), gvs.def, level) + baseStatLA('def'),
    spa: ganbaruBonus(base.spa, iv('spa'), gvs.spa, level) + baseStatLA('spa'),
    spd: ganbaruBonus(base.spd, iv('spd'), gvs.spd, level) + baseStatLA('spd'),
    spe: ganbaruBonus(base.spe, iv('spe'), gvs.spe, level) + baseStatLA('spe'),
  }
}

function statExperienceBonus(value: number): number {
  return Math.min(255, Math.ceil(Math.sqrt(value))) >> 2
}

export function calculateStatsGB(
  base: PokemonStats,
  ivs: PokemonStats,
  evs: PokemonStats,
  level: number,
): PokemonStats {
  function calcStat(key: keyof PokemonStats): number {
    const effort = statExperienceBonus(evs[key])
    return Math.floor(((2 * (base[key] + ivs[key]) + effort) * level) / 100) + 5
  }

  return {
    hp: calcStat('hp') + level + 5,
    atk: calcStat('atk'),
    def: calcStat('def'),
    spa: calcStat('spa'),
    spd: calcStat('spd'),
    spe: calcStat('spe'),
  }
}

const SHEDINJA = 292

export function calculateStats(
  base: PokemonStats,
  ivs: PokemonStats,
  evs: PokemonStats,
  level: number,
  statNature: number,
  isLetsGo: boolean,
  species: number,
  hyperTrainedIvs?: PokemonHyperTrain,
): PokemonStats {
  const [beneficial, detrimental] = natureEffects(statNature)

  function calcStat(key: keyof PokemonStats): number {
    const b = base[key]
    const iv = hyperTrainedIvs?.[key] ? 31 : ivs[key]
    const ev = evs[key]

    if (key === 'hp') {
      if (species === SHEDINJA) return 1
      if (isLetsGo)
        return Math.floor(((2 * b + iv) * level) / 100) + level + 10 + ev
      return (
        Math.floor(((2 * b + iv + Math.floor(ev / 4)) * level) / 100) +
        level +
        10
      )
    }

    const idx = STAT_INDEX[key]
    const nature = idx === beneficial ? 1.1 : idx === detrimental ? 0.9 : 1.0

    if (isLetsGo)
      return (
        Math.floor(Math.floor(((2 * b + iv) * level) / 100 + 5) * nature) + ev
      )
    return Math.floor(
      Math.floor(((2 * b + iv + Math.floor(ev / 4)) * level) / 100 + 5) *
        nature,
    )
  }

  return {
    hp: calcStat('hp'),
    atk: calcStat('atk'),
    def: calcStat('def'),
    spa: calcStat('spa'),
    spd: calcStat('spd'),
    spe: calcStat('spe'),
  }
}
