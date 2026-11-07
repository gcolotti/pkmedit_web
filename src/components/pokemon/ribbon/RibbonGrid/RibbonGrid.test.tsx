import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PokemonRibbon } from '../../../../core/types/pokemon/pokemon'
import { RibbonGrid } from './RibbonGrid'

const ribbons: PokemonRibbon[] = [
  { id: 0, name: 'Kalos Champion', value: false },
  { id: 94, name: 'Cool', value: true, count: 2, maxCount: 4 },
]

function renderGrid(items = ribbons) {
  const onChange = vi.fn()
  render(
    <RibbonGrid
      emptyLabel="No ribbons"
      notObtainableLabel="Not obtainable"
      unverifiedLabel="Unverified"
      ribbons={items}
      onChange={onChange}
    />,
  )
  return onChange
}

describe('RibbonGrid', () => {
  it('warns when legality could not be verified', () => {
    renderGrid([{ ...ribbons[0], obtainable: null }])
    expect(screen.getByText('Unverified')).toBeInTheDocument()
  })

  it('shows no warning when legality is known', () => {
    renderGrid()
    expect(screen.queryByText('Unverified')).not.toBeInTheDocument()
  })

  it('flags ribbons held illegally so they can be removed', () => {
    const illegal = {
      id: 1,
      name: 'Champion (Gen3)',
      value: true,
      obtainable: false,
    }
    const onChange = renderGrid([illegal])
    const checkbox = screen.getByRole('checkbox', {
      name: 'Champion (Gen3): Not obtainable',
    })
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith([{ ...illegal, value: false }])
  })

  it('shows the empty label when the format has no ribbons', () => {
    renderGrid([])
    expect(screen.getByText('No ribbons')).toBeInTheDocument()
  })

  it('toggles flag ribbons', () => {
    const onChange = renderGrid()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Kalos Champion' }))
    expect(onChange).toHaveBeenCalledWith([
      { ...ribbons[0], value: true },
      ribbons[1],
    ])
  })

  it('edits count ribbons with a clamped number and syncs value', () => {
    const onChange = renderGrid()
    const input = screen.getByRole('spinbutton', { name: 'Cool' })
    expect(input).toHaveValue(2)
    expect(screen.getByText('/4')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: '9' } })
    expect(onChange).toHaveBeenLastCalledWith([
      ribbons[0],
      { ...ribbons[1], count: 4, value: true },
    ])

    fireEvent.change(input, { target: { value: '0' } })
    expect(onChange).toHaveBeenLastCalledWith([
      ribbons[0],
      { ...ribbons[1], count: 0, value: false },
    ])
  })
})
