import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import { FieldIssueProvider } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsHtLanguage } from './DetailsHtLanguage'

const t = ((key: string) => key) as Translator

const languageCatalog: CatalogEntry[] = [
  { id: 1, name: 'JPN' },
  { id: 2, name: 'ENG' },
  { id: 3, name: 'FRA' },
]

function renderField({
  value = 2,
}: {
  value?: number
} = {}) {
  render(
    <FieldIssueProvider paths={new Set()}>
      <DetailsHtLanguage
        languageCatalog={languageCatalog}
        t={t}
        value={value}
      />
    </FieldIssueProvider>,
  )
}

describe('DetailsHtLanguage', () => {
  it('is always visible but disabled', () => {
    renderField()
    const select = screen.getByLabelText('htLanguage')
    expect(select).toBeVisible()
    expect(select).toBeDisabled()
  })

  it('shows "unset" for handlingTrainerLanguage === 0 (closes the #0 bug)', () => {
    renderField({ value: 0 })
    const select = screen.getByLabelText('htLanguage')
    expect(select).toHaveValue('0')
    expect(screen.getByRole('option', { name: 'unset' })).toBeInTheDocument()
  })

  it('adds a "#N" fallback option when the current language is not in the catalog', () => {
    renderField({ value: 6 })
    expect(screen.getByRole('option', { name: '#6' })).toBeInTheDocument()
  })

  it('does NOT add a "#N" fallback when the current language is in the catalog', () => {
    renderField({ value: 2 })
    expect(screen.queryByRole('option', { name: '#2' })).toBeNull()
  })
})
