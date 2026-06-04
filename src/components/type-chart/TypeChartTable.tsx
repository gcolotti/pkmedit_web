import type { Translator } from '../../core/i18n/i18n'
import {
  GEN_LABELS,
  type GenKey,
  TYPE_CHARTS,
} from '../../core/utils/typeChartData'
import {
  buildDefensiveRows,
  type DefensiveRow,
  getOrderedTypes,
} from '../../core/utils/typeChartHelpers'
import { getTypeName } from '../../core/utils/typeData'
import { TypeIcon } from '../ui/TypeIcon'
import { TypeChartMultCell } from './TypeChartMultCell'
function getDefenseMultiplier(
  chart: number[][],
  attacker: number,
  row: DefensiveRow,
) {
  return (
    chart[attacker][row.primaryType] *
    (row.secondaryType === undefined ? 1 : chart[attacker][row.secondaryType])
  )
}
export function getTypeChartMultiplierLabel(t: Translator, value: number) {
  if (value === 0) return t('typeChartNoEffect')
  if (value === 0.25) return t('typeChartQuarterEffective')
  if (value === 0.5) return t('typeChartNotVeryEffective')
  if (value === 2) return t('typeChartSuperEffective')
  if (value === 4) return t('typeChartQuadEffective')
  return t('typeChartNeutral')
}
export function TypeChartTable({
  defenderType,
  gen,
  t,
}: {
  defenderType: number
  gen: GenKey
  t: Translator
}) {
  const types = getOrderedTypes(gen)
  const chart = TYPE_CHARTS[gen]
  const defenderName = getTypeName(t, defenderType)
  if (!types.includes(defenderType)) {
    return (
      <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
        {t('typeChartTypeUnavailable', { generation: GEN_LABELS[gen] })}
      </div>
    )
  }
  const rows = buildDefensiveRows(types, defenderType)
  const verticalLabel = t('typeChartPokemonType', {
    type: defenderName,
  }).toUpperCase()
  return (
    <div className="inline-block max-w-full overflow-auto rounded-xl border border-black/10 bg-white/40 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <table className="border-collapse text-center text-zinc-950">
        <thead>
          <tr>
            <th className="w-28" colSpan={2} />
            <th
              className="h-8 rounded-t-xl bg-black/5 px-3 text-sm font-semibold uppercase text-stone-600 dark:bg-white/10 dark:text-stone-300"
              colSpan={types.length}
            >
              {t('typeChartAttack')}
            </th>
          </tr>
          <tr>
            <th className="w-28" colSpan={2} />
            {types.map((attacker) => (
              <th
                key={attacker}
                className="h-8 w-8 min-w-8 border-2 border-zinc-950 bg-white p-0"
              >
                <TypeIcon className="mx-auto h-6 w-6" typeId={attacker} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={row.key}>
                {rowIndex === 0 && (
                  <th
                    className="w-12 min-w-12 rounded-l-xl bg-black/5 px-1 text-sm font-semibold text-stone-600 dark:bg-white/10 dark:text-stone-300"
                    rowSpan={rows.length}
                  >
                    <span className="[writing-mode:vertical-rl]">
                      {verticalLabel}
                    </span>
                  </th>
                )}
                <th className="h-8 w-14 min-w-14 border-2 border-zinc-950 bg-white p-0">
                  <span className="flex items-center justify-center gap-0.5">
                    <TypeIcon className="h-6 w-6" typeId={row.primaryType} />
                    {row.secondaryType !== undefined && (
                      <TypeIcon
                        className="h-6 w-6"
                        typeId={row.secondaryType}
                      />
                    )}
                  </span>
                </th>
                {types.map((attacker) => {
                  const value = getDefenseMultiplier(chart, attacker, row)
                  return (
                    <td
                      key={attacker}
                      className="h-8 w-8 min-w-8 border-2 border-zinc-950 bg-[#f6f6ff] p-0"
                    >
                      <span className="flex items-center justify-center">
                        <TypeChartMultCell
                          label={getTypeChartMultiplierLabel(t, value)}
                          value={value}
                        />
                      </span>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
