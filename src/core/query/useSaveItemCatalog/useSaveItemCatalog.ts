import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import type { Language } from '../../types/index/index'
import { qk } from '../keys/keys'

export function useSaveItemCatalog(
  api: ApiClient,
  sessionId: string | undefined,
  language: Language,
) {
  return useQuery({
    queryKey: qk.saveItemCatalog(sessionId ?? '', language),
    queryFn: () => api.getSaveItemCatalog(sessionId!),
    enabled: !!sessionId,
    retry: false,
    staleTime: Infinity,
  })
}
