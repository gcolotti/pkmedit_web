import type {
  EncounterDatabasePreview,
  EncounterDatabaseSearchRequest,
  EncounterDatabaseSearchResponse,
  MysteryGiftDatabasePreview,
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftDatabaseSearchResponse,
} from '../../types/database/database'
import type {
  MetDateFixerPreview,
  MetDateFixerRequest,
} from '../../types/metDateFixer/metDateFixer'
import type { RequestJsonFn } from '../apiHttp/apiHttp'

export class DatabaseApi {
  constructor(private readonly requestJson: RequestJsonFn) {}

  async searchEncounters(
    sessionId: string,
    data: EncounterDatabaseSearchRequest,
  ): Promise<EncounterDatabaseSearchResponse> {
    return this.requestJson(
      `/api/saves/${sessionId}/databases/encounters/search`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  }

  async previewEncounter(
    sessionId: string,
    search: EncounterDatabaseSearchRequest,
    resultId: string,
  ): Promise<Omit<EncounterDatabasePreview, 'search'>> {
    return this.requestJson(
      `/api/saves/${sessionId}/databases/encounters/preview`,
      {
        method: 'POST',
        body: JSON.stringify({ search, resultId }),
      },
    )
  }

  async searchMysteryGifts(
    sessionId: string,
    data: MysteryGiftDatabaseSearchRequest,
  ): Promise<MysteryGiftDatabaseSearchResponse> {
    return this.requestJson(
      `/api/saves/${sessionId}/databases/mystery-gifts/search`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  }

  async previewMysteryGift(
    sessionId: string,
    resultId: string,
  ): Promise<MysteryGiftDatabasePreview> {
    return this.requestJson(
      `/api/saves/${sessionId}/databases/mystery-gifts/preview`,
      {
        method: 'POST',
        body: JSON.stringify({ resultId }),
      },
    )
  }

  async previewMetDateFixer(
    sessionId: string,
    request: MetDateFixerRequest,
  ): Promise<MetDateFixerPreview> {
    return this.requestJson(`/api/saves/${sessionId}/met-date-fixer/preview`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
}
