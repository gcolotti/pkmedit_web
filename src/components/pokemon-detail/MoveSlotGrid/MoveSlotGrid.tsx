import { Fragment } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index/index'
import type {
  PokemonMoves,
  PokemonPlusMoves,
} from '../../../core/types/pokemon/pokemon'
import { groupCatalogEntriesByType } from '../../../core/utils/catalogSort/catalogSort'
import { MoveListbox } from '../../pokemon/moves/MoveListbox/MoveListbox'
import { PlusMovesSection } from '../PlusMovesSection/PlusMovesSection'

type MoveSlot = {
  field: 'move1' | 'move2' | 'move3' | 'move4'
  pp: 'move1Pp' | 'move2Pp' | 'move3Pp' | 'move4Pp'
  ppUps: 'move1PpUps' | 'move2PpUps' | 'move3PpUps' | 'move4PpUps'
}

const MOVE_SLOTS: MoveSlot[] = [
  { field: 'move1', pp: 'move1Pp', ppUps: 'move1PpUps' },
  { field: 'move2', pp: 'move2Pp', ppUps: 'move2PpUps' },
  { field: 'move3', pp: 'move3Pp', ppUps: 'move3PpUps' },
  { field: 'move4', pp: 'move4Pp', ppUps: 'move4PpUps' },
]

const RELEARN_SLOTS = [
  'relearnMove1',
  'relearnMove2',
  'relearnMove3',
  'relearnMove4',
] as const

export function MoveSlotGrid({
  moves,
  groupedMoves,
  moveById,
  moveBasePpById,
  selectedMoveIds,
  legalMoveSet,
  plusMoves,
  t,
  onMovesChange,
  onPlusMovesChange,
}: {
  moves: PokemonMoves
  groupedMoves: {
    legal: ReturnType<typeof groupCatalogEntriesByType>
    other: ReturnType<typeof groupCatalogEntriesByType>
  }
  moveById: Map<number, CatalogEntry>
  moveBasePpById?: Map<number, number>
  selectedMoveIds: Set<number>
  legalMoveSet: Set<number>
  plusMoves: PokemonPlusMoves | null
  t: Translator
  onMovesChange: (moves: PokemonMoves) => void
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
}) {
  return (
    <div className="grid min-h-0 gap-4">
      <div className="overflow-x-auto">
        <div className="grid min-w-[21rem] grid-cols-[1.25rem_minmax(9rem,1fr)_minmax(2.75rem,0.22fr)_minmax(3.5rem,0.28fr)] items-center gap-1.5">
          <div />
          <div className="label text-[0.65rem]">{t('moveName')}</div>
          <div className="label text-center text-[0.65rem]">
            {t('ppColumn')}
          </div>
          <div className="label text-center text-[0.65rem]">
            {t('ppUpColumn')}
          </div>
          {MOVE_SLOTS.map((slot, index) => (
            <Fragment key={slot.field}>
              <div className="label min-w-0 text-center">{index + 1}</div>
              <MoveListbox
                ariaLabel={t('move', { number: index + 1 })}
                className="field min-w-0"
                groups={groupedMoves}
                moveById={moveById}
                selectedMoveIds={selectedMoveIds}
                t={t}
                value={moves[slot.field]}
                onChange={(val) => {
                  const entry = moveById.get(val)
                  const basePp = moveBasePpById?.get(val) ?? entry?.basePp ?? 0
                  const ppUps = moves[slot.ppUps]
                  const maxPp = basePp + Math.floor((basePp * ppUps) / 5)
                  onMovesChange({
                    ...moves,
                    [slot.field]: val,
                    [slot.pp]: maxPp,
                  })
                }}
              />
              <div
                aria-label={t('pp', { number: index + 1 })}
                className="field-readonly px-2 py-2 text-center tabular-nums"
                role="status"
              >
                {moves[slot.pp]}
              </div>
              <select
                aria-label={t('ppUp', { number: index + 1 })}
                className="field px-2 py-2 text-center text-sm font-bold"
                value={moves[slot.ppUps]}
                onChange={(event) =>
                  onMovesChange({
                    ...moves,
                    [slot.ppUps]: Number(event.currentTarget.value),
                  })
                }
              >
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="grid gap-2 border-t border-black/10 pt-4 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {RELEARN_SLOTS.map((field, index) => (
          <label key={field} className="grid gap-1">
            <span className="label text-[0.65rem]">
              {t('relearn', { number: index + 1 })}
            </span>
            <MoveListbox
              ariaLabel={t('relearn', { number: index + 1 })}
              className="field min-w-0"
              groups={groupedMoves}
              moveById={moveById}
              selectedMoveIds={selectedMoveIds}
              t={t}
              value={moves[field]}
              onChange={(val) => onMovesChange({ ...moves, [field]: val })}
            />
          </label>
        ))}
      </div>

      {plusMoves && (
        <div className="border-t border-black/10 pt-4 dark:border-white/10">
          <PlusMovesSection
            legalMoveSet={legalMoveSet}
            moveById={moveById}
            plusMoves={plusMoves}
            t={t}
            onPlusMovesChange={onPlusMovesChange}
          />
        </div>
      )}
    </div>
  )
}
