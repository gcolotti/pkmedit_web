import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Circle } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { MarkingToggle } from './MarkingToggle'

describe('MarkingToggle', () => {
  it('reports aria-pressed false when value is 0 (none)', () => {
    render(
      <MarkingToggle Icon={Circle} label="circle" value={0} onChange={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'circle' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('reports aria-pressed true when value is 1 (blue) or 2 (red)', () => {
    const { rerender } = render(
      <MarkingToggle Icon={Circle} label="circle" value={1} onChange={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'circle' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    rerender(
      <MarkingToggle Icon={Circle} label="circle" value={2} onChange={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'circle' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('cycles value 0 -> 1 -> 2 -> 0 on click and reports the next value', async () => {
    const onChange = vi.fn()
    render(
      <MarkingToggle Icon={Circle} label="circle" value={0} onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'circle' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('wraps from value 2 back to 0', async () => {
    const onChange = vi.fn()
    render(
      <MarkingToggle Icon={Circle} label="circle" value={2} onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'circle' }))
    expect(onChange).toHaveBeenLastCalledWith(0)
  })
})
