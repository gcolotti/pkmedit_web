import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalityReport } from '../../../../core/types/index/index'
import { LegalityStatus } from './LegalityStatus'

const t = ((key: string, params?: Record<string, unknown>) => {
  if (!params) return key
  let out = key
  for (const [k, v] of Object.entries(params)) {
    out = out.replace(`{${k}}`, String(v))
  }
  return out
}) as Translator

const legalReport: LegalityReport = {
  slotId: 'a',
  legal: true,
  severity: 'ok',
  report: '',
  checks: [],
}

const illegalReport: LegalityReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: 'illegal',
  checks: [{ identifier: 'X', severity: 'error', code: '0', valid: false, message: 'bad' }],
}

const warningsReport: LegalityReport = {
  slotId: 'a',
  legal: true,
  severity: 'warn',
  report: 'warnings',
  checks: [
    { identifier: 'X', severity: 'warn', code: '0', valid: false, message: 'suspicious' },
  ],
}

describe('LegalityStatus', () => {
  it('renders the "unchecked" tone when legality is null', () => {
    render(<LegalityStatus checkedAt={null} legality={null} t={t} />)
    expect(screen.getByText('legalityUnchecked')).toBeInTheDocument()
  })

  it('renders the "legal" tone when legality.legal and no invalid checks', () => {
    render(<LegalityStatus checkedAt={null} legality={legalReport} t={t} />)
    expect(screen.getByText('legalityLegal')).toBeInTheDocument()
  })

  it('renders the "illegal" tone when legality.legal is false', () => {
    render(<LegalityStatus checkedAt={null} legality={illegalReport} t={t} />)
    expect(screen.getByText('legalityIllegal')).toBeInTheDocument()
  })

  it('renders the "warnings" tone when legal but some checks are invalid', () => {
    render(<LegalityStatus checkedAt={null} legality={warningsReport} t={t} />)
    expect(screen.getByText('legalityWarnings')).toBeInTheDocument()
  })

  it('shows the "last checked" line with interpolated seconds when checkedAt is set', () => {
    const now = Date.now()
    render(
      <LegalityStatus
        checkedAt={now - 5000}
        legality={legalReport}
        t={t}
      />,
    )
    expect(screen.getByText('lastChecked')).toBeInTheDocument()
  })
})
