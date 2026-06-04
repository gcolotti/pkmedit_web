import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useBoxes(api: ApiClient, sessionId: string | undefined) {
  return useQuery({
    queryKey: qk.boxes(sessionId ?? ''),
    queryFn: () => api.getBoxes(sessionId!),
    enabled: !!sessionId,
    staleTime: 0,
  })
}
