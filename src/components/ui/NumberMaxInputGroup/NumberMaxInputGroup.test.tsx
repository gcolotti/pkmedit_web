import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NumberMaxInputGroup } from './NumberMaxInputGroup'

function renderGroup(onValueChange = vi.fn()) {
  render(
    <NumberMaxInputGroup
      label="Count: Potion"
      max={99}
      maxLabel="Max Count: Potion"
      maxText="Max"
      value={4}
      onValueChange={onValueChange}
    />,
  )
  return onValueChange
}

describe('NumberMaxInputGroup', () => {
  it('sets the pocket maximum from the MAX button', async () => {
    const onValueChange = renderGroup()

    await userEvent.click(
      screen.getByRole('button', { name: 'Max Count: Potion' }),
    )

    expect(onValueChange).toHaveBeenCalledWith(99)
  })

  it('clamps typed counts to the maximum', () => {
    const onValueChange = renderGroup()

    fireEvent.change(screen.getByLabelText('Count: Potion'), {
      target: { value: '250' },
    })

    expect(onValueChange).toHaveBeenCalledWith(99)
  })
})
