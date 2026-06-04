import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { MetDateFormState } from '../metDateFixerData/metDateFixerData'

type Props = {
  form: MetDateFormState
  onChange: (form: MetDateFormState) => void
  t: Translator
}

export function MetDateCheckboxes({ form, onChange, t }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <label className="flex min-h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-xs dark:border-stone-700">
        <input
          checked={form.rewriteAll}
          type="checkbox"
          onChange={(event) =>
            onChange({ ...form, rewriteAll: event.currentTarget.checked })
          }
        />
        {t('rewriteAllDates')}
      </label>
      <label className="flex min-h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-xs dark:border-stone-700">
        <input
          checked={form.includeParty}
          type="checkbox"
          onChange={(event) =>
            onChange({ ...form, includeParty: event.currentTarget.checked })
          }
        />
        {t('includeParty')}
      </label>
      <label className="flex min-h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-xs dark:border-stone-700">
        <input
          checked={form.updateTrainerDates}
          type="checkbox"
          onChange={(event) =>
            onChange({
              ...form,
              updateTrainerDates: event.currentTarget.checked,
            })
          }
        />
        {t('updateTrainerDates')}
      </label>
    </div>
  )
}
