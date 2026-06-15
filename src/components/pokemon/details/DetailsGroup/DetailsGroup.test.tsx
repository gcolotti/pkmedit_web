import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokemonCosmetic,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsGroup } from './DetailsGroup'

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
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={onOpenAdvanced}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.getByText('trainerIdentity')).toBeInTheDocument()
    expect(screen.getByText('trainerIds')).toBeInTheDocument()
    expect(screen.getByText('friendship')).toBeInTheDocument()
    expect(screen.getByText('markings')).toBeInTheDocument()
    expect(screen.getByText('homeShort')).toBeInTheDocument()
    expect(screen.getByText('advanced')).toBeInTheDocument()
  })

  it('shows the current handler badge as "ot" when no handler name is set', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          t={t}
          trainer={baseTrainer}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    // The current-handler badge is rendered next to the currentHandler label
    // and shows the trainer key ('ot' or 'ht'). When no handler is present,
    // the badge reads 'ot'.
    const indicators = screen.getAllByText('ot')
    expect(indicators.length).toBeGreaterThan(0)
  })

  it('switches the current handler badge to "ht" when a handler name is present', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
          t={t}
          trainer={{ ...baseTrainer, handlingTrainerName: 'Misty' }}
          onCosmeticChange={() => {}}
          onOpenAdvanced={() => {}}
          onTrainerChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    // With a handler, the indicator is 'ht'. The HT field label is also 'ht'.
    const htElements = screen.getAllByText('ht')
    expect(htElements.length).toBeGreaterThanOrEqual(2)
  })

  it('opens the advanced view when the Advanced button is clicked', async () => {
    const onOpenAdvanced = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsGroup
          cosmetic={baseCosmetic}
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
      originalTrainerName: 'Gary',
    })
  })
})
