// Mock the storage module so the shell store reads controlled values and we
// can assert the writers are called from the setters. The real storage module
// touches cookies and localStorage, which is fine in jsdom but adds noise.
const { storageMock } = vi.hoisted(() => ({
  storageMock: {
    readLanguage: vi.fn(() => 'en' as const),
    writeLanguage: vi.fn(),
    readTheme: vi.fn(() => 'light' as const),
    writeTheme: vi.fn(),
    readAllowIllegalChanges: vi.fn(() => true),
    writeAllowIllegalChanges: vi.fn(),
    readApiBase: vi.fn(() => 'http://localhost:8080'),
    writeApiBase: vi.fn(),
  },
}))

vi.mock('../../services/storage/storage', () => storageMock)

import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useShellStore } from './shellStore'

describe('useShellStore', () => {
  beforeEach(() => {
    storageMock.readLanguage.mockReturnValue('en')
    storageMock.readTheme.mockReturnValue('light')
    storageMock.readAllowIllegalChanges.mockReturnValue(true)
    storageMock.readApiBase.mockReturnValue('http://localhost:8080')
    vi.clearAllMocks()
    useShellStore.setState({
      language: 'en',
      theme: 'light',
      allowIllegalChanges: true,
      apiBase: 'http://localhost:8080',
    })
    document.documentElement.lang = ''
    document.documentElement.classList.remove('dark')
  })

  describe('initial state', () => {
    it('reflects reader output in the store', () => {
      expect(useShellStore.getState().language).toBe('en')
      expect(useShellStore.getState().theme).toBe('light')
      expect(useShellStore.getState().allowIllegalChanges).toBe(true)
      expect(useShellStore.getState().apiBase).toBe('http://localhost:8080')
    })
  })

  describe('setLanguage', () => {
    it('persists the language and updates the store', () => {
      act(() => useShellStore.getState().setLanguage('es'))
      expect(storageMock.writeLanguage).toHaveBeenCalledWith('es')
      expect(useShellStore.getState().language).toBe('es')
    })

    it('updates document.documentElement.lang', () => {
      act(() => useShellStore.getState().setLanguage('ja'))
      expect(document.documentElement.lang).toBe('ja')
    })
  })

  describe('setTheme', () => {
    it('persists the theme and updates the store', () => {
      act(() => useShellStore.getState().setTheme('dark'))
      expect(storageMock.writeTheme).toHaveBeenCalledWith('dark')
      expect(useShellStore.getState().theme).toBe('dark')
    })
  })

  describe('setAllowIllegalChanges', () => {
    it('persists the value and updates the store', () => {
      act(() => useShellStore.getState().setAllowIllegalChanges(false))
      expect(storageMock.writeAllowIllegalChanges).toHaveBeenCalledWith(false)
      expect(useShellStore.getState().allowIllegalChanges).toBe(false)
    })
  })

  describe('setApiBase', () => {
    it('persists the URL and updates the store', () => {
      act(() => useShellStore.getState().setApiBase('http://example.test'))
      expect(storageMock.writeApiBase).toHaveBeenCalledWith(
        'http://example.test',
      )
      expect(useShellStore.getState().apiBase).toBe('http://example.test')
    })
  })
})
