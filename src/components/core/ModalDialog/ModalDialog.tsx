import { X } from 'lucide-react'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const panelWidths = {
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const

export function ModalDialog({
  children,
  closeLabel,
  title,
  width = 'md',
  onClose,
}: {
  children: ReactNode
  closeLabel: string
  title: string
  width?: keyof typeof panelWidths
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement
    overlayRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Portal to document.body: the app header and glass panels create stacking
  // contexts via backdrop-blur, which traps a fixed overlay rendered inside
  // them behind sibling panels.
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4"
      role="presentation"
      tabIndex={-1}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={`w-full ${panelWidths[width]} rounded-lg bg-white p-4 shadow-2xl dark:bg-stone-950`}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold" id={titleId}>
            {title}
          </h2>
          <button
            aria-label={closeLabel}
            className="btn h-8 w-8 p-0"
            title={closeLabel}
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  )
}
