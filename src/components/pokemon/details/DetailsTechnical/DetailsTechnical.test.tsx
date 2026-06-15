import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { CatalogEntry } from '../../../../core/types/index/index'
import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokemonMain,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsTechnical } from './DetailsTechnical'

const t = ((key: string) => key) as Translator

const languageCatalog: CatalogEntry[] = [
  { id: 1, name: 'JPN' },
  { id: 2, name: 'ENG' },
  { id: 3, name: 'FRA' },
]

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
  handlingTrainerLanguage: 2,
  currentHandler: 'OT',
}

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
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={baseMain}
          t={t}
          trainer={baseTrainer}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.getByText('encryptionConstant')).toBeInTheDocument()
    expect(screen.getByText('3735928559')).toBeInTheDocument()
  })

  it('shows "unset" for handlingTrainerLanguage === 0 (closes the #0 bug)', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={baseMain}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerLanguage: 0 }}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    const select = screen.getByLabelText('htLanguage') as HTMLSelectElement
    expect(select.value).toBe('0')
    const unsetOption = screen.getByRole('option', { name: 'unset' })
    expect(unsetOption).toBeInTheDocument()
  })

  it('adds a "#N" fallback option when the current language is not in the catalog', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={baseMain}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerLanguage: 6 }}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.getByRole('option', { name: '#6' })).toBeInTheDocument()
  })

  it('does NOT add a "#N" fallback when the current language is in the catalog', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={baseMain}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerLanguage: 2 }}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.queryByRole('option', { name: '#2' })).toBeNull()
  })

  it('reports the new language when the user picks one from the dropdown', async () => {
    const onTrainerChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={baseMain}
          t={t}
          trainer={baseTrainer}
          onTrainerChange={onTrainerChange}
        />
      </FieldIssueProvider>,
    )
    const select = screen.getByLabelText('htLanguage')
    await userEvent.selectOptions(select, '1')
    expect(onTrainerChange).toHaveBeenLastCalledWith({
      ...baseTrainer,
      handlingTrainerLanguage: 1,
    })
  })
})
