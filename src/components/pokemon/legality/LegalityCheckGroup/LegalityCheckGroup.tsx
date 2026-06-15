import { CheckCircle2, XCircle } from 'lucide-react'

import type { LegalityReport as LegalityReportData } from '../../../../core/types/index/index'

export function LegalityCheckGroup({
  checks,
  title,
}: {
  checks: LegalityReportData['checks']
  title: string
}) {
  return (
    <div className="grid gap-1.5 rounded-md border border-black/10 p-3 dark:border-white/10">
      <div className="label text-[0.7rem]">{title}</div>
      {checks.map((check, index) => (
        <div key={index} className="flex items-start gap-2 text-sm">
          {check.valid ? (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300"
              size={16}
            />
          ) : (
            <XCircle
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-300"
              size={16}
            />
          )}
          <span className="min-w-0">{check.message}</span>
        </div>
      ))}
    </div>
  )
}
