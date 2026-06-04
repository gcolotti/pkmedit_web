import { create } from 'zustand'

import {
  readAllowIllegalChanges,
  readApiBase,
  readLanguage,
  readTheme,
  writeAllowIllegalChanges,
  writeApiBase,
  writeLanguage,
  writeTheme,
} from '../../services/storage/storage'
import type { Language, Theme } from '../../types/index/index'

type ShellState = {
  language: Language
  theme: Theme
  allowIllegalChanges: boolean
  apiBase: string
  setLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
  setAllowIllegalChanges: (value: boolean) => void
  setApiBase: (value: string) => void
}

export const useShellStore = create<ShellState>((set) => ({
  language: readLanguage(),
  theme: readTheme(),
  allowIllegalChanges: readAllowIllegalChanges(),
  apiBase: readApiBase(),
  setLanguage: (language) => {
    writeLanguage(language)
    document.documentElement.lang = language
    set({ language })
  },
  setTheme: (theme) => {
    writeTheme(theme)
    set({ theme })
  },
  setAllowIllegalChanges: (allowIllegalChanges) => {
    writeAllowIllegalChanges(allowIllegalChanges)
    set({ allowIllegalChanges })
  },
  setApiBase: (apiBase) => {
    writeApiBase(apiBase)
    set({ apiBase })
  },
}))

// Apply DOM side effects for initial state (mirrors what the old useEffect-on-mount did)
const { theme, language } = useShellStore.getState()
writeTheme(theme)
document.documentElement.lang = language
