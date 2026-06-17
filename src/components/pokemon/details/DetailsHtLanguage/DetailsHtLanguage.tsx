import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

export function DetailsHtLanguage({
  languageCatalog,
  t,
  value,
}: {
  languageCatalog: CatalogEntry[]
  t: Translator
  value: number
}) {
  const langIssue = useFieldIssue('trainer.handlingTrainerLanguage')
  const knownLanguage = languageCatalog.some((entry) => entry.id === value)

  return (
    <label className="col-span-2 grid min-w-0 gap-1">
      <span
        className={`label truncate text-[0.65rem] leading-none${langIssue.labelClassName}`}
      >
        {t('htLanguage')}
      </span>
      <select
        aria-invalid={langIssue.invalid || undefined}
        className={`field h-9 min-w-0 px-2 py-1 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60${langIssue.fieldClassName}`}
        disabled
        value={value}
      >
        <option value={0}>{t('unset')}</option>
        {!knownLanguage && value !== 0 && (
          <option value={value}>{`#${value}`}</option>
        )}
        {languageCatalog.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {`${entry.name} (#${entry.id})`}
          </option>
        ))}
      </select>
    </label>
  )
}
