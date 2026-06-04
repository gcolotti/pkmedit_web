import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useSavesList(api: ApiClient, apiBase: string) {
  return useQuery({
    queryKey: qk.savesList(apiBase),
    queryFn: () => api.listSaves(),
  })
}
