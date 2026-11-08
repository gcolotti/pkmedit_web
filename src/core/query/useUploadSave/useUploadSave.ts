import { useMutation } from '@tanstack/react-query'

import type { ApiClient } from '../../services/api/api'
import { readSaveLanguage } from '../../services/storage/storage'

export function useUploadSave(api: ApiClient) {
  return useMutation({
    mutationFn: (file: File) =>
      api.uploadAndOpenSave(file, readSaveLanguage(file.name)),
  })
}
