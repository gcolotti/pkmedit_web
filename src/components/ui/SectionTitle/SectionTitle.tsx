import type { ReactNode } from 'react'

export function SectionTitle({
  actionLabel,
  icon,
  onAction,
  title,
}: {
  actionLabel: string
  icon: ReactNode
  onAction: () => void
  title: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      <button className="btn min-h-9" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}
