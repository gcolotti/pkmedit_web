import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

const fieldClassName = 'field h-9 min-w-0 px-2 py-1 text-sm font-bold'
const labelClassName = 'label truncate text-[0.65rem] leading-none'

export function DetailsTrainerIdentity({
  onHandlingTrainerNameChange,
  onTrainerChange,
  t,
  trainer,
}: {
  onHandlingTrainerNameChange: (name: string) => void
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const otIssue = useFieldIssue('trainer.originalTrainerName')
  const htIssue = useFieldIssue('trainer.handlingTrainerName')

  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      <label className="grid min-w-0 gap-1">
        <span className={`${labelClassName}${otIssue.labelClassName}`}>
          {t('ot')}
        </span>
        <input
          aria-invalid={otIssue.invalid || undefined}
          className={`${fieldClassName}${otIssue.fieldClassName}`}
          value={trainer.originalTrainerName}
          onChange={(event) =>
            onTrainerChange({
              ...trainer,
              originalTrainerName: event.currentTarget.value,
            })
          }
        />
      </label>
      <label className="grid min-w-0 gap-1">
        <span className={`${labelClassName}${htIssue.labelClassName}`}>
          {t('ht')}
        </span>
        <input
          aria-invalid={htIssue.invalid || undefined}
          className={`${fieldClassName}${htIssue.fieldClassName}`}
          placeholder={t('none')}
          value={trainer.handlingTrainerName}
          onChange={(event) =>
            onHandlingTrainerNameChange(event.currentTarget.value)
          }
        />
      </label>
    </div>
  )
}
