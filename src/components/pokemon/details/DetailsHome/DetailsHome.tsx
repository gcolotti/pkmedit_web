import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonCosmetic } from '../../../../core/types/pokemon/pokemon'
import {
  MAX_SAFE_INTEGER,
  parseClampedNumberInput,
} from '../../../../core/utils/numberInput/numberInput'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

export function DetailsHome({
  cosmetic,
  onCosmeticChange,
  t,
}: {
  cosmetic: PokemonCosmetic
  onCosmeticChange: (cosmetic: PokemonCosmetic) => void
  t: Translator
}) {
  const issue = useFieldIssue('cosmetic.homeTracker')

  return (
    <label
      className="grid min-w-0 gap-1"
      title={t('homeTrackerTooltip')}
      onContextMenu={(event) => {
        event.preventDefault()
        onCosmeticChange({ ...cosmetic, homeTracker: 0 })
      }}
    >
      <input
        aria-invalid={issue.invalid || undefined}
        aria-label={t('homeTracker')}
        className={`field h-9 min-w-0 px-2 py-1 text-sm font-bold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none${issue.fieldClassName}`}
        max={MAX_SAFE_INTEGER}
        min={0}
        type="number"
        value={cosmetic.homeTracker}
        onChange={(event) =>
          onCosmeticChange({
            ...cosmetic,
            homeTracker: parseClampedNumberInput(event.currentTarget.value, {
              max: MAX_SAFE_INTEGER,
              min: 0,
            }),
          })
        }
      />
    </label>
  )
}
