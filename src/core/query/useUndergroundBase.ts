import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import { qk } from './keys'

export function useUndergroundBase(
  api: ApiClient,
  sessionId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: qk.undergroundBase(sessionId ?? ''),
    queryFn: () => api.getUndergroundItems(sessionId!),
    enabled: !!sessionId && enabled,
    retry: false,
    staleTime: 0,
  })
}
