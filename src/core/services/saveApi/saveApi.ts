import type {
  ArceusResearchSpeciesDetail,
  ArceusResearchStatusResponse,
  PokedexStatusResponse,
  SaveFileEntry,
  SaveSummary,
} from '../../types/index/index'
import type { RequestJsonFn } from '../apiHttp/apiHttp'

export class SaveApi {
  constructor(private readonly requestJson: RequestJsonFn) {}

  async listSaves(): Promise<SaveFileEntry[]> {
    return this.requestJson('/api/saves/files')
  }

  // language: remembered game language for Gen 1-3 saves (not stored in them).
  async openSave(
    path: string,
    language?: number,
  ): Promise<{ sessionId: string; summary: SaveSummary }> {
    return this.requestJson('/api/saves/open', {
      method: 'POST',
      body: JSON.stringify({ path, language }),
    })
  }

  async uploadAndOpenSave(
    file: File,
    language?: number,
  ): Promise<{ sessionId: string; summary: SaveSummary }> {
    const form = new FormData()
    form.append('file', file, file.name)
    if (language !== undefined) form.append('language', String(language))
    return this.requestJson('/api/saves/upload-open', {
      method: 'POST',
      body: form,
    })
  }

  async getSummary(sessionId: string): Promise<SaveSummary> {
    return this.requestJson(`/api/saves/${sessionId}/summary`)
  }

  async getPokedexStatus(sessionId: string): Promise<PokedexStatusResponse> {
    return this.requestJson(`/api/saves/${sessionId}/pokedex`)
  }

  async getArceusResearchStatus(
    sessionId: string,
  ): Promise<ArceusResearchStatusResponse> {
    return this.requestJson(`/api/saves/${sessionId}/pokedex/arceus-research`)
  }

  async getArceusResearchSpecies(
    sessionId: string,
    species: number,
    language: string,
  ): Promise<ArceusResearchSpeciesDetail> {
    return this.requestJson(
      `/api/saves/${sessionId}/pokedex/arceus-research/${species}?lang=${encodeURIComponent(language)}`,
    )
  }
}
