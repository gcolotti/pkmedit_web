import { RefreshCw, X } from 'lucide-react'
import { useState } from 'react'

import type { ApiRegistration } from '../../../core/services/storage/storage'

export function ApiKeyDialog({
  apiRegistration,
  closeLabel,
  emptyLabel,
  expiresLabel,
  failureLabel,
  idLabel,
  rotateLabel,
  rotatingLabel,
  title,
  onClose,
  onRotate,
}: {
  apiRegistration: ApiRegistration | null
  closeLabel: string
  emptyLabel: string
  expiresLabel: string
  failureLabel: string
  idLabel: string
  rotateLabel: string
  rotatingLabel: string
  title: string
  onClose: () => void
  onRotate: () => Promise<void>
}) {
  const [rotating, setRotating] = useState(false)
  const [error, setError] = useState('')

  async function rotate() {
    setRotating(true)
    setError('')
    try {
      await onRotate()
    } catch {
      setError(failureLabel)
    } finally {
      setRotating(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4"
      role="button"
      tabIndex={-1}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <section
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white p-4 shadow-2xl dark:bg-stone-950"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold">{title}</h2>
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
        {apiRegistration ? (
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-semibold">{idLabel}</dt>
              <dd className="mt-1 break-all font-mono text-xs text-stone-600 dark:text-stone-300">
                {apiRegistration.appId}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">{expiresLabel}</dt>
              <dd className="mt-1 text-stone-600 dark:text-stone-300">
                {new Date(apiRegistration.expiresAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
            {emptyLabel}
          </p>
        )}
        <button
          className="btn mt-4 inline-flex items-center gap-2"
          disabled={rotating}
          type="button"
          onClick={() => void rotate()}
        >
          <RefreshCw aria-hidden="true" size={16} />
          {rotating ? rotatingLabel : rotateLabel}
        </button>
        {error && (
          <p className="mt-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
      </section>
    </div>
  )
}
