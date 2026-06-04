import { RotateCcw, ShieldAlert, X } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  DraftChange,
  DraftLegalityViolation,
} from '../../../core/types/index/index'

export function DraftChangesPanel({
  allowIllegalChanges,
  changes,
  onAllowIllegalChangesChange,
  onCheckDraft,
  onRevertAll,
  onRevertChange,
  t,
  violations,
}: {
  allowIllegalChanges: boolean
  changes: DraftChange[]
  onAllowIllegalChangesChange: (value: boolean) => void
  onCheckDraft: () => void
  onRevertAll: () => void
  onRevertChange: (change: DraftChange) => void
  t: Translator
  violations: DraftLegalityViolation[]
}) {
  return (
    <section className="mt-5 grid gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <input
            id="allow-illegal-changes"
            checked={allowIllegalChanges}
            className="accent-lagoon"
            type="checkbox"
            onChange={(event) =>
              onAllowIllegalChangesChange(event.target.checked)
            }
          />
          <label
            className="min-w-0 truncate font-bold"
            htmlFor="allow-illegal-changes"
          >
            {t('allowIllegalChanges')}
          </label>
        </div>
        <div className="flex gap-2">
          <button
            aria-label={t('revertAllChanges')}
            className="btn h-9 w-9 p-0"
            disabled={changes.length === 0}
            title={t('revertAllChanges')}
            type="button"
            onClick={onRevertAll}
          >
            <RotateCcw size={18} />
          </button>
          <button
            aria-label={t('checkDraft')}
            className="btn h-9 w-9 p-0"
            disabled={changes.length === 0}
            title={t('checkDraft')}
            type="button"
            onClick={onCheckDraft}
          >
            <ShieldAlert size={18} />
          </button>
        </div>
      </div>
      {changes.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t('noDraftChanges')}
        </p>
      ) : (
        <div className="grid max-h-draft-changes gap-1 overflow-auto pr-1">
          {changes.map((change) => (
            <div
              key={`${change.slotId}-${change.path}`}
              className="flex items-center gap-1 rounded bg-black/5 px-2 py-0.5 text-xs dark:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium">{change.label}</span>
                {(change.before || change.after) && (
                  <span className="ml-1 truncate text-stone-500 dark:text-stone-400">
                    {change.before} → {change.after}
                  </span>
                )}
              </div>
              <button
                aria-label={t('revertChange')}
                className="flex-shrink-0 rounded p-0.5 opacity-50 hover:opacity-100"
                type="button"
                onClick={() => onRevertChange(change)}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      {violations.length > 0 && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-300">
          <p className="font-bold">{t('draftBlocked')}</p>
          <p>{violations[0]?.message}</p>
        </div>
      )}
    </section>
  )
}
