import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import { qk } from './keys'

export function useParty(api: ApiClient, sessionId: string | undefined) {
  return useQuery({
    queryKey: qk.party(sessionId ?? ''),
    queryFn: () => api.getParty(sessionId!),
    enabled: !!sessionId,
    staleTime: 0,
  })
}
