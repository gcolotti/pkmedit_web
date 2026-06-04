import { useMutation } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'

export function useOpenSave(api: ApiClient) {
  return useMutation({
    mutationFn: (path: string) => api.openSave(path),
  })
}
