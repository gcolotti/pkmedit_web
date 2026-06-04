import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useTrainerBase(api: ApiClient, sessionId: string | undefined) {
  return useQuery({
    queryKey: qk.trainerBase(sessionId ?? ''),
    queryFn: () => api.getTrainerInfo(sessionId!),
    enabled: !!sessionId,
    retry: false,
    staleTime: 0,
  })
}
