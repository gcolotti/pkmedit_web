import type { Translator } from '../../i18n/i18n/i18n'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
  DraftChange,
} from '../../types/index/index'
import {
  arceusResearchActionSlotId,
  arceusResearchBulkSlotId,
  formatArceusResearchBulkLabel,
  formatArceusResearchDraftLabel,
} from '../arceusResearchActionUtils/arceusResearchActionUtils'

export function buildArceusResearchDraftChanges(
  t: Translator,
  arceusResearchDrafts: ArceusResearchActionKey[],
  arceusResearchBulkDrafts: ArceusResearchBulkAction[],
  arceusResearchStatus: ArceusResearchStatusResponse | null,
): DraftChange[] {
  const changes: DraftChange[] = []
  for (const bulk of arceusResearchBulkDrafts) {
    changes.push({
      slotId: arceusResearchBulkSlotId(bulk),
      label: formatArceusResearchBulkLabel(t, bulk),
      path: '',
      before: '',
      after: '',
    })
  }
  for (const target of arceusResearchDrafts) {
    const speciesName =
      arceusResearchStatus?.species.find(
        (entry) => entry.species === target.species,
      )?.speciesName ?? `#${target.species}`
    changes.push({
      slotId: arceusResearchActionSlotId(target),
      label: formatArceusResearchDraftLabel(t, target, speciesName),
      path: '',
      before: '',
      after: '',
    })
  }
  return changes
}
