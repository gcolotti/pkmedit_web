import { ArrowRight } from 'lucide-react'
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
  title = '',
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
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="flex flex-wrap items-start justify-between">
          <div className="flex items-center justify-between flex-col md:flex-row w-full p-2 gap-2">
            <h2 className="text-lg font-black">{title}</h2>
            <div className="flex items-center justify-between gap-2">
              {metrics && metrics.length > 0 && (
                <div className="flex items-center w-full gap-2">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10"
                    >
                      <div className="text-[0.65rem] font-semibold uppercase text-stone-500 dark:text-stone-400">
                        {metric.label}
                      </div>
                      <div className="text-sm font-bold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="btn inline-flex h-9 items-center px-3 text-sm"
              type="button"
              onClick={onBack}
            >
              <span>{backLabel}</span>
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
        </div>
        {toolbar && <div className="mt-4">{toolbar}</div>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}
