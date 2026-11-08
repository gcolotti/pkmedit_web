import { ArrowUp, Crown } from 'lucide-react'

import {
  inputGroupControlClassName,
  inputGroupControlNeutralClassName as controlNeutral,
} from '../../../ui/InputGroupButton/InputGroupButton'

const controlBase = `${inputGroupControlClassName} h-9 min-h-9`
const controlActive =
  'border-lagoon/60 bg-lagoon/20 text-lagoon dark:bg-lagoon/20'

export function HyperTrainControl({
  active,
  hyperTrainLabel,
  onClick,
  perfect,
  perfectLabel,
}: {
  active: boolean
  hyperTrainLabel: string
  onClick: () => void
  perfect: boolean
  perfectLabel: string
}) {
  const className = `${controlBase} ${perfect || active ? controlActive : controlNeutral} !rounded-l-none border-l-0`
  if (perfect)
    return (
      <span
        aria-label={perfectLabel}
        className={`${className} cursor-default`}
        role="img"
        title={perfectLabel}
      >
        <Crown fill="currentColor" size={13} />
      </span>
    )

  return (
    <button
      aria-label={hyperTrainLabel}
      aria-pressed={active}
      className={className}
      type="button"
      onClick={onClick}
    >
      <ArrowUp size={8} strokeWidth={3} />
      <span className="text-[0.5rem] font-bold leading-none">H</span>
    </button>
  )
}
