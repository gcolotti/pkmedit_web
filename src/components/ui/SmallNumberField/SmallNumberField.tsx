import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'

export function SmallNumberField({
  label,
  max = 100,
  min = 0,
  onChange,
  value,
}: {
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  value: number
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label text-[0.65rem]">{label}</span>
      <input
        className="field"
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
