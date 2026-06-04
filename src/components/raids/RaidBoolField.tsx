import type { RaidHelpTopic } from '../../core/utils/raidDisplay'
import { RaidFieldLabel } from './RaidFieldLabel'

export function RaidBoolField({
  falseLabel,
  help,
  label,
  trueLabel,
  value,
  onChange,
  onHelp,
}: {
  falseLabel: string
  help: RaidHelpTopic
  label: string
  trueLabel: string
  value: boolean | null
  onChange: (value: boolean) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return (
    <div className="grid gap-1">
      <RaidFieldLabel help={help} label={label} onHelp={onHelp} />
      <label className="flex h-10 items-center gap-2 rounded-md border border-black/10 px-3 text-sm dark:border-white/10">
        <input
          checked={value === true}
          type="checkbox"
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        <span>{value === true ? trueLabel : falseLabel}</span>
      </label>
    </div>
  )
}
