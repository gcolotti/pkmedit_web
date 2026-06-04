import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { RaidFieldLabel } from '../RaidFieldLabel/RaidFieldLabel'

export function RaidTextField({
  help,
  label,
  value,
  onChange,
  onHelp,
}: {
  help: RaidHelpTopic
  label: string
  value: string
  onChange: (value: string) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return (
    <label className="grid gap-1">
      <RaidFieldLabel help={help} label={label} onHelp={onHelp} />
      <input
        aria-label={label}
        className="field h-10 min-h-10 font-mono text-sm"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  )
}
