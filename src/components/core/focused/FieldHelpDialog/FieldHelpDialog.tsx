import { X } from 'lucide-react'
import { useEffect } from 'react'

export type FieldHelpContent = {
  body: string
  example?: string
  range: string
  risk?: string
  sourceLabel?: string
  sourceUrl?: string
  title: string
}

export function FieldHelpDialog({
  allowedValuesLabel,
  closeLabel,
  content,
  exampleLabel,
  riskLabel,
  onClose,
}: {
  allowedValuesLabel: string
  closeLabel: string
  content: FieldHelpContent
  exampleLabel: string
  riskLabel: string
  onClose: () => void
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4"
      role="button"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose()
      }}
    >
      <section
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white p-4 shadow-2xl dark:bg-stone-950"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold">{content.title}</h2>
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
        <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
          {content.body}
        </p>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-semibold">{allowedValuesLabel}</dt>
            <dd className="mt-1 font-mono text-xs text-stone-600 dark:text-stone-300">
              {content.range}
            </dd>
          </div>
          {content.example && (
            <div>
              <dt className="font-semibold">{exampleLabel}</dt>
              <dd className="mt-1 text-stone-600 dark:text-stone-300">
                {content.example}
              </dd>
            </div>
          )}
          {content.risk && (
            <div>
              <dt className="font-semibold">{riskLabel}</dt>
              <dd className="mt-1 text-stone-600 dark:text-stone-300">
                {content.risk}
              </dd>
            </div>
          )}
        </dl>
        {content.sourceUrl && content.sourceLabel && (
          <a
            className="mt-4 inline-flex text-sm font-semibold text-sky-700 underline dark:text-sky-300"
            href={content.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            {content.sourceLabel}
          </a>
        )}
      </section>
    </div>
  )
}
