import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../i18n/i18n/i18n'
import type { GenerationEffectChange } from '../generationData/generationData'
import {
  renderCategoryStat,
  renderMoveEffectInCombat,
} from './generationRendering'

const t = ((key: string, params?: Record<string, unknown>) => {
  if (params) {
    let out = key
    for (const [k, v] of Object.entries(params)) {
      out = out.replace(`{${k}}`, String(v))
    }
    return out
  }
  return key
}) as Translator

describe('renderCategoryStat', () => {
  it('renders an image when category is known', () => {
    render(renderCategoryStat(0, t) as React.ReactElement)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toContain('state.png')
    expect(img.getAttribute('alt')).toBe('moveCategoryStatus')
  })

  it('renders a dash when category is null', () => {
    render(renderCategoryStat(null, t) as React.ReactElement)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders a dash when category has no icon mapping', () => {
    render(renderCategoryStat(99, t) as React.ReactElement)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('always shows the moveCategory label', () => {
    render(renderCategoryStat(1, t) as React.ReactElement)
    expect(screen.getByText('moveCategory')).toBeInTheDocument()
  })
})

describe('renderMoveEffectInCombat', () => {
  it('shows the current effect text when provided', () => {
    render(
      renderMoveEffectInCombat(
        'Effective against foes.',
        [],
        t,
      ) as React.ReactElement,
    )
    expect(screen.getByText('Effective against foes.')).toBeInTheDocument()
  })

  it('shows the unavailable message when current is null', () => {
    render(renderMoveEffectInCombat(null, [], t) as React.ReactElement)
    expect(screen.getByText('moveEffectUnavailable')).toBeInTheDocument()
  })

  it('renders a section per change', () => {
    const changes: GenerationEffectChange[] = [
      { generation: 5, text: 'Gen 5 effect.' },
      { generation: 3, text: 'Gen 3 effect.' },
    ]
    render(
      renderMoveEffectInCombat('current', changes, t) as React.ReactElement,
    )
    expect(screen.getByText('Gen 5 effect.')).toBeInTheDocument()
    expect(screen.getByText('Gen 3 effect.')).toBeInTheDocument()
    // The header is localized as "moveGenerationSingle" with a {generation} param
    expect(screen.getAllByText(/moveGenerationSingle/).length).toBeGreaterThan(
      0,
    )
  })

  it('does not render the changes section when changes is empty', () => {
    const { container } = render(
      renderMoveEffectInCombat('current', [], t) as React.ReactElement,
    )
    expect(container.querySelectorAll('.border-black\\/10').length).toBe(0)
  })
})
