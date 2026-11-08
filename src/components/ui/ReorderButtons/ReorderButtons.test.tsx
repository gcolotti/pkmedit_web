import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ReorderButtons } from './ReorderButtons'

describe('ReorderButtons', () => {
  it('moves the row and disables the edge it cannot cross', async () => {
    const onMoveDown = vi.fn()
    render(
      <ReorderButtons
        canMoveDown
        canMoveUp={false}
        moveDownLabel="Move down: Potion"
        moveUpLabel="Move up: Potion"
        onMoveDown={onMoveDown}
        onMoveUp={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Move up: Potion' }),
    ).toBeDisabled()
    await userEvent.click(
      screen.getByRole('button', { name: 'Move down: Potion' }),
    )
    expect(onMoveDown).toHaveBeenCalledOnce()
  })
})
