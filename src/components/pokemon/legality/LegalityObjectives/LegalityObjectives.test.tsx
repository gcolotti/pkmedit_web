import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import { LegalityObjectives } from './LegalityObjectives'

const t = ((key: string) => key) as Translator

describe('LegalityObjectives', () => {
  it('always shows the Shiny toggle and reflects the current target value', () => {
    render(
      <LegalityObjectives
        supportsAlpha={false}
        t={t}
        targetAlpha={false}
        targetShiny={true}
        onTargetAlphaChange={() => {}}
        onTargetShinyChange={() => {}}
      />,
    )
    const shiny = screen.getByRole('checkbox', { name: 'shiny' })
    expect(shiny).toBeChecked()
  })

  it('hides the Alpha toggle when the game version does not support alpha', () => {
    render(
      <LegalityObjectives
        supportsAlpha={false}
        t={t}
        targetAlpha={false}
        targetShiny={false}
        onTargetAlphaChange={() => {}}
        onTargetShinyChange={() => {}}
      />,
    )
    expect(screen.queryByRole('checkbox', { name: 'alpha' })).toBeNull()
  })

  it('shows the Alpha toggle when the game supports alpha', () => {
    render(
      <LegalityObjectives
        supportsAlpha={true}
        t={t}
        targetAlpha={true}
        targetShiny={false}
        onTargetAlphaChange={() => {}}
        onTargetShinyChange={() => {}}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
  })

  it('invokes the shiny change callback with the new value', async () => {
    const onTargetShinyChange = vi.fn()
    render(
      <LegalityObjectives
        supportsAlpha={false}
        t={t}
        targetAlpha={false}
        targetShiny={false}
        onTargetAlphaChange={() => {}}
        onTargetShinyChange={onTargetShinyChange}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'shiny' }))
    expect(onTargetShinyChange).toHaveBeenCalledWith(true)
  })

  it('invokes the alpha change callback with the new value', async () => {
    const onTargetAlphaChange = vi.fn()
    render(
      <LegalityObjectives
        supportsAlpha={true}
        t={t}
        targetAlpha={false}
        targetShiny={false}
        onTargetAlphaChange={onTargetAlphaChange}
        onTargetShinyChange={() => {}}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'alpha' }))
    expect(onTargetAlphaChange).toHaveBeenCalledWith(true)
  })
})
