import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { DonutPreview } from '../../../core/types/donut/donut'
import { localizedDonutType } from '../../../core/types/donut/donut'
import { DonutFlavorBadges } from '../DonutFlavorBadges/DonutFlavorBadges'

type Props = {
  preview: DonutPreview
  t: Translator
}

export function DonutPreviewSummary({ preview, t }: Props) {
  const previewItems = [
    [t('donutType'), localizedDonutType(t, preview.donutType)],
    [t('donutStarsLabel'), t('donutStars', { stars: preview.stars })],
    [t('level'), `+${preview.levelBoost}`],
    [t('donutCalories'), preview.calories.toString()],
  ]

  return (
    <div className="grid gap-2 rounded-md bg-stone-100 p-3 text-sm dark:bg-stone-900/60">
      <div className="grid grid-cols-4 gap-2">
        {previewItems.map(([label, value]) => (
          <div key={label}>
            <div className="text-[0.65rem] uppercase text-stone-500">
              {label}
            </div>
            <div className="font-semibold">{value}</div>
          </div>
        ))}
      </div>
      <DonutFlavorBadges grid showZero profile={preview.profile} t={t} />
      {preview.budgets.rainbow && (
        <div className="text-xs text-stone-500">
          {t('donutRainbowBudgetNote')}
        </div>
      )}
    </div>
  )
}
