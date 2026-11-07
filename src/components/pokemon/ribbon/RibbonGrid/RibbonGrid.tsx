import type { PokemonRibbon } from '../../../../core/types/pokemon/pokemon'
import { parseClampedNumberInput } from '../../../../core/utils/numberInput/numberInput'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

const notObtainableClassName = ' text-rose-600 dark:text-rose-300'

export function RibbonGrid({
  emptyLabel,
  notObtainableLabel,
  onChange,
  ribbons,
  unverifiedLabel,
}: {
  emptyLabel: string
  notObtainableLabel: string
  unverifiedLabel: string
  onChange: (ribbons: PokemonRibbon[]) => void
  ribbons: PokemonRibbon[]
}) {
  const issue = useFieldIssue('cosmetic.ribbons')

  if (ribbons.length === 0) {
    return (
      <p className="col-span-full text-xs text-stone-500 dark:text-stone-400">
        {emptyLabel}
      </p>
    )
  }

  const update = (next: PokemonRibbon) =>
    onChange(ribbons.map((item) => (item.id === next.id ? next : item)))
  // The backend leaves obtainable null when PKHeX matched no encounter.
  const unverified = ribbons.some((ribbon) => ribbon.obtainable === null)

  return (
    <>
      {unverified && (
        <p className="col-span-full mb-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
          {unverifiedLabel}
        </p>
      )}
      <div className="col-span-full grid max-h-ribbons grid-cols-1 gap-1.5 overflow-auto rounded-md border border-black/10 p-2 dark:border-white/10 sm:grid-cols-2">
        {ribbons.map((ribbon) => {
          // Illegally held ribbons stay listed so they can be removed.
          const notObtainable = ribbon.obtainable === false
          const accessibleName = notObtainable
            ? `${ribbon.name}: ${notObtainableLabel}`
            : ribbon.name
          const rowProps = {
            className: `flex min-w-0 items-center gap-2 text-xs font-semibold${issue.labelClassName}${notObtainable ? notObtainableClassName : ''}`,
            title: notObtainable ? notObtainableLabel : undefined,
          }

          return typeof ribbon.maxCount === 'number' ? (
            <label key={ribbon.id} {...rowProps}>
              <span className="min-w-0 flex-1 truncate">{ribbon.name}</span>
              <input
                aria-invalid={issue.invalid || notObtainable || undefined}
                aria-label={accessibleName}
                className={`field h-6 min-h-6 w-12 shrink-0 px-1 py-0 text-center text-xs tabular-nums${issue.fieldClassName}`}
                max={ribbon.maxCount}
                min={0}
                type="number"
                value={ribbon.count ?? 0}
                onChange={(event) => {
                  const count = parseClampedNumberInput(
                    event.currentTarget.value,
                    { max: ribbon.maxCount ?? undefined, min: 0 },
                  )
                  update({ ...ribbon, count, value: count > 0 })
                }}
              />
              <span className="shrink-0 tabular-nums text-stone-500 dark:text-stone-400">
                /{ribbon.maxCount}
              </span>
            </label>
          ) : (
            <label key={ribbon.id} {...rowProps}>
              <input
                aria-invalid={issue.invalid || notObtainable || undefined}
                aria-label={accessibleName}
                checked={ribbon.value}
                type="checkbox"
                onChange={(event) =>
                  update({ ...ribbon, value: event.currentTarget.checked })
                }
              />
              <span className="min-w-0 truncate">{ribbon.name}</span>
            </label>
          )
        })}
      </div>
    </>
  )
}
