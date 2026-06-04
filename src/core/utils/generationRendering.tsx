import type { ReactNode } from 'react'

import type { Translator } from '../i18n/i18n'
import type { GenerationEffectChange } from './generationData'
import { CAT_ICONS } from './generationData'

export function renderCategoryStat(
  category: number | null,
  t: Translator,
): ReactNode {
  const cat = category !== null ? CAT_ICONS[category] : undefined
  return (
    <div className="min-w-0 rounded border border-black/10 bg-white/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="truncate text-[0.55rem] font-bold uppercase leading-tight text-stone-500 dark:text-stone-400">
        {t('moveCategory')}
      </div>
      <div className="mt-1.5 flex h-6 items-center">
        {cat ? (
          <img
            alt={t(cat[1])}
            className="h-6 w-auto"
            src={cat[0]}
            title={t(cat[1])}
          />
        ) : (
          <span className="text-sm font-extrabold">-</span>
        )}
      </div>
    </div>
  )
}

export function renderMoveEffectInCombat(
  current: string | null,
  changes: GenerationEffectChange[],
  t: Translator,
): ReactNode {
  return (
    <div>
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('moveEffectInCombat')}
      </div>
      {current ? (
        <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          {current}
        </p>
      ) : (
        <p className="text-sm italic text-stone-400">
          {t('moveEffectUnavailable')}
        </p>
      )}
      {changes.length > 0 && (
        <div className="mt-3 space-y-2">
          {changes.map((change) => (
            <div
              key={change.generation}
              className="rounded border border-black/10 bg-white/40 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t('moveGenerationSingle', { generation: change.generation })}
              </div>
              <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {change.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
