import type { PokemonDraftChange } from '../types/database'
import type {
  BoxSummary,
  DraftLegalityResponse,
  PokemonDetail,
} from '../types/index'
import type { TrainerInfo } from '../types/trainer'
import type { RequestJsonFn } from './apiHttp'

export class PokemonApi {
  constructor(private readonly requestJson: RequestJsonFn) {}

  async getParty(
    sessionId: string,
  ): Promise<{ slots: PokemonDetail['summary'][] }> {
    return this.requestJson(`/api/saves/${sessionId}/party`)
  }

  async getBoxes(sessionId: string): Promise<{ boxes: BoxSummary[] }> {
    return this.requestJson(`/api/saves/${sessionId}/boxes`)
  }

  async getPokemon(sessionId: string, slotId: string): Promise<PokemonDetail> {
    return this.requestJson(`/api/saves/${sessionId}/pokemon/${slotId}`)
  }

  async previewPokemonUpdate(
    sessionId: string,
    slotId: string,
    payload: unknown,
  ): Promise<PokemonDetail> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokemon/${slotId}/preview`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  async checkDraft(
    sessionId: string,
    changes: PokemonDraftChange[],
    allowIllegalChanges: boolean,
  ): Promise<DraftLegalityResponse> {
    return this.requestJson(`/api/saves/${sessionId}/legality/check-draft`, {
      method: 'POST',
      body: JSON.stringify({ allowIllegalChanges, changes }),
    })
  }

  async getTrainerInfo(sessionId: string): Promise<TrainerInfo> {
    return this.requestJson(`/api/saves/${sessionId}/trainer`)
  }
}
