import type {
  MysteryGiftDraftChange,
  PokemonDraftChange,
} from '../../types/database/database'
import type { DonutDraft } from '../../types/donut/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  PokedexActionKey,
} from '../../types/index/index'
import type { MetDateFixerRequest } from '../../types/metDateFixer/metDateFixer'
import {
  buildArceusResearchActionsPayload,
  buildDonutPayload,
  buildPokedexActionsPayload,
} from '../apiHelpers/apiHelpers'
import type { RequestBlobFn, RequestJsonFn } from '../apiHttp/apiHttp'

// Exports rebuild and zip whole saves server-side; the default 60s request
// timeout is too tight for the big ones.
const exportTimeoutMs = 300_000

export class ExportApi {
  constructor(
    private readonly requestBlob: RequestBlobFn,
    private readonly requestJson: RequestJsonFn,
  ) {}

  async exportSave(
    sessionId: string,
    format: 'sav' | 'zip' = 'sav',
  ): Promise<Blob> {
    const suffix = format === 'zip' ? '?format=zip' : ''
    return this.requestBlob(`/api/saves/${sessionId}/export${suffix}`, {
      timeoutMs: exportTimeoutMs,
    })
  }

  async exportDraft(
    sessionId: string,
    changes: PokemonDraftChange[],
    allowIllegalChanges: boolean,
    trainerUpdate?: object | null,
    itemsUpdate?: object | null,
    mysteryGifts?: MysteryGiftDraftChange[] | null,
    pokedexActions?: PokedexActionKey[] | null,
    donutDrafts?: DonutDraft[] | null,
    metDateFixer?: MetDateFixerRequest | null,
    undergroundItemsUpdate?: object | null,
    raidsUpdate?: object | null,
    arceusResearchActions?: ArceusResearchActionKey[] | null,
    arceusResearchBulk?: ArceusResearchBulkAction[] | null,
    format: 'sav' | 'zip' = 'sav',
  ): Promise<Blob> {
    const suffix = format === 'zip' ? '?format=zip' : ''
    return this.requestBlob(`/api/saves/${sessionId}/export-draft${suffix}`, {
      method: 'POST',
      timeoutMs: exportTimeoutMs,
      body: JSON.stringify({
        allowIllegalChanges,
        changes,
        trainerUpdate: trainerUpdate ?? null,
        itemsUpdate: itemsUpdate ?? null,
        mysteryGifts: mysteryGifts ?? null,
        pokedexActions: buildPokedexActionsPayload(pokedexActions),
        donutDrafts: buildDonutPayload(donutDrafts),
        metDateFixer: metDateFixer ?? null,
        undergroundItemsUpdate: undergroundItemsUpdate ?? null,
        raidsUpdate: raidsUpdate ?? null,
        arceusResearchActions: buildArceusResearchActionsPayload(
          arceusResearchActions,
          arceusResearchBulk,
        ),
      }),
    })
  }
}
