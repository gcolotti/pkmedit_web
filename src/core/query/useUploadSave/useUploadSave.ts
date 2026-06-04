import { useMutation } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'

export function useUploadSave(api: ApiClient) {
  return useMutation({
    mutationFn: (file: File) => api.uploadAndOpenSave(file),
  })
}
