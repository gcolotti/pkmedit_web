import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonMain } from '../../../../core/types/pokemon/pokemon'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsTechnical } from './DetailsTechnical'

const t = ((key: string) => key) as Translator

const baseMain: PokemonMain = {
  pid: 0,
  encryptionConstant: 0xdeadbeef,
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

describe('DetailsTechnical', () => {
  it('shows the Encryption Constant as a read-only value', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsTechnical main={baseMain} t={t} />
      </FieldIssueProvider>,
    )
    expect(screen.getByText('encryptionConstant')).toBeInTheDocument()
    expect(screen.getByText('3735928559')).toBeInTheDocument()
  })
})
