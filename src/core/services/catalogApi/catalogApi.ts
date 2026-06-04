import type {
  AbilityDetail,
  CatalogBundle,
  Language,
  MoveDetail,
} from '../../types/index/index'
import { setTypeCatalog } from '../../utils/typeData/typeData'
import type { RequestJsonFn } from '../apiHttp/apiHttp'

export type DetailsPageResponse<T> = {
  entries: T[]
  total: number
  page: number | null
  pageSize: number | null
  hasNext: boolean | null
  hasPrevious: boolean | null
}

export type MoveDetailsPageResponse = DetailsPageResponse<MoveDetail>
export type AbilityDetailsPageResponse = DetailsPageResponse<AbilityDetail>

export class CatalogApi {
  constructor(
    private readonly requestJson: RequestJsonFn,
    private readonly getLanguage: () => Language,
  ) {}

  async getCatalogs(): Promise<CatalogBundle> {
    const bundle: CatalogBundle = await this.requestJson(
      `/api/catalogs?lang=${this.getLanguage()}`,
    )
    setTypeCatalog(bundle.types)
    return bundle
  }

  async getMoveDetails(
    params: { ids?: number[] } = {},
  ): Promise<MoveDetailsPageResponse> {
    const search = new URLSearchParams()
    if (params.ids && params.ids.length > 0) {
      search.set('ids', params.ids.join(','))
    }
    const qs = search.toString()
    return this.requestJson<MoveDetailsPageResponse>(
      `/api/catalogs/move-details${qs ? `?${qs}` : ''}`,
    )
  }

  async getAbilityDetails(
    params: { ids?: number[]; slugs?: string[] } = {},
  ): Promise<AbilityDetailsPageResponse> {
    const search = new URLSearchParams()
    if (params.ids && params.ids.length > 0) {
      search.set('ids', params.ids.join(','))
    } else if (params.slugs && params.slugs.length > 0) {
      search.set('slugs', params.slugs.join(','))
    }
    const qs = search.toString()
    return this.requestJson<AbilityDetailsPageResponse>(
      `/api/catalogs/ability-details${qs ? `?${qs}` : ''}`,
    )
  }
}
