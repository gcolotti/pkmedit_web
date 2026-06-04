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

export function revertWorkspaceChange(
  change: DraftChange,
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  setDrafts: Dispatch<SetStateAction<Record<string, PokemonDetail>>>,
  revertTrainerEdit: () => void,
  revertItemsEdit: () => void,
  revertMysteryGiftEdit: (id: string) => void,
  revertPokedexAction: (key: PokedexActionKey) => void,
  revertDonutDraft: (id: string) => void = () => undefined,
  revertMetDateFixerDraft: () => void = () => undefined,
  revertUndergroundDraft: () => void = () => undefined,
  revertRaidsDraft: () => void = () => undefined,
  revertArceusResearchAction: (key: ArceusResearchActionKey) => void = () =>
    undefined,
  revertArceusResearchBulk: (action: ArceusResearchBulkAction) => void = () =>
    undefined,
) {
  if (change.slotId === '__trainer__') return revertTrainerEdit()
  if (change.slotId === '__items__') return revertItemsEdit()
  if (change.slotId === '__underground__') return revertUndergroundDraft?.()
  if (change.slotId === '__raids__') return revertRaidsDraft?.()
  if (change.slotId.startsWith('__mystery_gift__:'))
    return revertMysteryGiftEdit(
      change.slotId.slice('__mystery_gift__:'.length),
    )
  const pokedexAction = parsePokedexActionSlotId(change.slotId)
  if (pokedexAction) return revertPokedexAction(pokedexAction)
  const arceusResearchBulk = parseArceusResearchBulkSlotId(change.slotId)
  if (arceusResearchBulk) return revertArceusResearchBulk(arceusResearchBulk)
  const arceusResearchAction = parseArceusResearchActionSlotId(change.slotId)
  if (arceusResearchAction)
    return revertArceusResearchAction(arceusResearchAction)
  if (change.slotId.startsWith('__donut__:'))
    return revertDonutDraft(change.slotId.slice('__donut__:'.length))
  if (change.slotId === '__met_date_fixer__') return revertMetDateFixerDraft()

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
