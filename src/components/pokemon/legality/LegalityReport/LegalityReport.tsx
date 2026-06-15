import { CheckCircle2, XCircle } from 'lucide-react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalityReport as LegalityReportData } from '../../../../core/types/index/index'
import { LegalityCheckGroup } from '../LegalityCheckGroup/LegalityCheckGroup'

export function LegalityReport({
  legality,
  t,
}: {
  legality: LegalityReportData | null
  t: Translator
}) {
  if (!legality) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {t('legalityUnchecked')}
      </p>
    )
  }

  // Group checks by PKHeX check identifier (PID, Encounter, Moves, ...).
  const groups = new Map<string, LegalityReportData['checks']>()
  for (const check of legality.checks) {
    const key = check.identifier || t('checks')
    const list = groups.get(key) ?? []
    list.push(check)
    groups.set(key, list)
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        {legality.legal ? (
          <CheckCircle2
            aria-hidden="true"
            className="text-emerald-600 dark:text-emerald-300"
            size={20}
          />
        ) : (
          <XCircle
            aria-hidden="true"
            className="text-rose-600 dark:text-rose-300"
            size={20}
          />
        )}
        <span className="text-sm font-bold">
          {legality.legal ? t('legalityLegal') : t('legalityIllegal')}
        </span>
      </div>

      {groups.size > 0 ? (
        <div className="grid gap-2">
          {[...groups.entries()].map(([title, checks]) => (
            <LegalityCheckGroup key={title} checks={checks} title={title} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {legality.report}
        </p>
      )}
    </div>
  )
}
