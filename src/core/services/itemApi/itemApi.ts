import type { DonutPocket, DonutPreview } from '../../types/donut/donut'
import type { ItemBag } from '../../types/index/index'
import type {
  RaidListResponse,
  UndergroundItemsResponse,
} from '../../types/saveFeature/saveFeature'
import type { RequestJsonFn } from '../apiHttp/apiHttp'

export class ItemApi {
  constructor(private readonly requestJson: RequestJsonFn) {}

  async getItemBag(sessionId: string): Promise<ItemBag> {
    return this.requestJson(`/api/saves/${sessionId}/items`)
  }

  async getDonuts(sessionId: string): Promise<DonutPocket> {
    return this.requestJson(`/api/saves/${sessionId}/donuts`)
  }

  async previewDonut(
    sessionId: string,
    berries: number[],
    berryName: number,
  ): Promise<DonutPreview> {
    return this.requestJson(`/api/saves/${sessionId}/donuts/preview`, {
      method: 'POST',
      body: JSON.stringify({ berries, berryName }),
    })
  }

  async getUndergroundItems(
    sessionId: string,
  ): Promise<UndergroundItemsResponse> {
    return this.requestJson(`/api/saves/${sessionId}/underground`)
  }

  async getRaids(sessionId: string): Promise<RaidListResponse> {
    return this.requestJson(`/api/saves/${sessionId}/raids`)
  }
}
