import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { TrainerInfo } from '../../../core/types/trainer/trainer'
import { TrainerIdentitySection } from './TrainerIdentitySection'

const t = ((key: string) => key) as Translator

const makeTrainer = (overrides: Partial<TrainerInfo> = {}): TrainerInfo => ({
  otName: 'Butch',
  gender: 0,
  language: 2,
  displayTID: 10982,
  displaySID: 0,
  money: 3508,
  playedHours: null,
  playedMinutes: null,
  playedSeconds: null,
  lastSaved: null,
  canEditPlayTime: false,
  canEditMoney: true,
  saveKind: 'main',
  gameFields: [],
  gameActions: [],
  images: [],
  timeline: [],
  map: null,
  royale: null,
  dlc: null,
  ...overrides,
})

function renderSection(trainer: TrainerInfo) {
  const onChange = vi.fn()
  render(
    <TrainerIdentitySection
      catalogs={{ languages: [] }}
      t={t}
      trainer={trainer}
      onChange={onChange}
    />,
  )
  return onChange
}

describe('TrainerIdentitySection money', () => {
  it('MAX sets the game money cap (Crystal: 999,999)', async () => {
    const onChange = renderSection(makeTrainer({ maxMoney: 999_999 }))

    await userEvent.click(
      screen.getByRole('button', { name: 'maxShort money' }),
    )

    expect(onChange).toHaveBeenCalledWith('money', 999_999)
  })

  it('clamps typed money to the game cap', () => {
    const onChange = renderSection(makeTrainer({ maxMoney: 999_999 }))

    fireEvent.change(screen.getByLabelText('money'), {
      target: { value: '5000000' },
    })

    expect(onChange).toHaveBeenCalledWith('money', 999_999)
  })

  it('falls back to 9,999,999 when the backend sends no cap', async () => {
    const onChange = renderSection(makeTrainer())

    await userEvent.click(
      screen.getByRole('button', { name: 'maxShort money' }),
    )

    expect(onChange).toHaveBeenCalledWith('money', 9_999_999)
  })
})

describe('TrainerIdentitySection language', () => {
  it('explains that Gen 1-3 languages are detected, not stored', () => {
    renderSection(makeTrainer({ languageInferred: true }))

    expect(screen.getByText('saveLanguageInferredHint')).toBeInTheDocument()
  })

  it('shows no hint for saves that store their language', () => {
    renderSection(makeTrainer({ languageInferred: false }))

    expect(screen.queryByText('saveLanguageInferredHint')).toBeNull()
  })
})
