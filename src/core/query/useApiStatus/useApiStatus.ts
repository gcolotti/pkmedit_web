import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { qk } from '../keys/keys'

export function useApiStatus(api: ApiClient, apiBase: string) {
  return useQuery({
    queryKey: qk.apiStatus(apiBase),
    queryFn: async () => {
      const [health, caps] = await Promise.all([
        api.getHealth(),
        api.getCapabilities(),
      ])
      return { status: health.status, pkhexCoreVersion: caps.pkhexCoreVersion }
    },
    staleTime: 30_000,
    retry: 1,
  })
}
