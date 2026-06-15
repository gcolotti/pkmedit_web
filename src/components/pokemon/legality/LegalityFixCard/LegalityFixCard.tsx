import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalFix } from '../../../../core/types/index/index'
import { getLegalityFixCopy } from '../legalityFixCatalog/legalityFixCatalog'

const safetyClass = {
  safe: 'border-emerald-500 text-emerald-600 dark:text-emerald-300',
  risky: 'border-amber-500 text-amber-600 dark:text-amber-300',
  manual: 'border-stone-400 text-stone-500 dark:text-stone-400',
} as const

export function LegalityFixCard({
  applying,
  disabled,
  fix,
  onApply,
  t,
}: {
  applying: boolean
  disabled: boolean
  fix: LegalFix
  onApply: (fixId: string) => void
  t: Translator
}) {
  const copy = getLegalityFixCopy(fix.id, t)
  const safetyLabel = {
    safe: t('fixSafetySafe'),
    risky: t('fixSafetyRisky'),
    manual: t('fixSafetyManual'),
  } as const

  return (
    <div className="grid gap-1.5 rounded-md border border-black/10 p-3 dark:border-white/10">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold">{copy.label}</span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[0.65rem] font-bold uppercase ${safetyClass[fix.safety]}`}
        >
          {safetyLabel[fix.safety]}
        </span>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        {copy.description}
      </p>
      <div>
        {fix.safety === 'manual' ? (
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {t('manualFixNotice')}
          </p>
        ) : (
          <button
            className="btn inline-flex h-8 items-center px-2.5 text-xs"
            disabled={disabled}
            type="button"
            onClick={() => onApply(fix.id)}
          >
            {applying ? t('applyingFix') : t('applyFix')}
          </button>
        )}
      </div>
    </div>
  )
}
