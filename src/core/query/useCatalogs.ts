import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import type { Language } from '../types/index'
import { qk } from './keys'

export function useCatalogs(
  api: ApiClient,
  apiBase: string,
  language: Language,
) {
  return useQuery({
    queryKey: qk.catalogs(apiBase, language),
    queryFn: () => api.getCatalogs(),
    staleTime: Infinity,
  })
}
