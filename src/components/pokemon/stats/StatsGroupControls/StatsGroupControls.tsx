import type { PokemonEffortKind } from '../../../../core/types/index/index'
import type { PokemonStats } from '../../../../core/types/pokemon/pokemon'
import { getMaxGv } from '../../../../core/utils/statCalc/statCalc'

export const effortLabelKey: Record<
  PokemonEffortKind,
  'evs' | 'avs' | 'gvs' | 'statExp'
> = {
  ev: 'evs',
  av: 'avs',
  gv: 'gvs',
  statExp: 'statExp',
}

export const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const

export function suggestGvs(ivs: PokemonStats): PokemonStats {
  return {
    hp: getMaxGv(ivs.hp),
    atk: ivs.atk === 0 ? 0 : getMaxGv(ivs.atk),
    def: getMaxGv(ivs.def),
    spa: getMaxGv(ivs.spa),
    spd: getMaxGv(ivs.spd),
    spe: ivs.spe === 0 ? 0 : getMaxGv(ivs.spe),
  }
}

export function getStatsGridCols(hyperTrainingAvailable: boolean): string {
  return hyperTrainingAvailable
    ? 'grid-cols-[auto_minmax(1.75rem,3rem)_minmax(2.25rem,3.75rem)_1.25rem_1.25rem_minmax(2.25rem,3.75rem)_1.25rem_minmax(1.75rem,3rem)]'
    : 'grid-cols-[auto_minmax(1.75rem,3rem)_minmax(2.25rem,3.75rem)_1.25rem_minmax(2.25rem,3.75rem)_1.25rem_minmax(1.75rem,3rem)]'
}

export function updateEffortStats(
  evs: PokemonStats,
  key: keyof PokemonStats,
  value: number,
  isStatExp: boolean,
): PokemonStats {
  const next = { ...evs, [key]: value }
  if (isStatExp && (key === 'spa' || key === 'spd')) {
    next.spa = value
    next.spd = value
  }
  return next
}

export const headerClassName = 'label text-center text-[0.65rem]'
export const readOnlyClassName =
  'field-readonly flex h-9 items-center justify-center px-1 py-0 text-center tabular-nums text-xs leading-none'
export const inputClassName =
  'field h-9 px-2 py-0 text-center text-sm font-bold leading-none'
