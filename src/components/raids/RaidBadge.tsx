import type { ReactNode } from 'react'

export function RaidBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-black/10 bg-black/[0.03] px-2 py-0.5 text-xs font-semibold dark:border-white/10 dark:bg-white/[0.05]">
      {children}
    </span>
  )
}
