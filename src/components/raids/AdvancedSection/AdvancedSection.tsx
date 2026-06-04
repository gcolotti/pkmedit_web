import type { ReactNode } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'

export function AdvancedSection({
  children,
  t,
}: {
  children: ReactNode
  t: Translator
}): ReactNode {
  return (
    <div className="border-t border-black/10 pt-4 dark:border-white/10">
      <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('raidAdvancedMode')}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  )
}
