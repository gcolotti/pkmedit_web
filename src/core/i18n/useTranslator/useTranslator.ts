import { useMemo } from 'react'

import { useShellStore } from '../../state/shellStore/shellStore'
import { createTranslator } from '../i18n/i18n'

export function useTranslator() {
  const language = useShellStore((s) => s.language)
  return useMemo(() => createTranslator(language), [language])
}
