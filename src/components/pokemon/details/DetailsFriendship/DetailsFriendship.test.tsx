import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { DetailsFriendship } from './DetailsFriendship'

const t = ((key: string) => key) as Translator

const trainer: PokemonTrainer = {
  originalTrainerName: 'Ash',
  tid16: 0,
  sid16: 0,
  displayTid: 0,
  displaySid: 0,
  originalTrainerGender: 0,
  originalTrainerFriendship: 70,
  handlingTrainerName: '',
  handlingTrainerGender: 0,
  handlingTrainerFriendship: 50,
  handlingTrainerLanguage: 2,
  currentHandler: 0,
}

describe('DetailsFriendship', () => {
  it('renders only the OT friendship when there is no handler', () => {
    render(
      <DetailsFriendship
        hasHandler={false}
        t={t}
        trainer={trainer}
        onTrainerChange={() => {}}
      />,
    )
    expect(screen.getByText('otFriendship')).toBeInTheDocument()
    expect(screen.queryByText('htFriendship')).toBeNull()
  })

  it('renders both OT and HT friendship when there is a handler', () => {
    render(
      <DetailsFriendship
        hasHandler={true}
        t={t}
        trainer={trainer}
        onTrainerChange={() => {}}
      />,
    )
    expect(screen.getByText('otFriendship')).toBeInTheDocument()
    expect(screen.getByText('htFriendship')).toBeInTheDocument()
  })
})
