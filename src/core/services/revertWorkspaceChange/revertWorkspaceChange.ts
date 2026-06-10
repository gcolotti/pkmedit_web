import type { Dispatch, SetStateAction } from 'react'

import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  DraftChange,
  PokedexActionKey,
  PokemonDetail,
} from '../../types/index/index'
import {
  parseArceusResearchActionSlotId,
  parseArceusResearchBulkSlotId,
} from '../arceusResearchActionUtils/arceusResearchActionUtils'
import { hasPokemonChanged } from '../draftChanges/draftChanges'
import { revertDraftPath } from '../draftPathUtils/draftPathUtils'
import { parsePokedexActionSlotId } from '../pokedexActionUtils/pokedexActionUtils'

export type RevertWorkspaceChangeCallbacks = {
  revertTrainerEdit: () => void
  revertItemsEdit: () => void
  revertMysteryGiftEdit: (id: string) => void
  revertPokedexAction: (key: PokedexActionKey) => void
  revertDonutDraft: (id: string) => void
  revertMetDateFixerDraft: () => void
  revertUndergroundDraft: () => void
  revertRaidsDraft: () => void
  revertArceusResearchAction: (key: ArceusResearchActionKey) => void
  revertArceusResearchBulk: (action: ArceusResearchBulkAction) => void
}

export function revertWorkspaceChange(
  change: DraftChange,
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  setDrafts: Dispatch<SetStateAction<Record<string, PokemonDetail>>>,
  callbacks: RevertWorkspaceChangeCallbacks,
) {
  if (change.slotId === '__trainer__') return callbacks.revertTrainerEdit()
  if (change.slotId === '__items__') return callbacks.revertItemsEdit()
  if (change.slotId === '__underground__')
    return callbacks.revertUndergroundDraft()
  if (change.slotId === '__raids__') return callbacks.revertRaidsDraft()
  if (change.slotId.startsWith('__mystery_gift__:'))
    return callbacks.revertMysteryGiftEdit(
      change.slotId.slice('__mystery_gift__:'.length),
    )
  const pokedexAction = parsePokedexActionSlotId(change.slotId)
  if (pokedexAction) return callbacks.revertPokedexAction(pokedexAction)
  const arceusResearchBulk = parseArceusResearchBulkSlotId(change.slotId)
  if (arceusResearchBulk)
    return callbacks.revertArceusResearchBulk(arceusResearchBulk)
  const arceusResearchAction = parseArceusResearchActionSlotId(change.slotId)
  if (arceusResearchAction)
    return callbacks.revertArceusResearchAction(arceusResearchAction)
  if (change.slotId.startsWith('__donut__:'))
    return callbacks.revertDonutDraft(change.slotId.slice('__donut__:'.length))
  if (change.slotId === '__met_date_fixer__')
    return callbacks.revertMetDateFixerDraft()

  const base = baseDetails[change.slotId]
  const current = drafts[change.slotId]
  if (!base || !current) return
  setDrafts((values) => {
    const next = revertDraftPath(base, current, change.path)
    const copy = { ...values, [change.slotId]: next }
    if (!hasPokemonChanged(base, next)) delete copy[change.slotId]
    return copy
  })
}
