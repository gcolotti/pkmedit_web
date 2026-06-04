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

  async openSave(
    path: string,
  ): Promise<{ sessionId: string; summary: SaveSummary }> {
    return this.requestJson('/api/saves/open', {
      method: 'POST',
      body: JSON.stringify({ path }),
    })
  }

  async uploadAndOpenSave(
    file: File,
  ): Promise<{ sessionId: string; summary: SaveSummary }> {
    const form = new FormData()
    form.append('file', file, file.name)
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
