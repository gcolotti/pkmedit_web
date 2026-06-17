import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import type {
  PokemonCosmetic,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsGroup } from './DetailsGroup'

const t = ((key: string) => key) as Translator
const languageCatalog: CatalogEntry[] = [
  { id: 1, name: 'JPN' },
  { id: 2, name: 'ENG' },
]

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
  currentHandler: 0,
}

const baseCosmetic: PokemonCosmetic = {
  alpha: false,
  height: 0,
  weight: 0,
  scale: 0,
  contest: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  markings: [0, 0, 0, 0, 0, 0],
  ribbons: [],
  homeTracker: 0,
  formArgument: 0,
  formArgumentRemain: 0,
  formArgumentElapsed: 0,
  formArgumentMaximum: 0,
  extraBytes: [],
}

describe('DetailsGroup', () => {
  it('renders the section titles and the Advanced button', () => {
    const onOpenAdvanced = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={onOpenAdvanced}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.getByText('trainerIdentity')).toBeInTheDocument()
    expect(screen.queryByText('trainerIds')).toBeNull()
    expect(screen.getByText('htLanguage')).toBeInTheDocument()
    expect(screen.getByText('friendship')).toBeInTheDocument()
    expect(screen.getByText('markings')).toBeInTheDocument()
    expect(screen.getByText('homeShort')).toBeInTheDocument()
    expect(screen.getByText('advanced')).toBeInTheDocument()
  })

  it('shows the real current handler as OT when no handler name is set', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    const otButton = screen.getByRole('button', { name: 'currentHandler: ot' })
    const htButton = screen.getByRole('button', { name: 'currentHandler: ht' })
    expect(otButton).toHaveAttribute('aria-pressed', 'true')
    expect(htButton).toBeDisabled()
    expect(screen.getByLabelText('htLanguage')).toBeDisabled()
  })

  it('keeps handler selection separate from the HT name', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerName: 'Misty' }}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    const otButton = screen.getByRole('button', { name: 'currentHandler: ot' })
    const htButton = screen.getByRole('button', { name: 'currentHandler: ht' })
    expect(otButton).toHaveAttribute('aria-pressed', 'true')
    expect(htButton).toHaveAttribute('aria-pressed', 'false')
    expect(htButton).not.toBeDisabled()
    expect(screen.getByLabelText('htLanguage')).toBeDisabled()
  })

  it('calls onTrainerChange when the current handler is selected', async () => {
    const onTrainerChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={1}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerName: 'Misty' }}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={onTrainerChange}
        />
      </FieldIssueProvider>,
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'currentHandler: ht' }),
    )
    expect(onTrainerChange).toHaveBeenLastCalledWith({
      ...baseTrainer,
      handlingTrainerName: 'Misty',
      currentHandler: 1,
      handlingTrainerLanguage: 1,
    })
  })

  it('displays the save trainer language when HT is current', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={1}
          t={t}
          trainer={{
            ...baseTrainer,
            currentHandler: 1,
            handlingTrainerLanguage: 2,
            handlingTrainerName: 'Misty',
          }}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )

    const select = screen.getByLabelText('htLanguage')
    expect(select).toHaveValue('1')
    expect(select).toBeDisabled()
  })

  it('opens the advanced view when the Advanced button is clicked', async () => {
    const onOpenAdvanced = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={onOpenAdvanced}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'advanced' }))
    expect(onOpenAdvanced).toHaveBeenCalledTimes(1)
  })

  it('calls onTrainerChange when the OT name is edited', () => {
    const onTrainerChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={onTrainerChange}
        />
      </FieldIssueProvider>,
    )
    const otInput = screen.getByRole('textbox', { name: 'ot' })
    fireEvent.change(otInput, { target: { value: 'Gary' } })
    expect(onTrainerChange).toHaveBeenLastCalledWith({
      ...baseTrainer,
      handlingTrainerLanguage: 0,
      originalTrainerName: 'Gary',
    })
  })

  it('clears HT trainer state when the HT name is removed', () => {
    const onTrainerChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          languageCatalog={languageCatalog}
          saveTrainerLanguage={2}
          t={t}
          trainer={{
            ...baseTrainer,
            currentHandler: 1,
            handlingTrainerFriendship: 99,
            handlingTrainerGender: 1,
            handlingTrainerLanguage: 2,
            handlingTrainerName: 'Misty',
          }}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={onTrainerChange}
        />
      </FieldIssueProvider>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'ht' }), {
      target: { value: '' },
    })
    expect(onTrainerChange).toHaveBeenLastCalledWith({
      ...baseTrainer,
      currentHandler: 0,
      handlingTrainerFriendship: 0,
      handlingTrainerGender: 0,
      handlingTrainerLanguage: 0,
      handlingTrainerName: '',
    })
  })
})
