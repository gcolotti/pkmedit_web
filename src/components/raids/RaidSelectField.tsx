import type { I18nKey, Translator } from '../../core/i18n/i18n'
import type { RaidHelpTopic } from '../../core/utils/raidDisplay'
import { RaidFieldLabel } from './RaidFieldLabel'

export function RaidSelectField({
  help,
  label,
  labelPrefix,
  options,
  t,
  value,
  onChange,
  onHelp,
}: {
  help: RaidHelpTopic
  label: string
  labelPrefix: string
  options: string[]
  t: Translator
  value: string
  onChange: (value: string) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return (
    <label className="grid gap-1">
      <RaidFieldLabel help={help} label={label} onHelp={onHelp} />
      <select
        aria-label={label}
        className="field h-10 min-h-10 text-sm"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {t(`${labelPrefix}${option}` as I18nKey)}
          </option>
        ))}
      </select>
    </label>
  )
}
