import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import { qk } from './keys'

export function useTrainerBase(api: ApiClient, sessionId: string | undefined) {
  return useQuery({
    queryKey: qk.trainerBase(sessionId ?? ''),
    queryFn: () => api.getTrainerInfo(sessionId!),
    enabled: !!sessionId,
    retry: false,
    staleTime: 0,
  })
}
