import { useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import {
  GEN_LABELS,
  type GenKey,
} from '../../../core/utils/typeChartData/typeChartData'
import {
  getTypeName,
  TERA_TYPE_STELLAR,
} from '../../../core/utils/typeData/typeData'
import { FocusedEditorShell } from '../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { StellarTypeInfoPage } from '../StellarTypeInfoPage/StellarTypeInfoPage'
import { TypeChartMultCell } from '../TypeChartMultCell/TypeChartMultCell'
import {
  getTypeChartMultiplierLabel,
  TypeChartTable,
} from '../TypeChartTable/TypeChartTable'

const GEN_ORDER: GenKey[] = ['gen1', 'gen2', 'gen6']
const LEGEND_VALUES = [4, 2, 0.5, 0.25, 0] as const

export function TypeChartFocusedEditorPage({
  t,
  typeId,
  onBack,
}: {
  t: Translator
  typeId: number
  onBack: () => void
}) {
  const [gen, setGen] = useState<GenKey>('gen6')
  const _typeName = getTypeName(t, typeId)

  if (typeId === TERA_TYPE_STELLAR)
    return <StellarTypeInfoPage t={t} onBack={onBack} />

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1">
        {GEN_ORDER.map((g) => (
          <button
            key={g}
            className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
              g === gen
                ? 'bg-black/10 text-ink dark:bg-white/15 dark:text-white'
                : 'text-stone-500 hover:text-ink dark:text-stone-400 dark:hover:text-white'
            }`}
            type="button"
            onClick={() => setGen(g)}
          >
            {GEN_LABELS[g]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[0.6rem] text-stone-500 dark:text-stone-400">
        {LEGEND_VALUES.map((value) => {
          const label = getTypeChartMultiplierLabel(t, value)
          return (
            <span key={value} className="flex items-center gap-1">
              <TypeChartMultCell label={label} size="legend" value={value} />
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )

  return (
    <FocusedEditorShell
      backLabel={t('backToSaveEditor')}
      toolbar={toolbar}
      onBack={onBack}
    >
      <div className="min-h-0 overflow-auto p-4">
        <TypeChartTable defenderType={typeId} gen={gen} t={t} />
      </div>
    </FocusedEditorShell>
  )
}
