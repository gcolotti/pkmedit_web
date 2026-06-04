// Mock the storage module so the shell store side effects (cookie/localStorage
// writes triggered by setLanguage) don't leak into other tests.
import { vi } from 'vitest'

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

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useShellStore } from '../../state/shellStore/shellStore'
import { useTranslator } from './useTranslator'

describe('useTranslator', () => {
  beforeEach(() => {
    useShellStore.setState({
      language: 'en',
      theme: 'light',
      allowIllegalChanges: true,
      apiBase: 'http://localhost:8080',
    })
  })

  it('returns a translator that reflects the current shell language', () => {
    const { result } = renderHook(() => useTranslator())
    expect(result.current('cancel')).toBe('Cancel')
  })

  it('returns a different translator after the shell language changes', () => {
    const { result } = renderHook(() => useTranslator())
    const enResult = result.current
    expect(enResult('cancel')).toBe('Cancel')

    act(() => useShellStore.getState().setLanguage('es'))
    const esResult = result.current
    // The translator instance changes after the language change.
    expect(esResult).not.toBe(enResult)
    expect(esResult('cancel')).toBe('Cancelar')
  })
})
