import type { PokemonDraftChange } from '../../types/database/database'
import type {
  BoxSummary,
  DraftLegalityResponse,
  LegalGenerateRequest,
  LegalGenerateResponse,
  LegalityFixesResponse,
  LegalityFixRequest,
  LegalityFixResponse,
  PokemonDetail,
} from '../../types/index/index'
import type { TrainerInfo } from '../../types/trainer/trainer'
import type { RequestJsonFn } from '../apiHttp/apiHttp'

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

  async previewRerollPid(
    sessionId: string,
    slotId: string,
    flags: {
      preserveGender: boolean
      preserveNature: boolean
      preserveAbility: boolean
      preserveShiny: boolean
      desiredGender?: number | null
    },
  ): Promise<PokemonDetail> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokemon/${slotId}/preview/reroll-pid`,
      {
        method: 'POST',
        body: JSON.stringify(flags),
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

  async previewLegalGenerate(
    sessionId: string,
    slotId: string,
    request: LegalGenerateRequest,
  ): Promise<LegalGenerateResponse> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokemon/${slotId}/preview/legal-generate`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    )
  }

  async getLegalityFixes(
    sessionId: string,
    slotId: string,
    pokemon: unknown,
  ): Promise<LegalityFixesResponse> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokemon/${slotId}/preview/legality-fixes`,
      {
        method: 'POST',
        body: JSON.stringify({ pokemon }),
      },
    )
  }

  async applyLegalityFixes(
    sessionId: string,
    slotId: string,
    request: LegalityFixRequest,
  ): Promise<LegalityFixResponse> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokemon/${slotId}/preview/apply-legality-fixes`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    )
  }

  async getTrainerInfo(sessionId: string): Promise<TrainerInfo> {
    return this.requestJson(`/api/saves/${sessionId}/trainer`)
  }
}
