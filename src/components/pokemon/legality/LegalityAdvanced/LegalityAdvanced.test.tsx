import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  LegalFix,
  LegalityReport,
} from '../../../../core/types/index/index'
import { LegalityAdvanced } from './LegalityAdvanced'

const t = ((key: string) => key) as Translator

const illegalReport: LegalityReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: '',
  checks: [
    {
      identifier: 'PID',
      severity: 'error',
      code: '0',
      valid: false,
      message: 'PID bad',
    },
  ],
}

const legalReport: LegalityReport = {
  slotId: 'a',
  legal: true,
  severity: 'ok',
  report: '',
  checks: [],
}

const fixes: LegalFix[] = [
  { id: 'reroll-pid-compatible', safety: 'safe', fields: ['main.pid'] },
  { id: 'replace-relearn-moves', safety: 'risky', fields: ['moves'] },
  { id: 'regenerate-from-encounter', safety: 'manual', fields: ['main'] },
]

function renderAdvanced(
  legality: LegalityReport,
  overrides: Partial<ComponentProps<typeof LegalityAdvanced>> = {},
) {
  return render(
    <LegalityAdvanced
      applyingFixId={null}
      fixes={fixes}
      fixesError={null}
      fixesLoading={false}
      legality={legality}
      t={t}
      onApplyAllSafeFixes={vi.fn()}
      onApplyFix={vi.fn()}
      onBack={vi.fn()}
      {...overrides}
    />,
  )
}

describe('LegalityAdvanced', () => {
  it('shows the report and the fixes section when the slot is illegal', () => {
    renderAdvanced(illegalReport)
    expect(screen.getByText('PID bad')).toBeInTheDocument()
    expect(screen.getByText('fixes')).toBeInTheDocument()
  })

  it('renders localized fix labels from the catalog', () => {
    renderAdvanced(illegalReport)
    expect(screen.getByText('fixRerollPidLabel')).toBeInTheDocument()
    expect(screen.getByText('fixReplaceRelearnMovesLabel')).toBeInTheDocument()
    expect(
      screen.getByText('fixRegenerateFromEncounterLabel'),
    ).toBeInTheDocument()
  })

  it('shows the safety badge for each fix', () => {
    renderAdvanced(illegalReport)
    expect(screen.getAllByText('fixSafetySafe').length).toBeGreaterThan(0)
    expect(screen.getAllByText('fixSafetyRisky').length).toBeGreaterThan(0)
    expect(screen.getAllByText('fixSafetyManual').length).toBeGreaterThan(0)
  })

  it('shows the "already legal" message when the slot is legal and hides fixes', () => {
    renderAdvanced(legalReport)
    expect(screen.getByText('alreadyLegalNoFixes')).toBeInTheDocument()
    expect(screen.queryByText('fixRerollPidLabel')).toBeNull()
  })

  it('calls the apply callbacks for individual and safe fixes', async () => {
    const onApplyFix = vi.fn()
    const onApplyAllSafeFixes = vi.fn()
    renderAdvanced(illegalReport, { onApplyAllSafeFixes, onApplyFix })

    await userEvent.click(
      screen.getAllByRole('button', { name: 'applyFix' })[0],
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'applyAllSafeFixes' }),
    )

    expect(onApplyFix).toHaveBeenCalledWith('reroll-pid-compatible')
    expect(onApplyAllSafeFixes).toHaveBeenCalledTimes(1)
  })
})
