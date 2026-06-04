import {
  POKEDEX_ACTION_ORDER,
  POKEDEX_GLOBAL_DEX_ID,
} from '../../../core/services/pokedexActionUtils'
import type {
  PokedexActionName,
  PokedexActionStatus,
  PokedexDexStatus,
  PokedexStatusResponse,
} from '../../../core/types/index'

export function buildGlobalDex(
  status: PokedexStatusResponse,
): PokedexDexStatus | null {
  if (status.dexes.length <= 1) return null
  if (status.dexes.some((dex) => dex.scope === 'national')) return null

  const supportedActions = POKEDEX_ACTION_ORDER.filter((action) =>
    status.dexes.some((dex) => dex.supportedActions.includes(action)),
  )

  return {
    id: POKEDEX_GLOBAL_DEX_ID,
    label: POKEDEX_GLOBAL_DEX_ID,
    scope: 'global',
    totalSpecies: status.dexes.reduce(
      (total, dex) => total + dex.totalSpecies,
      0,
    ),
    supportedActions,
    actions: supportedActions.map((action) =>
      aggregateActionStatus(action, status.dexes),
    ),
  }
}

function aggregateActionStatus(
  action: PokedexActionName,
  dexes: PokedexDexStatus[],
): PokedexActionStatus {
  const actionStatuses = dexes
    .map((dex) => dex.actions.find((item) => item.action === action))
    .filter((item): item is PokedexActionStatus => item !== undefined)

  const total = actionStatuses.reduce((sum, item) => sum + item.total, 0)

  return {
    action,
    count: actionStatuses.reduce((sum, item) => sum + item.count, 0),
    total,
    complete:
      actionStatuses.length > 0 &&
      total > 0 &&
      actionStatuses.every((item) => item.complete),
  }
}
