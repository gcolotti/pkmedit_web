import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { SecondaryEffect } from '../../../core/utils/moveParsers/moveParsers'

export function MoveCardSecondaryEffects({
  effects,
  t,
}: {
  effects: SecondaryEffect[]
  t: Translator
}) {
  if (effects.length === 0) return null
  return (
    <div className="mt-4 rounded-md border border-black/10 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('moveSecondaryEffects')}
      </div>
      <div className="grid gap-2">
        {effects.map((secondary, index) => (
          <div
            key={`${secondary.effect}-${index}`}
            className="grid gap-2 text-sm sm:grid-cols-[minmax(0,1fr)_5rem]"
          >
            <div className="font-semibold text-stone-700 dark:text-stone-200">
              {secondary.effect}
            </div>
            <div className="tabular-nums text-stone-500 dark:text-stone-400 sm:text-right">
              {secondary.chance}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
