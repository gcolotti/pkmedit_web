import type { ReactNode } from 'react'

import { TechnicalHelpButton } from '../TechnicalHelpButton/TechnicalHelpButton'

export function TechnicalFieldLabel<T extends string>({
  children,
  helpLabel,
  topic,
  onHelp,
}: {
  children: ReactNode
  helpLabel: string
  topic: T
  onHelp: (topic: T) => void
}) {
  return (
    <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase text-stone-500 dark:text-stone-400">
      {children}
      <TechnicalHelpButton label={helpLabel} topic={topic} onHelp={onHelp} />
    </span>
  )
}
