import type { RaidHelpTopic } from '../../core/utils/raidDisplay'
import { TechnicalHelpButton } from '../core/focused/TechnicalHelpButton'

export function RaidHelpButton({
  label,
  topic,
  onHelp,
}: {
  label: string
  topic: RaidHelpTopic
  onHelp: (topic: RaidHelpTopic) => void
}) {
  return <TechnicalHelpButton label={label} topic={topic} onHelp={onHelp} />
}
