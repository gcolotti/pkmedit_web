import { parseClampedNumberInput } from '../../core/utils/numberInput'

export function DecimalField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label text-[0.65rem]">{label}</span>
      <input
        className="field"
        step="0.000001"
        type="number"
        value={value}
        onChange={(event) =>
          onChange(parseClampedNumberInput(event.currentTarget.value))
        }
      />
    </label>
  )
}
