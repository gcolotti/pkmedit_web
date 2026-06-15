import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import { DetailsMarkings } from './DetailsMarkings'

const t = ((key: string) => key) as Translator

describe('DetailsMarkings', () => {
  it('renders one toggle per marking, with shape-localized labels', () => {
    const markings = [0, 0, 0, 0, 0, 0]
    render(<DetailsMarkings markings={markings} t={t} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'markingCircle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'markingTriangle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'markingSquare' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'markingHeart' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'markingStar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'markingDiamond' })).toBeInTheDocument()
  })

  it('replaces only the toggled index in the markings array on click', async () => {
    const onChange = vi.fn()
    render(<DetailsMarkings markings={[0, 0, 0]} t={t} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'markingTriangle' }))

    expect(onChange).toHaveBeenCalledWith([0, 1, 0])
  })

  it('preserves the rest of the array when a single marking is toggled', async () => {
    const onChange = vi.fn()
    render(<DetailsMarkings markings={[1, 2, 0, 1, 0, 0]} t={t} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'markingStar' }))

    expect(onChange).toHaveBeenCalledWith([1, 2, 0, 1, 1, 0])
  })
})
