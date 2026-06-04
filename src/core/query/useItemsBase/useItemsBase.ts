import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useItemsBase(api: ApiClient, sessionId: string | undefined) {
  return useQuery({
    queryKey: qk.itemsBase(sessionId ?? ''),
    queryFn: () => api.getItemBag(sessionId!),
    enabled: !!sessionId,
    retry: false,
    staleTime: 0,
  })
}
