import { Info } from 'lucide-react'

export function TechnicalHelpButton<T extends string>({
  label,
  topic,
  onHelp,
}: {
  label: string
  topic: T
  onHelp: (topic: T) => void
}) {
  return (
    <button
      aria-label={label}
      className="btn h-7 w-7 p-0"
      title={label}
      type="button"
      onClick={() => onHelp(topic)}
    >
      <Info aria-hidden="true" size={14} />
    </button>
  )
}
