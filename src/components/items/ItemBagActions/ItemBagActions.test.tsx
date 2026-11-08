import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import { ItemBagActions } from './ItemBagActions'

const t = ((key: string) => key) as Translator

// Crystal Items pocket (Gen 2 IDs).
const entries = [
  { id: 18, name: 'Potion' },
  { id: 17, name: 'Super Potion' },
  { id: 9, name: 'Antidote' },
]

function renderActions(canAdd = true) {
  const onAddItem = vi.fn()
  render(
    <ItemBagActions
      addEntries={entries}
      canAdd={canAdd}
      canGiveAll
      getItemImageUrl={() => undefined}
      giveAllCount={999}
      maxCount={99}
      t={t}
      onAddItem={onAddItem}
      onGiveAll={vi.fn()}
      onGiveAllCountChange={vi.fn()}
    />,
  )
  return onAddItem
}

describe('ItemBagActions add field', () => {
  it('filters the pocket items and adds the picked one', async () => {
    const onAddItem = renderActions()
    const input = screen.getByRole('combobox', { name: 'addItem' })

    await userEvent.click(input)
    await userEvent.type(input, 'potion')

    const options = screen.getAllByRole('option').map((o) => o.textContent)
    expect(options.some((text) => text?.includes('Antidote'))).toBe(false)

    await userEvent.click(screen.getByRole('option', { name: /^Potion/ }))
    expect(onAddItem).toHaveBeenCalledWith(18)
    expect(input).toHaveValue('')
  })

  it('is disabled when the pocket is full', () => {
    renderActions(false)

    expect(screen.getByRole('combobox', { name: 'addItem' })).toBeDisabled()
  })
})
