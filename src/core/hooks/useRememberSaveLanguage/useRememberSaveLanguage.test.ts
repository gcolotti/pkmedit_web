import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { readSaveLanguage } from '../../services/storage/storage'
import type { TrainerInfo } from '../../types/trainer/trainer'
import { useRememberSaveLanguage } from './useRememberSaveLanguage'

const ENGLISH = 2
const SPANISH = 7

const trainer = (overrides: Partial<TrainerInfo>) =>
  ({ language: ENGLISH, languageInferred: true, ...overrides }) as TrainerInfo

describe('useRememberSaveLanguage', () => {
  beforeEach(() => localStorage.clear())

  it('remembers a language changed on an inferred-language save', () => {
    renderHook(() =>
      useRememberSaveLanguage(
        'Cristal.dat',
        trainer({}),
        trainer({ language: SPANISH }),
      ),
    )

    expect(readSaveLanguage('Cristal.dat')).toBe(SPANISH)
  })

  it('does not pin the detected language when nothing changed', () => {
    renderHook(() =>
      useRememberSaveLanguage('Cristal.dat', trainer({}), trainer({})),
    )

    expect(readSaveLanguage('Cristal.dat')).toBeUndefined()
  })

  it('ignores saves that store their own language', () => {
    renderHook(() =>
      useRememberSaveLanguage(
        'HeartGold.sav',
        trainer({ languageInferred: false }),
        trainer({ language: SPANISH }),
      ),
    )

    expect(readSaveLanguage('HeartGold.sav')).toBeUndefined()
  })
})
