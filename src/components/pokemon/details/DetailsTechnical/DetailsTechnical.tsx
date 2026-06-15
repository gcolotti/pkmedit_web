import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import type {
  PokemonMain,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

// HT language selector + read-only Encryption Constant (DetailsAdvanced section).
export function DetailsTechnical({
  languageCatalog,
  main,
  onTrainerChange,
  t,
  trainer,
}: {
  languageCatalog: CatalogEntry[]
  main: PokemonMain
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const langIssue = useFieldIssue('trainer.handlingTrainerLanguage')
  const ecIssue = useFieldIssue('main.encryptionConstant')
  const knownLanguage = languageCatalog.some(
    (entry) => entry.id === trainer.handlingTrainerLanguage,
  )

  return (
    <section className="grid gap-2 rounded-md border border-black/10 p-3 dark:border-white/10 sm:grid-cols-2">
      <label className="grid min-w-0 gap-1">
        <span
          className={`label truncate text-[0.65rem] leading-none${langIssue.labelClassName}`}
        >
          {t('htLanguage')}
        </span>
        <select
          aria-invalid={langIssue.invalid || undefined}
          className={`field h-9 min-w-0 px-2 py-1 text-sm font-bold${langIssue.fieldClassName}`}
          value={trainer.handlingTrainerLanguage}
          onChange={(event) =>
            onTrainerChange({
              ...trainer,
              handlingTrainerLanguage: Number(event.currentTarget.value),
            })
          }
        >
          <option value={0}>{t('unset')}</option>
          {!knownLanguage && trainer.handlingTrainerLanguage !== 0 && (
            <option value={trainer.handlingTrainerLanguage}>
              {`#${trainer.handlingTrainerLanguage}`}
            </option>
          )}
          {languageCatalog.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {`${entry.name} (#${entry.id})`}
            </option>
          ))}
        </select>
      </label>
      <div className="grid min-w-0 gap-1" title={t('encryptionConstantTooltip')}>
        <span
          className={`label truncate text-[0.65rem] leading-none${ecIssue.labelClassName}`}
        >
          {t('encryptionConstant')}
        </span>
        <div
          className={`field flex h-9 min-w-0 items-center px-2 text-sm font-bold tabular-nums opacity-60${ecIssue.fieldClassName}`}
        >
          {main.encryptionConstant}
        </div>
      </div>
    </section>
  )
}
