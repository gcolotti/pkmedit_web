import type { PokemonDetail } from '../../core/types/index'
import type { PokemonStats } from '../../core/types/pokemon'
import {
  calculateStats,
  calculateStatsGB,
  calculateStatsLA,
} from '../../core/utils/statCalc'

export function computeDraftStats(
  draft: PokemonDetail | null,
): PokemonStats | null {
  if (!draft) return null
  if (draft.effortKind === 'gv')
    return calculateStatsLA(
      draft.baseStats,
      draft.ivs,
      draft.evs,
      draft.summary.level,
      draft.main.statNature,
      draft.hyperTrainedIvs,
    )
  if (draft.effortKind === 'statExp')
    return calculateStatsGB(
      draft.baseStats,
      draft.ivs,
      draft.evs,
      draft.summary.level,
    )
  return calculateStats(
    draft.baseStats,
    draft.ivs,
    draft.evs,
    draft.summary.level,
    draft.main.statNature,
    draft.effortKind === 'av',
    draft.summary.species,
    draft.hyperTrainedIvs,
  )
}
