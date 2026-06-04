import type { DonutDraft } from '../../types/donut/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  PokedexActionKey,
} from '../../types/index/index'

export function buildPokedexActionsPayload(keys?: PokedexActionKey[] | null) {
  if (!keys?.length) return null
  return {
    targets: keys.map(({ dexId, action }) => ({ dexId, action })),
  }
}

export function buildArceusResearchActionsPayload(
  keys?: ArceusResearchActionKey[] | null,
  bulk?: ArceusResearchBulkAction[] | null,
) {
  const hasKeys = (keys?.length ?? 0) > 0
  const hasBulk = (bulk?.length ?? 0) > 0
  if (!hasKeys && !hasBulk) return null
  return {
    targets:
      keys?.map(({ species, action, taskIndex }) => ({
        species,
        action,
        taskIndex: taskIndex ?? null,
      })) ?? [],
    markAllPerfect: bulk?.includes('markAllPerfect') ?? false,
    markAllComplete: bulk?.includes('markAllComplete') ?? false,
  }
}

export function buildDonutPayload(
  donutDrafts: DonutDraft[] | null | undefined,
) {
  if (!donutDrafts?.length) return null
  return donutDrafts.map(
    ({ berries, berryName, flavor0, flavor1, flavor2 }) => ({
      berries,
      berryName,
      flavor0,
      flavor1,
      flavor2,
    }),
  )
}
