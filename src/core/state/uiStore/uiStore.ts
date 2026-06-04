import { create } from 'zustand'

import type { FocusedEditorId } from '../../types/focusedEditor/focusedEditor'
import type {
  DatabaseView,
  EditorTab,
  PokemonDetail,
  SaveView,
  View,
} from '../../types/index/index'

let toastTimer: ReturnType<typeof window.setTimeout> | null = null

type UiState = {
  view: View
  saveView: SaveView
  databaseView: DatabaseView
  boxIndex: number
  selectedSlotId: string | null
  focusedEditor: FocusedEditorId | null
  typeChartTypeId: number | null
  pokemonEditorTab: EditorTab
  toast: string
  pokemonClipboard: PokemonDetail | null
  setView: (v: View) => void
  setSaveView: (v: SaveView) => void
  setDatabaseView: (v: DatabaseView) => void
  setBoxIndex: (i: number) => void
  setSelectedSlotId: (id: string | null) => void
  setFocusedEditor: (id: FocusedEditorId | null) => void
  setTypeChartTypeId: (id: number | null) => void
  setPokemonEditorTab: (tab: EditorTab) => void
  setPokemonClipboard: (p: PokemonDetail | null) => void
  showToast: (msg: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  view: 'party',
  saveView: 'trainer',
  databaseView: 'encounters',
  boxIndex: 0,
  selectedSlotId: null,
  focusedEditor: null,
  typeChartTypeId: null,
  pokemonEditorTab: 'main',
  toast: '',
  pokemonClipboard: null,
  setView: (view) => set({ view }),
  setSaveView: (saveView) => set({ saveView }),
  setDatabaseView: (databaseView) => set({ databaseView }),
  setBoxIndex: (boxIndex) => set({ boxIndex }),
  setSelectedSlotId: (selectedSlotId) => set({ selectedSlotId }),
  setFocusedEditor: (focusedEditor) => set({ focusedEditor }),
  setTypeChartTypeId: (typeChartTypeId) => set({ typeChartTypeId }),
  setPokemonEditorTab: (pokemonEditorTab) => set({ pokemonEditorTab }),
  setPokemonClipboard: (pokemonClipboard) => set({ pokemonClipboard }),
  showToast: (msg) => {
    if (toastTimer !== null) window.clearTimeout(toastTimer)
    set({ toast: msg })
    if (msg) {
      toastTimer = window.setTimeout(() => {
        toastTimer = null
        set({ toast: '' })
      }, 3000)
    }
  },
}))
