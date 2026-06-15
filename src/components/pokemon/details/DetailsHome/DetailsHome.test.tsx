import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonCosmetic } from '../../../../core/types/pokemon/pokemon'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsHome } from './DetailsHome'

const t = ((key: string) => key) as Translator

const baseCosmetic: PokemonCosmetic = {
  alpha: false,
  height: 0,
  weight: 0,
  scale: 0,
  contest: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  markings: [],
  ribbons: [],
  homeTracker: 12345,
  formArgument: 0,
  formArgumentRemain: 0,
  formArgumentElapsed: 0,
  formArgumentMaximum: 0,
  extraBytes: [],
}

describe('DetailsHome', () => {
  it('renders the current homeTracker value in the input', () => {
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsHome
          cosmetic={baseCosmetic}
          t={t}
          onCosmeticChange={() => {}}
        />
      </FieldIssueProvider>,
    )
    expect(screen.getByLabelText('homeTracker')).toHaveValue(12345)
  })

  it('reports the new homeTracker when the input value changes', () => {
    const onCosmeticChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsHome
          cosmetic={baseCosmetic}
          t={t}
          onCosmeticChange={onCosmeticChange}
        />
      </FieldIssueProvider>,
    )
    const input = screen.getByLabelText('homeTracker')
    fireEvent.change(input, { target: { value: '99999' } })
    expect(onCosmeticChange).toHaveBeenLastCalledWith({
      ...baseCosmetic,
      homeTracker: 99999,
    })
  })

  it('resets homeTracker to 0 on right-click (onContextMenu)', async () => {
    const onCosmeticChange = vi.fn()
    render(
      <FieldIssueProvider paths={new Set()}>
        <DetailsHome
          cosmetic={baseCosmetic}
          t={t}
          onCosmeticChange={onCosmeticChange}
        />
      </FieldIssueProvider>,
    )
    // The input sits inside a label whose onContextMenu clears the value.
    const input = screen.getByLabelText('homeTracker')
    await userEvent.pointer({ target: input, keys: '[MouseRight]' })
    expect(onCosmeticChange).toHaveBeenLastCalledWith({
      ...baseCosmetic,
      homeTracker: 0,
    })
  })
})
