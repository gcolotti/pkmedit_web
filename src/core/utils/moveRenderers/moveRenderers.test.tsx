import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Translator } from '../../i18n/i18n/i18n'
import { renderEffect, renderStat } from './moveRenderers'

const t = ((key: string) => key) as Translator

describe('renderStat', () => {
  it('renders the label and value', () => {
    render(renderStat('Power', '90') as React.ReactElement)
    expect(screen.getByText('Power')).toBeInTheDocument()
    expect(screen.getByText('90')).toBeInTheDocument()
  })

  it('sets the title attribute to the value', () => {
    render(renderStat('Accuracy', '100%') as React.ReactElement)
    expect(screen.getByText('100%').getAttribute('title')).toBe('100%')
  })
})

describe('renderEffect', () => {
  it('renders the label and the effect text when text is non-null', () => {
    render(
      renderEffect(
        'Effect',
        'Inflicts regular damage.',
        t,
      ) as React.ReactElement,
    )
    expect(screen.getByText('Effect')).toBeInTheDocument()
    expect(screen.getByText('Inflicts regular damage.')).toBeInTheDocument()
  })

  it('falls back to "moveEffectUnavailable" message when text is null', () => {
    render(renderEffect('Effect', null, t) as React.ReactElement)
    expect(screen.getByText('moveEffectUnavailable')).toBeInTheDocument()
  })
})
