import { Plus } from 'lucide-react'

import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'

export function MaxNumberField({
  label,
  maxValue,
  value,
  onChange,
}: {
  label: string
  maxValue: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-end gap-2">
      <label className="grid gap-1.5">
        <span className="label text-[0.65rem]">{label}</span>
        <input
          className="field"
          max={maxValue}
          min={0}
          type="number"
          value={value}
          onChange={(event) =>
            onChange(
              parseClampedNumberInput(event.currentTarget.value, {
                max: maxValue,
                min: 0,
              }),
            )
          }
        />
      </label>
      <button
        aria-label={label}
        className="btn h-9 min-h-9 px-0"
        title={label}
        type="button"
        onClick={() => onChange(maxValue)}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
