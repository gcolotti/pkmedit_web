import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import type { PokemonMoves } from '../../../../core/types/pokemon/pokemon'
import type { CatalogEntryGroup } from '../../../../core/utils/catalogSort/catalogSort'
import { MoveListbox } from '../MoveListbox/MoveListbox'

type MoveRow = {
  move: 'move1' | 'move2' | 'move3' | 'move4'
  pp: 'move1Pp' | 'move2Pp' | 'move3Pp' | 'move4Pp'
  ppUps: 'move1PpUps' | 'move2PpUps' | 'move3PpUps' | 'move4PpUps'
}

type Props = {
  groupedMoves: {
    legal: CatalogEntryGroup[]
    other: CatalogEntryGroup[]
  }
  headerClassName: string
  issue: { invalid: boolean; fieldClassName: string; labelClassName: string }
  moveById: Map<number, CatalogEntry>
  moveBasePpById?: Map<number, number>
  moveRows: MoveRow[]
  moves: PokemonMoves
  onChange: (moves: PokemonMoves) => void
  onOpenMovesBrowser?: () => void
  onPreviewMoveChange: (id: number | null) => void
  selectedMoveIds: Set<number>
  t: Translator
}

const ppClassName = 'field-readonly px-2 py-2 text-center tabular-nums'
const ppUpClassName = 'field px-2 py-2 text-center text-sm font-bold'

export function MovesGrid({
  groupedMoves,
  headerClassName,
  issue,
  moveById,
  moveBasePpById,
  moveRows,
  moves,
  onChange,
  onOpenMovesBrowser,
  onPreviewMoveChange,
  selectedMoveIds,
  t,
}: Props) {
  return (
    <div className="overflow-x-auto sm:col-span-2">
      <div className="grid min-w-[21rem] grid-cols-[1.25rem_minmax(9rem,1fr)_minmax(2.75rem,0.22fr)_minmax(3.5rem,0.28fr)] items-center gap-1.5">
        <div>
          {onOpenMovesBrowser && (
            <div className="flex justify-end sm:col-span-2">
              <button
                aria-label={t('movesFullView')}
                className="inline-flex items-center rounded border border-black/10 bg-white/60 px-0.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 dark:hover:bg-white/[0.08]"
                type="button"
                onClick={onOpenMovesBrowser}
              >
                ←
              </button>
            </div>
          )}
        </div>
        <div className="label text-[0.65rem]">{t('moveName')}</div>
        <div className={headerClassName}>{t('ppColumn')}</div>
        <div className={headerClassName}>{t('ppUpColumn')}</div>
        {moveRows.map((row, index) => (
          <div key={row.move} className="contents">
            <div className={`label min-w-0 text-center${issue.labelClassName}`}>
              {index + 1}
            </div>
            <MoveListbox
              ariaInvalid={issue.invalid}
              ariaLabel={t('move', { number: index + 1 })}
              className={`field min-w-0${issue.fieldClassName}`}
              groups={groupedMoves}
              moveById={moveById}
              selectedMoveIds={selectedMoveIds}
              t={t}
              value={moves[row.move]}
              onChange={(val) => {
                const entry = moveById.get(val)
                const basePp = moveBasePpById?.get(val) ?? entry?.basePp ?? 0
                const ppUps = moves[row.ppUps]
                const maxPp = basePp + Math.floor((basePp * ppUps) / 5)
                onChange({ ...moves, [row.move]: val, [row.pp]: maxPp })
              }}
              onPreviewMoveChange={onPreviewMoveChange}
            />
            <div
              aria-label={t('pp', { number: index + 1 })}
              className={`${ppClassName}${issue.fieldClassName}`}
              role="status"
            >
              {moves[row.pp]}
            </div>
            <select
              aria-invalid={issue.invalid || undefined}
              aria-label={t('ppUp', { number: index + 1 })}
              className={`${ppUpClassName}${issue.fieldClassName}`}
              value={moves[row.ppUps]}
              onChange={(event) =>
                onChange({
                  ...moves,
                  [row.ppUps]: Number(event.currentTarget.value),
                })
              }
            >
              {[0, 1, 2, 3].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
