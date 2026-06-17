import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokemonCosmetic,
  PokemonMain,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { DetailsAdvanced } from './DetailsAdvanced'

const t = ((key: string) => key) as Translator

const baseTrainer: PokemonTrainer = {
  originalTrainerName: 'Ash',
  tid16: 0,
  sid16: 0,
  displayTid: 0,
  displaySid: 0,
  originalTrainerGender: 0,
  originalTrainerFriendship: 70,
  handlingTrainerName: '',
  handlingTrainerGender: 0,
  handlingTrainerFriendship: 70,
  handlingTrainerLanguage: 0,
  currentHandler: 0,
}

const baseMain: PokemonMain = {
  pid: 0,
  encryptionConstant: 0,
  nickname: '',
  isNicknamed: false,
  exp: 0,
  gender: 0,
  language: 2,
  statNature: 0,
  pokerusStrain: 0,
  pokerusDays: 0,
  infected: false,
  cured: false,
}

const baseCosmetic: PokemonCosmetic = {
  alpha: false,
  height: 0,
  weight: 0,
  scale: 0,
  contest: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  markings: [],
  ribbons: [],
  homeTracker: 0,
  formArgument: 0,
  formArgumentRemain: 0,
  formArgumentElapsed: 0,
  formArgumentMaximum: 0,
  extraBytes: [],
}

describe('DetailsAdvanced', () => {
  it('renders every advanced section title', () => {
    render(
      <DetailsAdvanced
        cosmetic={baseCosmetic}
        main={baseMain}
        t={t}
        trainer={baseTrainer}
        onBack={() => {}}
        onCosmeticChange={() => {}}
        onTrainerChange={() => {}}
      />,
    )
    expect(screen.getByText('trainerIds')).toBeInTheDocument()
    expect(screen.getByText('ribbons')).toBeInTheDocument()
    expect(screen.getByText('contestStats')).toBeInTheDocument()
    expect(screen.getByText('formCounters')).toBeInTheDocument()
    expect(screen.getByText('extraBytes')).toBeInTheDocument()
  })

  it('invokes onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    render(
      <DetailsAdvanced
        cosmetic={baseCosmetic}
        main={baseMain}
        t={t}
        trainer={baseTrainer}
        onBack={onBack}
        onCosmeticChange={() => {}}
        onTrainerChange={() => {}}
      />,
    )
    expect(screen.getByText('backToDetails')).toBeInTheDocument()
  })
})
