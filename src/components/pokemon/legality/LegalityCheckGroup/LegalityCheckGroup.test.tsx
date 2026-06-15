import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { LegalityReport } from '../../../../core/types/index/index'
import { LegalityCheckGroup } from './LegalityCheckGroup'

const checks: LegalityReport['checks'] = [
  { identifier: 'PID', severity: 'error', code: '1', valid: true, message: 'PID matches' },
  { identifier: 'PID', severity: 'error', code: '2', valid: false, message: 'PID mismatch' },
  { identifier: 'PID', severity: 'error', code: '3', valid: false, message: 'Shiny state wrong' },
]

describe('LegalityCheckGroup', () => {
  it('renders one row per check with its message', () => {
    render(<LegalityCheckGroup checks={checks} title="PID" />)

    expect(screen.getByText('PID matches')).toBeInTheDocument()
    expect(screen.getByText('PID mismatch')).toBeInTheDocument()
    expect(screen.getByText('Shiny state wrong')).toBeInTheDocument()
  })

  it('shows the group title in the section header', () => {
    render(<LegalityCheckGroup checks={checks} title="PID" />)
    expect(screen.getByText('PID')).toBeInTheDocument()
  })

  it('renders all rows even when some are valid (so users can see the whole picture)', () => {
    const mixed: LegalityReport['checks'] = [
      { identifier: 'X', severity: 'error', code: '0', valid: true, message: 'ok' },
      { identifier: 'X', severity: 'error', code: '0', valid: false, message: 'bad' },
    ]
    render(<LegalityCheckGroup checks={mixed} title="X" />)
    expect(screen.getByText('ok')).toBeInTheDocument()
    expect(screen.getByText('bad')).toBeInTheDocument()
  })
})
