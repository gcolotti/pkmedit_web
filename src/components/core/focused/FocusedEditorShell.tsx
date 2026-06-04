import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export type FocusedEditorMetric = {
  label: string
  value: string | number
}

export function FocusedEditorShell({
  backLabel,
  children,
  metrics,
  subtitle: _subtitle,
  title: _title,
  toolbar,
  onBack,
}: {
  backLabel: string
  children: ReactNode
  metrics?: FocusedEditorMetric[]
  subtitle?: string
  title?: string
  toolbar?: ReactNode
  onBack: () => void
}) {
  return (
    <section className="glass-panel flex min-h-[70vh] flex-col overflow-hidden rounded-lg xl:min-h-0">
      <header className="border-b border-black/10 p-4 dark:border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              className="btn mb-3 inline-flex h-9 items-center gap-2 px-3 text-sm"
              type="button"
              onClick={onBack}
            >
              <ArrowLeft aria-hidden="true" size={16} />
              <span>{backLabel}</span>
            </button>
          </div>
          {metrics && metrics.length > 0 && (
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[26rem] sm:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10"
                >
                  <div className="text-[0.65rem] font-semibold uppercase text-stone-500 dark:text-stone-400">
                    {metric.label}
                  </div>
                  <div className="text-lg font-bold">{metric.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {toolbar && <div className="mt-4">{toolbar}</div>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}
