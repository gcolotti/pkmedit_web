import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ModalDialog } from './ModalDialog'

describe('ModalDialog', () => {
  it('portals the dialog to document.body so panel stacking contexts cannot cover it', () => {
    const { container } = render(
      <ModalDialog closeLabel="Close" title="Settings" onClose={() => {}}>
        <p>content</p>
      </ModalDialog>,
    )

    expect(container.querySelector('[role="dialog"]')).toBeNull()
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(document.body.contains(dialog)).toBe(true)
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog closeLabel="Close" title="Settings" onClose={onClose}>
        <p>content</p>
      </ModalDialog>,
    )

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes from the labelled close button', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog closeLabel="Close" title="Settings" onClose={onClose}>
        <p>content</p>
      </ModalDialog>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when clicking the backdrop but not the panel content', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog closeLabel="Close" title="Settings" onClose={onClose}>
        <p>content</p>
      </ModalDialog>,
    )

    await userEvent.click(screen.getByText('content'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the previously focused element on unmount', () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()

    const { unmount } = render(
      <ModalDialog closeLabel="Close" title="Settings" onClose={() => {}}>
        <p>content</p>
      </ModalDialog>,
    )

    expect(document.activeElement).not.toBe(outside)
    unmount()
    expect(document.activeElement).toBe(outside)

    outside.remove()
  })
})
