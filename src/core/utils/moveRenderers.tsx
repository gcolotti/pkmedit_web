import type { ReactNode } from 'react'

import type { Translator } from '../i18n/i18n'

export function renderStat(label: string, value: string): ReactNode {
  return (
    <div className="min-w-0 rounded border border-black/10 bg-white/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="truncate text-[0.55rem] font-bold uppercase leading-tight text-stone-500 dark:text-stone-400">
        {label}
      </div>
      <div
        className="mt-2 truncate whitespace-nowrap text-sm font-extrabold leading-none sm:text-base"
        title={value}
      >
        {value}
      </div>
    </div>
  )
}

export function renderEffect(
  label: string,
  text: string | null,
  t: Translator,
): ReactNode {
  return (
    <div>
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {label}
      </div>
      {text ? (
        <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          {text}
        </p>
      ) : (
        <p className="text-sm italic text-stone-400 dark:text-stone-500">
          {t('moveEffectUnavailable')}
        </p>
      )}
    </div>
  )
}
