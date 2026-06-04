import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useRaidsBase(
  api: ApiClient,
  sessionId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: qk.raidsBase(sessionId ?? ''),
    queryFn: () => api.getRaids(sessionId!),
    enabled: !!sessionId && enabled,
    retry: false,
    staleTime: 0,
  })
}
