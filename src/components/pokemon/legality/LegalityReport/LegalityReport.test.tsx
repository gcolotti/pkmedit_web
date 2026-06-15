import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalityReport } from '../../../../core/types/index/index'
import { LegalityReport } from './LegalityReport'

const t = ((key: string) => key) as Translator

describe('LegalityReport', () => {
  it('shows the unchecked message when legality is null', () => {
    render(<LegalityReport legality={null} t={t} />)
    expect(screen.getByText('legalityUnchecked')).toBeInTheDocument()
  })

  it('renders the legal label when the report is legal and has no checks', () => {
    const report: LegalityReport = {
      slotId: 'a',
      legal: true,
      severity: 'ok',
      report: 'all good',
      checks: [],
    }
    render(<LegalityReport legality={report} t={t} />)
    expect(screen.getByText('legalityLegal')).toBeInTheDocument()
  })

  it('groups checks by their identifier and shows each group title', () => {
    const report: LegalityReport = {
      slotId: 'a',
      legal: false,
      severity: 'error',
      report: '',
      checks: [
        { identifier: 'PID', severity: 'error', code: '0', valid: false, message: 'pid bad' },
        { identifier: 'Encounter', severity: 'error', code: '0', valid: false, message: 'no match' },
        { identifier: 'PID', severity: 'error', code: '0', valid: true, message: 'pid ok' },
      ],
    }
    render(<LegalityReport legality={report} t={t} />)

    expect(screen.getByText('PID')).toBeInTheDocument()
    expect(screen.getByText('Encounter')).toBeInTheDocument()
    expect(screen.getByText('pid bad')).toBeInTheDocument()
    expect(screen.getByText('pid ok')).toBeInTheDocument()
    expect(screen.getByText('no match')).toBeInTheDocument()
  })

  it('falls back to the generic "checks" group when identifier is empty', () => {
    const report: LegalityReport = {
      slotId: 'a',
      legal: false,
      severity: 'error',
      report: '',
      checks: [
        { identifier: '', severity: 'error', code: '0', valid: false, message: 'orphan' },
      ],
    }
    render(<LegalityReport legality={report} t={t} />)
    expect(screen.getByText('checks')).toBeInTheDocument()
    expect(screen.getByText('orphan')).toBeInTheDocument()
  })

  it('falls back to the report text when there are no checks', () => {
    const report: LegalityReport = {
      slotId: 'a',
      legal: false,
      severity: 'error',
      report: 'no detail available',
      checks: [],
    }
    render(<LegalityReport legality={report} t={t} />)
    expect(screen.getByText('no detail available')).toBeInTheDocument()
  })
})
