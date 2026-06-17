import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonMain } from '../../../../core/types/pokemon/pokemon'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

// Read-only technical values for DetailsAdvanced.
export function DetailsTechnical({
  main,
  t,
}: {
  main: PokemonMain
  t: Translator
}) {
  const ecIssue = useFieldIssue('main.encryptionConstant')

  return (
    <section className="grid gap-2 rounded-md border border-black/10 p-3 dark:border-white/10 sm:grid-cols-2">
      <div
        className="grid min-w-0 gap-1"
        title={t('encryptionConstantTooltip')}
      >
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
