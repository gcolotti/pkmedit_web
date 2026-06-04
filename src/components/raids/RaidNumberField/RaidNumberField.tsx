import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { RaidFieldLabel } from '../RaidFieldLabel/RaidFieldLabel'

export function RaidNumberField({
  help,
  label,
  max,
  min,
  value,
  onChange,
  onHelp,
}: {
  help: RaidHelpTopic
  label: string
  max: number
  min: number
  value: number
  onChange: (value: number) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return (
    <label className="grid gap-1">
      <RaidFieldLabel help={help} label={label} onHelp={onHelp} />
      <input
        aria-label={label}
        className="field h-10 min-h-10 text-sm"
        max={max}
        min={min}
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            parseClampedNumberInput(event.currentTarget.value, { max, min }),
          )
        }
      />
    </label>
  )
}
