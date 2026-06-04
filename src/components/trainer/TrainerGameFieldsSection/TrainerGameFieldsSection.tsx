import type { I18nKey, Translator } from '../../../core/i18n/i18n/i18n'
import type {
  TrainerGameAction,
  TrainerGameField,
} from '../../../core/types/trainer/trainer'
import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import { TrainerSection } from '../TrainerSection/TrainerSection'

type Props = {
  fields: TrainerGameField[]
  actions: TrainerGameAction[]
  pendingActions?: string[]
  t: Translator
  onFieldChange: (key: string, value: string) => void
  onActionQueue: (key: string) => void
}

export function TrainerGameFieldsSection({
  actions,
  fields,
  onActionQueue,
  onFieldChange,
  pendingActions,
  t,
}: Props) {
  const hasFields = fields.length > 0
  const hasActions = actions.length > 0
  if (!hasFields && !hasActions) return null

  const pending = new Set(pendingActions ?? [])

  return (
    <TrainerSection>
      {hasFields && (
        <div className="grid grid-cols-2 gap-2">
          {fields.map((field) => (
            <label
              key={field.key}
              className={`grid gap-1.5 ${field.kind === 'text' ? 'col-span-2' : ''}`}
            >
              <span className="label text-[0.65rem]">
                {t(field.labelKey as I18nKey)}
              </span>
              <input
                className="field"
                max={field.max ?? undefined}
                min={field.min ?? undefined}
                type={field.kind}
                value={field.value}
                onChange={(event) =>
                  onFieldChange(
                    field.key,
                    parseTrainerGameFieldInput(
                      field,
                      event.currentTarget.value,
                    ),
                  )
                }
              />
            </label>
          ))}
        </div>
      )}
      {hasActions && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {actions.map((action) => {
            const queued = pending.has(action.key)
            return (
              <button
                key={action.key}
                className={queued ? 'btn btn-primary' : 'btn'}
                type="button"
                onClick={() => onActionQueue(action.key)}
              >
                {queued
                  ? t('trainerActionQueued', {
                      action: t(action.labelKey as I18nKey),
                    })
                  : t(action.labelKey as I18nKey)}
              </button>
            )
          })}
        </div>
      )}
    </TrainerSection>
  )
}

function parseTrainerGameFieldInput(field: TrainerGameField, value: string) {
  if (field.kind !== 'number') return value
  return parseClampedNumberInput(value, {
    max: field.max ?? undefined,
    min: field.min ?? undefined,
  }).toString()
}
