import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { MetDateFixerPreview } from '../../../../core/types/metDateFixer/metDateFixer'

export function MetDateFixerPreviewReport({
  preview,
  t,
}: {
  preview: MetDateFixerPreview
  t: Translator
}) {
  const metrics = [
    { label: t('startDate'), value: preview.startDate },
    { label: t('storyEndDate'), value: preview.storyEndDate },
    { label: t('postGameEndDate'), value: preview.postGameEndDate },
  ]

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-2 text-xs">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-stone-200 p-2 dark:border-stone-700"
          >
            <p className="label text-[0.6rem]">{metric.label}</p>
            <p className="text-sm font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] gap-2 border-b border-stone-200 px-3 py-2 text-[0.65rem] uppercase text-stone-500 dark:border-stone-700 dark:text-stone-400">
          <span>{t('pokemon')}</span>
          <span>{t('current')}</span>
          <span>{t('proposed')}</span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {preview.suggestions.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-stone-500 dark:text-stone-400">
              {t('noDateSuggestions')}
            </p>
          ) : (
            preview.suggestions.slice(0, 120).map((suggestion) => (
              <div
                key={suggestion.slotId}
                className={`grid grid-cols-[1.2fr_0.8fr_0.8fr] gap-2 border-b border-stone-100 px-3 py-2 text-xs last:border-0 dark:border-stone-800 ${suggestion.shouldApply ? '' : 'opacity-60'}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {suggestion.speciesName}
                  </p>
                  <p className="truncate text-[0.65rem] text-stone-500 dark:text-stone-400">
                    {suggestion.label}
                  </p>
                </div>
                <span>{suggestion.currentDate ?? t('blank')}</span>
                <span>{suggestion.proposedDate}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {preview.trainerTimeline.length > 0 && (
        <div className="grid gap-2 rounded-md border border-stone-200 p-3 text-xs dark:border-stone-700">
          <p className="label text-[0.65rem]">{t('trainerDates')}</p>
          {preview.trainerTimeline.map((entry) => (
            <div
              key={entry.field}
              className="grid grid-cols-[1fr_0.9fr_0.9fr] gap-2"
            >
              <span>{entry.label}</span>
              <span>{formatDateTime(entry.current, t)}</span>
              <span>{formatDateTime(entry.proposed, t)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDateTime(value: string | null, t: Translator) {
  if (!value) return t('blank')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}
