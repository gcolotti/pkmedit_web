import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { MoveFlag } from '../../../core/utils/moveFlags/moveFlags'

export function MoveCardFlags({
  flags,
  t,
}: {
  flags: { flag: string; labelKey: MoveFlag }[]
  t: Translator
}) {
  if (flags.length === 0) return null
  return (
    <div className="mt-4">
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('moveFlags')}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {flags.map(({ flag, labelKey }) => (
          <span
            key={flag}
            className="rounded border border-black/10 bg-white/60 px-2 py-0.5 text-xs font-medium text-stone-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300"
          >
            {t(labelKey)}
          </span>
        ))}
      </div>
    </div>
  )
}
