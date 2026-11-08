import { useEffect } from 'react'

import { writeSaveLanguage } from '../../services/storage/storage'
import type { TrainerInfo } from '../../types/trainer/trainer'

// Gen 1-3 saves don't store their language, so a language picked in the
// trainer editor is remembered for the file and sent the next time it opens.
export function useRememberSaveLanguage(
  fileName: string | undefined,
  trainerBase: TrainerInfo | null | undefined,
  trainerDraft: TrainerInfo | null | undefined,
) {
  const language = trainerDraft?.language
  const baseLanguage = trainerBase?.language
  const inferred = trainerBase?.languageInferred === true

  useEffect(() => {
    if (!fileName || !inferred || language === undefined) return
    if (language === baseLanguage) return
    writeSaveLanguage(fileName, language)
  }, [baseLanguage, fileName, inferred, language])
}
