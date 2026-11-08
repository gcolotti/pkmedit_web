import { ChevronDown, ChevronUp } from 'lucide-react'

import {
  inputGroupControlClassName,
  inputGroupControlNeutralClassName,
} from '../InputGroupButton/InputGroupButton'

const buttonClassName = `${inputGroupControlClassName} ${inputGroupControlNeutralClassName} disabled:pointer-events-none disabled:opacity-30`

// Stacked up/down arrows to reorder a list row; same look as the MAX button.
export function ReorderButtons({
  canMoveDown,
  canMoveUp,
  moveDownLabel,
  moveUpLabel,
  onMoveDown,
  onMoveUp,
}: {
  canMoveDown: boolean
  canMoveUp: boolean
  moveDownLabel: string
  moveUpLabel: string
  onMoveDown: () => void
  onMoveUp: () => void
}) {
  return (
    <div className="grid h-9 grid-rows-2">
      <button
        aria-label={moveUpLabel}
        className={`${buttonClassName} !rounded-b-none`}
        disabled={!canMoveUp}
        title={moveUpLabel}
        type="button"
        onClick={onMoveUp}
      >
        <ChevronUp size={12} />
      </button>
      <button
        aria-label={moveDownLabel}
        className={`${buttonClassName} !rounded-t-none border-t-0`}
        disabled={!canMoveDown}
        title={moveDownLabel}
        type="button"
        onClick={onMoveDown}
      >
        <ChevronDown size={12} />
      </button>
    </div>
  )
}
