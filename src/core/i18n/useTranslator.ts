import { useMemo } from 'react'

import { useShellStore } from '../state/shellStore'
import { createTranslator } from './i18n'

export function useTranslator() {
  const language = useShellStore((s) => s.language)
  return useMemo(() => createTranslator(language), [language])
}
