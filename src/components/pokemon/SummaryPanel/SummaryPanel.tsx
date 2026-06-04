import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { SaveSummary } from '../../../core/types/index/index'

export function SummaryPanel({
  summary,
  t,
}: {
  summary: SaveSummary | null
  t: Translator
}) {
  if (!summary) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-black/15 p-4 text-sm text-stone-500 dark:border-white/15 dark:text-stone-400">
        {t('noSaveLoaded')}
      </div>
    )
  }

  const rows = [
    [
      t('game'),
      `${summary.game} / ${t('generation', { generation: summary.generation })}`,
    ],
    [t('trainer'), summary.trainer || t('blank')],
    [t('trainerIds'), `${summary.trainerId}/${summary.secretId}`],
    [t('money'), summary.money.toLocaleString()],
    [t('checksums'), summary.checksumsValid ? t('valid') : t('invalid')],
  ]

  return (
    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
      {rows.map(([key, value]) => (
        <div
          key={key}
          className="min-w-0 rounded-md bg-black/5 px-2 py-1.5 dark:bg-white/5"
        >
          <dt className="truncate text-[0.65rem] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {key}
          </dt>
          <dd className="min-w-0 truncate text-sm font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
