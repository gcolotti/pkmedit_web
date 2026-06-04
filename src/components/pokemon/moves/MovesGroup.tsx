import { useMemo, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import type {
  PokemonMoves,
  PokemonPlusMoves,
} from '../../../core/types/pokemon'
import { groupCatalogEntriesByType } from '../../../core/utils/catalogSort'
import { EditorGroup } from '../../core/EditorGroup'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'
import { PlusMovesSection } from '../../pokemon-detail/PlusMovesSection'
import { MoveListbox } from './MoveListbox'
import { MovesGrid } from './MovesGrid'

type MoveRow = {
  move: 'move1' | 'move2' | 'move3' | 'move4'
  pp: 'move1Pp' | 'move2Pp' | 'move3Pp' | 'move4Pp'
  ppUps: 'move1PpUps' | 'move2PpUps' | 'move3PpUps' | 'move4PpUps'
}

export function MovesGroup({
  moves,
  moveBasePp,
  moveCatalog,
  legalMoveIds,
  legalOnly = false,
  plusMoves,
  onChange,
  onOpenMovesBrowser,
  onPlusMovesChange,
  t,
}: {
  moves: PokemonMoves
  moveBasePp?: Array<{ id: number; basePp: number }>
  moveCatalog: CatalogEntry[]
  legalMoveIds: number[]
  legalOnly?: boolean
  plusMoves: PokemonPlusMoves | null
  onChange: (moves: PokemonMoves) => void
  onOpenMovesBrowser?: () => void
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
  t: Translator
}) {
  const moveRows: MoveRow[] = [
    { move: 'move1', pp: 'move1Pp', ppUps: 'move1PpUps' },
    { move: 'move2', pp: 'move2Pp', ppUps: 'move2PpUps' },
    { move: 'move3', pp: 'move3Pp', ppUps: 'move3PpUps' },
    { move: 'move4', pp: 'move4Pp', ppUps: 'move4PpUps' },
  ]
  const legalMoveSet = useMemo(() => new Set(legalMoveIds), [legalMoveIds])
  const [_previewMoveId, setPreviewMoveId] = useState<number | null>(null)
  const groupedMoves = useMemo(() => {
    const legalEntries = moveCatalog.filter((entry) =>
      legalMoveSet.has(entry.id),
    )
    const otherEntries = legalOnly
      ? []
      : moveCatalog.filter((entry) => !legalMoveSet.has(entry.id))
    return {
      legal: groupCatalogEntriesByType(legalEntries, t),
      other: groupCatalogEntriesByType(otherEntries, t),
    }
  }, [legalMoveSet, legalOnly, moveCatalog, t])
  const moveById = useMemo(
    () => new Map(moveCatalog.map((e) => [e.id, e])),
    [moveCatalog],
  )
  const moveBasePpById = useMemo(
    () => new Map((moveBasePp ?? []).map((e) => [e.id, e.basePp])),
    [moveBasePp],
  )
  const relearnFields = [
    'relearnMove1',
    'relearnMove2',
    'relearnMove3',
    'relearnMove4',
  ] as const
  const selectedMoveIds = useMemo(
    () =>
      new Set(
        [
          moves.move1,
          moves.move2,
          moves.move3,
          moves.move4,
          moves.relearnMove1,
          moves.relearnMove2,
          moves.relearnMove3,
          moves.relearnMove4,
        ].filter(Boolean),
      ),
    [moves],
  )
  const headerClassName = 'label text-center text-[0.65rem]'
  const issue = useFieldIssue('moves')

  return (
    <div className="grid gap-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:overflow-hidden">
      <div className="xl:shrink-0">
        <EditorGroup title={t('moves')}>
          <MovesGrid
            groupedMoves={groupedMoves}
            headerClassName={headerClassName}
            issue={issue}
            moveById={moveById}
            moveBasePpById={moveBasePpById}
            moveRows={moveRows}
            moves={moves}
            selectedMoveIds={selectedMoveIds}
            t={t}
            onChange={onChange}
            onOpenMovesBrowser={onOpenMovesBrowser}
            onPreviewMoveChange={setPreviewMoveId}
          />
          <div className="border-t border-black/10 dark:border-white/10 sm:col-span-2" />
          {relearnFields.map((field, index) => (
            <label key={field} className="grid gap-1.5">
              <span className={`label${issue.labelClassName} text-[0.65rem]`}>
                {t('relearn', { number: index + 1 })}
              </span>
              <MoveListbox
                ariaInvalid={issue.invalid}
                ariaLabel={t('relearn', { number: index + 1 })}
                className={`field${issue.fieldClassName}`}
                groups={groupedMoves}
                moveById={moveById}
                selectedMoveIds={selectedMoveIds}
                t={t}
                value={moves[field]}
                onChange={(val) => onChange({ ...moves, [field]: val })}
                onPreviewMoveChange={setPreviewMoveId}
              />
            </label>
          ))}
          {plusMoves && (
            <div className="border-t border-black/10 pt-2 dark:border-white/10 sm:col-span-2">
              <PlusMovesSection
                legalMoveSet={legalMoveSet}
                moveById={moveById}
                plusMoves={plusMoves}
                t={t}
                onPlusMovesChange={onPlusMovesChange}
              />
            </div>
          )}
        </EditorGroup>
      </div>
    </div>
  )
}
