import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import { qk } from './keys'

export function useSavesList(api: ApiClient, apiBase: string) {
  return useQuery({
    queryKey: qk.savesList(apiBase),
    queryFn: () => api.listSaves(),
  })
}
