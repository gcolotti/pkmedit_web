import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import type { MoveDetail } from '../../types/index/index'
import { qk } from '../keys/keys'

// Stable cache key: ids in sorted order so two calls with the same set share a fetch.
const sortIds = (ids: readonly number[]): number[] =>
  [...ids].sort((a, b) => a - b)

export function useMoveDetails(
  api: ApiClient,
  apiBase: string,
  ids: number[] | null,
) {
  return useQuery({
    queryKey: ids
      ? qk.moveDetails(apiBase, sortIds(ids))
      : ['moveDetails', apiBase, 'disabled'],
    queryFn: async () => {
      const page = await api.catalog.getMoveDetails({ ids: ids ?? [] })
      return new Map<number, MoveDetail>(page.entries.map((e) => [e.id, e]))
    },
    enabled: ids != null && ids.length > 0,
    staleTime: Infinity,
  })
}
