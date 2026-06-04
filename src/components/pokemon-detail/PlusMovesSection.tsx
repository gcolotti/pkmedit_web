import { ChevronDown, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { CatalogEntry } from '../../core/types/index'
import type { PokemonPlusMoves } from '../../core/types/pokemon'
import {
  buildPlusMoveRows,
  markAllLegalAsPlus,
} from '../../core/utils/plusMoveUtils'
import { PlusMoveSection } from './PlusMoveSection'

export function PlusMovesSection({
  plusMoves,
  moveById,
  legalMoveSet,
  t,
  onPlusMovesChange,
}: {
  plusMoves: PokemonPlusMoves
  moveById: Map<number, CatalogEntry>
  legalMoveSet: Set<number>
  t: Translator
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const rows = useMemo(
    () => ({
      legal: buildPlusMoveRows(plusMoves, moveById, legalMoveSet, true),
      other: buildPlusMoveRows(plusMoves, moveById, legalMoveSet, false),
    }),
    [plusMoves, moveById, legalMoveSet],
  )

  return (
    <section aria-label={t('plusMoves')} className="grid min-h-0 gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          aria-expanded={expanded}
          aria-label={expanded ? t('collapsePlusMoves') : t('expandPlusMoves')}
          className="inline-flex items-center gap-1.5 text-left"
          type="button"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown aria-hidden="true" size={16} />
          ) : (
            <ChevronRight aria-hidden="true" size={16} />
          )}
          <span className="label text-[0.7rem]">{t('plusMoves')}</span>
        </button>
        <button
          className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-black/5 dark:border-white/15 dark:text-stone-300 dark:hover:bg-white/5"
          type="button"
          onClick={() =>
            onPlusMovesChange(markAllLegalAsPlus(plusMoves, legalMoveSet))
          }
        >
          {t('markAllPlusMoves')}
        </button>
      </div>
      {expanded && plusMoves.permittedMoves.length === 0 ? (
        <div className="text-xs text-stone-500 dark:text-stone-400">
          {t('plusMovesEmpty')}
        </div>
      ) : expanded ? (
        <div className="max-h-72 overflow-auto rounded-md border border-black/10 dark:border-white/10">
          <div
            className={`grid items-center gap-2 px-2 py-1.5 text-[0.65rem] font-semibold uppercase text-stone-500 dark:text-stone-400 ${
              plusMoves.hasPurchasedFlags
                ? 'grid-cols-[minmax(9rem,1fr)_4.5rem_4.5rem]'
                : 'grid-cols-[minmax(9rem,1fr)_4.5rem]'
            }`}
          >
            <span>{t('moveName')}</span>
            {plusMoves.hasPurchasedFlags && (
              <span className="text-center">{t('purchased')}</span>
            )}
            <span className="text-center">{t('plus')}</span>
          </div>
          {rows.legal.length > 0 && (
            <PlusMoveSection
              rows={rows.legal}
              plusMoves={plusMoves}
              title={t('legalityLegal')}
              t={t}
              onPlusMovesChange={onPlusMovesChange}
            />
          )}
          {rows.legal.length > 0 && rows.other.length > 0 && (
            <div className="border-t border-black/10 dark:border-white/10" />
          )}
          {rows.other.length > 0 && (
            <PlusMoveSection
              rows={rows.other}
              plusMoves={plusMoves}
              title={t('legalityIllegal')}
              t={t}
              onPlusMovesChange={onPlusMovesChange}
            />
          )}
        </div>
      ) : null}
    </section>
  )
}
