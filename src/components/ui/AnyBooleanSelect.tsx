import type { Translator } from '../../core/i18n/i18n'

export function AnyBooleanSelect({
  label,
  onChange,
  t,
  value,
}: {
  label: string
  onChange: (value: boolean | null) => void
  t: Translator
  value: boolean | null
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label text-[0.65rem]">{label}</span>
      <select
        className="field"
        value={value === null ? 'any' : value ? 'yes' : 'no'}
        onChange={(event) =>
          onChange(
            event.currentTarget.value === 'any'
              ? null
              : event.currentTarget.value === 'yes',
          )
        }
      >
        <option value="any">{t('any')}</option>
        <option value="yes">{t('yes')}</option>
        <option value="no">{t('no')}</option>
      </select>
    </label>
  )
}
