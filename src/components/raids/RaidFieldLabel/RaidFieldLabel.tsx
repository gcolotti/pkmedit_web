import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { TechnicalFieldLabel } from '../../core/focused/TechnicalFieldLabel/TechnicalFieldLabel'

export function RaidFieldLabel({
  help,
  label,
  onHelp,
}: {
  help: RaidHelpTopic
  label: string
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return (
    <TechnicalFieldLabel helpLabel={label} topic={help} onHelp={onHelp}>
      {label}
    </TechnicalFieldLabel>
  )
}
