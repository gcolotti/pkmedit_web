import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { DetailsTrainerIds } from './DetailsTrainerIds'

const t = ((key: string) => key) as Translator

const baseTrainer: PokemonTrainer = {
  originalTrainerName: 'Ash',
  tid16: 12345,
  sid16: 54321,
  displayTid: 12345,
  displaySid: 54321,
  originalTrainerGender: 0,
  originalTrainerFriendship: 70,
  handlingTrainerName: '',
  handlingTrainerGender: 0,
  handlingTrainerFriendship: 70,
  handlingTrainerLanguage: 2,
  currentHandler: 'OT',
}

describe('DetailsTrainerIds', () => {
  it('shows displayTid and displaySid as the editable Trainer ID / Secret ID', () => {
    const onTrainerChange = vi.fn()
    render(
      <DetailsTrainerIds
        t={t}
        trainer={baseTrainer}
        onTrainerChange={onTrainerChange}
      />,
    )
    expect(screen.getByText('displayTid')).toBeInTheDocument()
    expect(screen.getByText('displaySid')).toBeInTheDocument()
  })

  it('shows the raw tid16/sid16 values as internal read-only fields', () => {
    render(
      <DetailsTrainerIds
        t={t}
        trainer={baseTrainer}
        onTrainerChange={() => {}}
      />,
    )
    expect(screen.getByText('12345')).toBeInTheDocument()
    expect(screen.getByText('54321')).toBeInTheDocument()
    expect(screen.getByText('tid16 · internal')).toBeInTheDocument()
    expect(screen.getByText('sid16 · internal')).toBeInTheDocument()
  })
})
