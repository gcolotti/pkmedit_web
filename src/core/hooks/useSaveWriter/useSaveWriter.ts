import type { Translator } from '../../i18n/i18n/i18n'
import {
  buildItemsUpdatePayload,
  buildRaidsUpdatePayload,
  buildTrainerUpdatePayload,
} from '../../services/draftPayloads/draftPayloads'
import { saveBlob } from '../../services/exportSave/exportSave'
import { storeLastUploadedSave } from '../../services/localDb/localDb'
import type { DonutDraft } from '../../types/donut/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ItemBag,
  SaveSummary,
} from '../../types/index/index'
import type { MetDateFixerRequest } from '../../types/metDateFixer/metDateFixer'
import type { UndergroundItemsResponse } from '../../types/saveFeature/saveFeature'
import type { RaidListResponse } from '../../types/saveFeature/saveFeature'
import type { TrainerInfo } from '../../types/trainer/trainer'

export async function writeSave(
  summary: SaveSummary,
  api: {
    exportDraft(
      sessionId: string,
      changes: readonly unknown[],
      allowIllegal: boolean,
      trainer?: unknown,
      items?: unknown,
      mysteryGifts?: unknown,
      pokedex?: unknown,
      donuts?: unknown,
      metDate?: unknown,
      underground?: unknown,
      raids?: unknown,
      arceusResearchActions?: unknown,
      arceusResearchBulk?: unknown,
      format?: 'sav' | 'zip',
    ): Promise<Blob>
    exportSave(sessionId: string, format?: 'sav' | 'zip'): Promise<Blob>
  },
  dirty: boolean,
  draftRequests: unknown[],
  allowIllegalChanges: boolean,
  trainerDraft: TrainerInfo | null,
  itemsDraft: ItemBag | null,
  undergroundDraft: UndergroundItemsResponse | null,
  raidsDraft: RaidListResponse | null,
  mysteryGiftDrafts: Array<{ draft: unknown }>,
  pokedexDrafts: unknown[],
  donutDrafts: DonutDraft[],
  metDateFixerDraft: MetDateFixerRequest | null,
  arceusResearchDrafts: ArceusResearchActionKey[],
  arceusResearchBulkDrafts: ArceusResearchBulkAction[],
  setSummary: (s: SaveSummary) => void,
  setToast: (t: string) => void,
  t: Translator,
  format: 'sav' | 'zip' = 'sav',
) {
  const trainerUpdate = trainerDraft
    ? buildTrainerUpdatePayload(trainerDraft)
    : null
  const itemsUpdate = itemsDraft ? buildItemsUpdatePayload(itemsDraft) : null
  const undergroundUpdate = undergroundDraft
    ? {
        items: undergroundDraft.items.map(
          ({ index, count, isNew, favorite }) => ({
            index,
            count,
            isNew,
            favorite,
          }),
        ),
      }
    : null
  const raidsUpdate = raidsDraft ? buildRaidsUpdatePayload(raidsDraft) : null
  const mysteryGifts = mysteryGiftDrafts.map((g) => g.draft)

  const useZip = format === 'zip'
  const ext = useZip ? '.zip' : summary.saveExtension
  const apiFormat = useZip ? 'zip' : 'sav'
  const blob = dirty
    ? await api.exportDraft(
        summary.sessionId,
        draftRequests,
        allowIllegalChanges,
        trainerUpdate,
        itemsUpdate,
        mysteryGifts,
        pokedexDrafts,
        donutDrafts.length > 0 ? donutDrafts : null,
        metDateFixerDraft,
        undergroundUpdate,
        raidsUpdate,
        arceusResearchDrafts.length > 0 ? arceusResearchDrafts : null,
        arceusResearchBulkDrafts.length > 0 ? arceusResearchBulkDrafts : null,
        apiFormat,
      )
    : await api.exportSave(summary.sessionId, apiFormat)

  const fileName = `${summary.fileName.replace(/\.[^.]+$/, '')}_pkmedit${ext}`
  await saveBlob(blob, fileName, t(useZip ? 'saveZipFileType' : 'saveFileType'))
  void storeLastUploadedSave(summary.fileName, blob)
  setSummary({ ...summary, edited: false })
  setToast(t('exported', { path: fileName }))
}
