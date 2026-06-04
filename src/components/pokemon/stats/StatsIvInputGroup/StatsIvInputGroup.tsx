import { parseClampedNumberInput } from '../../../../core/utils/numberInput/numberInput'
import { HyperTrainControl } from '../HyperTrainControl/HyperTrainControl'
import { inputClassName } from '../StatsGroupControls/StatsGroupControls'

export function IvInputGroup({
  fieldClassName,
  hyperTrained,
  hyperTrainingAvailable,
  hyperTrainLabel,
  invalid,
  label,
  onHyperTrainChange,
  onValueChange,
  perfectLabel,
  value,
}: {
  fieldClassName: string
  hyperTrained: boolean
  hyperTrainingAvailable: boolean
  hyperTrainLabel: string
  invalid: boolean
  label: string
  onHyperTrainChange: () => void
  onValueChange: (value: number) => void
  perfectLabel: string
  value: number
}) {
  const input = (
    <input
      aria-invalid={invalid || undefined}
      aria-label={label}
      className={`${inputClassName}${fieldClassName} ${hyperTrainingAvailable ? '!rounded-r-none' : ''}`}
      max={31}
      min={0}
      type="number"
      value={value}
      onChange={(event) =>
        onValueChange(
          parseClampedNumberInput(event.currentTarget.value, {
            max: 31,
            min: 0,
          }),
        )
      }
    />
  )

  if (!hyperTrainingAvailable) return input
  return (
    <div className="col-span-2 grid h-9 grid-cols-[minmax(2.25rem,3.75rem)_1.25rem] items-stretch">
      {input}
      <HyperTrainControl
        active={hyperTrained}
        hyperTrainLabel={hyperTrainLabel}
        perfect={value >= 31}
        perfectLabel={perfectLabel}
        onClick={onHyperTrainChange}
      />
    </div>
  )
}
