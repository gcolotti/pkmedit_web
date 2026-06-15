import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalityReport } from '../../../../core/types/index/index'

export function LegalityStatus({
  checkedAt,
  legality,
  t,
}: {
  checkedAt: number | null
  legality: LegalityReport | null
  t: Translator
}) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const hasWarnings =
    !!legality?.legal && legality.checks.some((check) => !check.valid)
  const tone = !legality
    ? 'unknown'
    : !legality.legal
      ? 'illegal'
      : hasWarnings
        ? 'warnings'
        : 'legal'

  const config = {
    legal: { Icon: CheckCircle2, label: t('legalityLegal'), className: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
    illegal: { Icon: XCircle, label: t('legalityIllegal'), className: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300' },
    warnings: { Icon: AlertTriangle, label: t('legalityWarnings'), className: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300' },
    unknown: { Icon: HelpCircle, label: t('legalityUnchecked'), className: 'border-black/15 text-stone-500 dark:border-white/15 dark:text-stone-400' },
  } as const
  const { Icon, label, className } = config[tone]

  const seconds =
    checkedAt === null ? null : Math.max(0, Math.round((now - checkedAt) / 1000))

  return (
    <div className={`flex items-center gap-3 rounded-md border px-3 py-2 ${className}`}>
      <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
      <div className="min-w-0">
        <div className="text-sm font-bold">{label}</div>
        {seconds !== null && (
          <div className="text-[0.7rem] opacity-80">
            {t('lastChecked', { seconds })}
          </div>
        )}
      </div>
    </div>
  )
}
