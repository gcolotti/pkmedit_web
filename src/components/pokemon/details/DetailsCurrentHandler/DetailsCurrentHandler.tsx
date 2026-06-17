import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

const handlerButtonClassName = (active: boolean) =>
  `h-8 min-w-11 rounded-md border px-2 text-xs font-bold transition ${
    active
      ? 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-300 dark:bg-amber-300/20 dark:text-amber-100'
      : 'border-black/15 text-stone-600 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/15 dark:text-stone-300 dark:hover:bg-white/5'
  }`

export function DetailsCurrentHandler({
  hasHandler,
  onTrainerChange,
  t,
  trainer,
}: {
  hasHandler: boolean
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const handlerIssue = useFieldIssue('trainer.currentHandler')
  const currentHandler = trainer.currentHandler > 0 ? 1 : 0
  const canUseHandlingTrainer = hasHandler || currentHandler === 1

  return (
    <div className="col-span-1 flex items-center justify-end gap-2">
      <div
        aria-label={t('currentHandler')}
        className={`inline-flex rounded-lg border border-black/15 p-0.5 dark:border-white/15${handlerIssue.fieldClassName}`}
        role="group"
      >
        <button
          aria-label={`${t('currentHandler')}: ${t('ot')}`}
          aria-pressed={currentHandler === 0}
          className={handlerButtonClassName(currentHandler === 0)}
          type="button"
          onClick={() => onTrainerChange({ ...trainer, currentHandler: 0 })}
        >
          {t('ot')}
        </button>
        <button
          aria-label={`${t('currentHandler')}: ${t('ht')}`}
          aria-pressed={currentHandler === 1}
          className={handlerButtonClassName(currentHandler === 1)}
          disabled={!canUseHandlingTrainer}
          type="button"
          onClick={() => onTrainerChange({ ...trainer, currentHandler: 1 })}
        >
          {t('ht')}
        </button>
      </div>
    </div>
  )
}
