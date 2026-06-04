import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUiStore } from './uiStore'

const initial = () => useUiStore.getState()

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState(initial(), true)
  })

  describe('initial state', () => {
    it('exposes the documented defaults', () => {
      const s = useUiStore.getState()
      expect(s.view).toBe('party')
      expect(s.saveView).toBe('trainer')
      expect(s.databaseView).toBe('encounters')
      expect(s.boxIndex).toBe(0)
      expect(s.selectedSlotId).toBeNull()
      expect(s.focusedEditor).toBeNull()
      expect(s.typeChartTypeId).toBeNull()
      expect(s.pokemonEditorTab).toBe('main')
      expect(s.toast).toBe('')
      expect(s.pokemonClipboard).toBeNull()
    })
  })

  describe('setters', () => {
    it('setView updates view', () => {
      act(() => useUiStore.getState().setView('save'))
      expect(useUiStore.getState().view).toBe('save')
    })

    it('setSaveView updates saveView', () => {
      act(() => useUiStore.getState().setSaveView('trainer'))
      expect(useUiStore.getState().saveView).toBe('trainer')
    })

    it('setDatabaseView updates databaseView', () => {
      act(() => useUiStore.getState().setDatabaseView('encounters'))
      expect(useUiStore.getState().databaseView).toBe('encounters')
    })

    it('setBoxIndex updates boxIndex', () => {
      act(() => useUiStore.getState().setBoxIndex(7))
      expect(useUiStore.getState().boxIndex).toBe(7)
    })

    it('setSelectedSlotId updates selectedSlotId', () => {
      act(() => useUiStore.getState().setSelectedSlotId('slot-42'))
      expect(useUiStore.getState().selectedSlotId).toBe('slot-42')
    })

    it('setFocusedEditor updates focusedEditor', () => {
      act(() => useUiStore.getState().setFocusedEditor('moves'))
      expect(useUiStore.getState().focusedEditor).toBe('moves')
      act(() => useUiStore.getState().setFocusedEditor(null))
      expect(useUiStore.getState().focusedEditor).toBeNull()
    })

    it('setTypeChartTypeId updates typeChartTypeId', () => {
      act(() => useUiStore.getState().setTypeChartTypeId(8))
      expect(useUiStore.getState().typeChartTypeId).toBe(8)
    })

    it('setPokemonEditorTab updates pokemonEditorTab', () => {
      act(() => useUiStore.getState().setPokemonEditorTab('stats'))
      expect(useUiStore.getState().pokemonEditorTab).toBe('stats')
    })

    it('setPokemonClipboard stores and clears the clipboard', () => {
      const detail = { species: 25, nickname: 'Sparky' } as never
      act(() => useUiStore.getState().setPokemonClipboard(detail))
      expect(useUiStore.getState().pokemonClipboard).toBe(detail)
      act(() => useUiStore.getState().setPokemonClipboard(null))
      expect(useUiStore.getState().pokemonClipboard).toBeNull()
    })
  })

  describe('showToast', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('sets the toast message immediately', () => {
      act(() => useUiStore.getState().showToast('Saved'))
      expect(useUiStore.getState().toast).toBe('Saved')
    })

    it('clears the toast after 3000ms', () => {
      act(() => useUiStore.getState().showToast('Saved'))
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(useUiStore.getState().toast).toBe('')
    })

    it('does not clear before 3000ms', () => {
      act(() => useUiStore.getState().showToast('Saved'))
      act(() => {
        vi.advanceTimersByTime(2999)
      })
      expect(useUiStore.getState().toast).toBe('Saved')
    })

    it('replaces an outstanding toast when called again', () => {
      act(() => useUiStore.getState().showToast('First'))
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      act(() => useUiStore.getState().showToast('Second'))
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      // The first timer was cleared by the second call, so 'First' is gone
      // but 'Second' is still showing at t=3500.
      expect(useUiStore.getState().toast).toBe('Second')
    })

    it('clears the toast at t=3000 for the second call', () => {
      act(() => useUiStore.getState().showToast('First'))
      act(() => useUiStore.getState().showToast('Second'))
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(useUiStore.getState().toast).toBe('')
    })

    it('does not arm a timer for an empty message', () => {
      act(() => useUiStore.getState().showToast('First'))
      act(() => useUiStore.getState().showToast(''))
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      // '' was set, no timer was armed, toast remains ''
      expect(useUiStore.getState().toast).toBe('')
    })
  })
})
