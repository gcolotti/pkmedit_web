import type { Translator } from '../i18n/i18n'
import type { MysteryGiftDatabasePreview } from '../types/database'
import type { DonutDraft } from '../types/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
  DraftChange,
  ItemBag,
  PokedexActionKey,
  PokedexStatusResponse,
} from '../types/index'
import type { MetDateFixerRequest } from '../types/metDateFixer'
import type {
  RaidListResponse,
  UndergroundItemsResponse,
} from '../types/saveFeature'
import type { TrainerInfo } from '../types/trainer'
import { buildArceusResearchDraftChanges } from './arceusResearchDraftChanges'
import {
  formatPokedexDraftLabel,
  pokedexActionSlotId,
} from './pokedexActionUtils'

export function buildWorkspaceDraftChanges(
  pokemonDraftChanges: DraftChange[],
  t: Translator,
  trainerDraft: TrainerInfo | null,
  itemsDraft: ItemBag | null,
  mysteryGiftDrafts: MysteryGiftDatabasePreview[],
  pokedexDrafts: PokedexActionKey[],
  pokedexStatus: PokedexStatusResponse | null,
  donutDrafts: DonutDraft[] = [],
  metDateFixerDraft: MetDateFixerRequest | null = null,
  undergroundDraft: UndergroundItemsResponse | null = null,
  raidsDraft: RaidListResponse | null = null,
  arceusResearchDrafts: ArceusResearchActionKey[] = [],
  arceusResearchBulkDrafts: ArceusResearchBulkAction[] = [],
  arceusResearchStatus: ArceusResearchStatusResponse | null = null,
) {
  const special: DraftChange[] = []
  if (trainerDraft !== null)
    special.push({
      slotId: '__trainer__',
      label: t('trainerData'),
      path: '',
      before: '',
      after: '',
    })
  if (itemsDraft !== null)
    special.push({
      slotId: '__items__',
      label: t('itemBag'),
      path: '',
      before: '',
      after: '',
    })
  if (undergroundDraft !== null)
    special.push({
      slotId: '__underground__',
      label: t('underground'),
      path: '',
      before: '',
      after: '',
    })
  if (raidsDraft !== null)
    special.push({
      slotId: '__raids__',
      label: t('raids'),
      path: '',
      before: '',
      after: '',
    })
  for (const gift of mysteryGiftDrafts) {
    special.push({
      slotId: `__mystery_gift__:${gift.entry.id}`,
      label: t('mysteryGiftDraft'),
      path: '',
      before: '',
      after: gift.entry.title,
    })
  }
  for (const target of pokedexDrafts) {
    special.push({
      slotId: pokedexActionSlotId(target),
      label: formatPokedexDraftLabel(t, target, pokedexStatus),
      path: '',
      before: '',
      after: '',
    })
  }
  for (const donut of donutDrafts) {
    special.push({
      slotId: `__donut__:${donut.id}`,
      label: t('newDonut'),
      path: '',
      before: '',
      after: donut.label,
    })
  }
  if (metDateFixerDraft !== null)
    special.push({
      slotId: '__met_date_fixer__',
      label: t('metDateFixer'),
      path: '',
      before: '',
      after: t(
        metDateFixerDraft.rewriteAll ? 'rewriteAllDates' : 'fixInvalidDates',
      ),
    })
  special.push(
    ...buildArceusResearchDraftChanges(
      t,
      arceusResearchDrafts,
      arceusResearchBulkDrafts,
      arceusResearchStatus,
    ),
  )
  return [...special, ...pokemonDraftChanges]
}
