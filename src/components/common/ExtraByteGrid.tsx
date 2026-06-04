import type { PokemonExtraByte } from '../../core/types/pokemon'
import { parseClampedNumberInput } from '../../core/utils/numberInput'
import { useFieldIssue } from '../core/forms/FieldIssueContext'

export function ExtraByteGrid({
  extraBytes,
  onChange,
}: {
  extraBytes: PokemonExtraByte[]
  onChange: (extraBytes: PokemonExtraByte[]) => void
}) {
  const issue = useFieldIssue('cosmetic.extraBytes')

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {extraBytes.map((extra) => (
        <label
          key={extra.offset}
          className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-1 rounded-md border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5"
        >
          <span
            className={`label truncate text-center text-[0.65rem] leading-none${issue.labelClassName}`}
          >{`0x${extra.offset.toString(16).toUpperCase()}`}</span>
          <input
            aria-invalid={issue.invalid || undefined}
            className={`field h-8 min-w-0 px-1.5 py-1 text-center text-sm font-bold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none${issue.fieldClassName}`}
            max={255}
            min={0}
            type="number"
            value={extra.value}
            onChange={(event) =>
              onChange(
                extraBytes.map((item) =>
                  item.offset === extra.offset
                    ? {
                        ...item,
                        value: parseClampedNumberInput(
                          event.currentTarget.value,
                          { max: 255, min: 0 },
                        ),
                      }
                    : item,
                ),
              )
            }
          />
        </label>
      ))}
    </div>
  )
}
