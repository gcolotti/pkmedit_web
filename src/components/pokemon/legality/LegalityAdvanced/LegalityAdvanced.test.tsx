import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalityReport, PokemonDetail } from '../../../../core/types/index/index'
import { LegalityAdvanced } from './LegalityAdvanced'

const t = ((key: string) => key) as Translator

const illegalReport: LegalityReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: '',
  checks: [
    { identifier: 'PID', severity: 'error', code: '0', valid: false, message: 'PID bad' },
  ],
}

const legalReport: LegalityReport = {
  slotId: 'a',
  legal: true,
  severity: 'ok',
  report: '',
  checks: [],
}

function makeDraft(legality: LegalityReport): PokemonDetail {
  return {
    summary: {
      slotId: 'a',
      present: true,
      species: 25,
      speciesName: 'Pikachu',
      form: 0,
      level: 5,
      shiny: false,
      gender: 1,
      nature: 0,
      ability: 1,
      abilityNumber: 0,
      heldItem: 0,
      ball: 4,
      legal: legality.legal,
      alpha: false,
      egg: false,
      hasItem: false,
      legalSeverity: legality.severity,
    },
    legality,
  } as unknown as PokemonDetail
}

describe('LegalityAdvanced', () => {
  it('shows the report and the fixes section when the slot is illegal', () => {
    render(
      <LegalityAdvanced
        draft={makeDraft(illegalReport)}
        t={t}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText('PID bad')).toBeInTheDocument()
    expect(screen.getByText('fixes')).toBeInTheDocument()
  })

  it('renders the stub fix labels from the catalog', () => {
    render(
      <LegalityAdvanced
        draft={makeDraft(illegalReport)}
        t={t}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText('Regenerate compatible PID')).toBeInTheDocument()
    expect(screen.getByText('Fix relearn moves')).toBeInTheDocument()
    expect(screen.getByText('Change met location')).toBeInTheDocument()
  })

  it('shows the safety badge for each fix', () => {
    render(
      <LegalityAdvanced
        draft={makeDraft(illegalReport)}
        t={t}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getAllByText('fixSafetySafe').length).toBeGreaterThan(0)
    expect(screen.getAllByText('fixSafetyRisky').length).toBeGreaterThan(0)
  })

  it('shows the "already legal" message when the slot is legal and hides fixes', () => {
    render(
      <LegalityAdvanced
        draft={makeDraft(legalReport)}
        t={t}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText('alreadyLegalNoFixes')).toBeInTheDocument()
    expect(screen.queryByText('Regenerate compatible PID')).toBeNull()
  })
})
