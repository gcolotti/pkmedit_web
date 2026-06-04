import type { PokemonFlag } from '../../../core/types/pokemon'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'

export function RibbonGrid({
  onChange,
  ribbons,
}: {
  onChange: (ribbons: PokemonFlag[]) => void
  ribbons: PokemonFlag[]
}) {
  const issue = useFieldIssue('cosmetic.ribbons')

  return (
    <div className="col-span-full grid max-h-ribbons grid-cols-1 gap-1.5 overflow-auto rounded-md border border-black/10 p-2 dark:border-white/10 sm:grid-cols-2">
      {ribbons.map((ribbon) => (
        <label
          key={ribbon.id}
          className={`flex min-w-0 items-center gap-2 text-xs font-semibold${issue.labelClassName}`}
        >
          <input
            aria-invalid={issue.invalid || undefined}
            checked={ribbon.value}
            type="checkbox"
            onChange={(event) =>
              onChange(
                ribbons.map((item) =>
                  item.id === ribbon.id
                    ? { ...item, value: event.currentTarget.checked }
                    : item,
                ),
              )
            }
          />
          <span className="min-w-0 truncate">{ribbon.name}</span>
        </label>
      ))}
    </div>
  )
}
