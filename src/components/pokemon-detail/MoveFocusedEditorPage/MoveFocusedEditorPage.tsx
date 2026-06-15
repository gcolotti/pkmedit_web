import { useMemo, useRef, useState } from 'react'

import { useWorkspace } from '../../../core/hooks/workspaceContext/workspaceContext'
import { useAbilityDetailsBySlugs } from '../../../core/query/useAbilityDetails/useAbilityDetails'
import { useMoveDetails } from '../../../core/query/useMoveDetails/useMoveDetails'
import { groupCatalogEntriesByType } from '../../../core/utils/catalogSort/catalogSort'
import { FocusedEditorShell } from '../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { MoveBrowseList } from '../MoveBrowseList/MoveBrowseList'
import { MoveDetailEmpty } from '../MoveDetailEmpty/MoveDetailEmpty'
import type { MoveFocusedEditorPageProps } from '../MoveFocusedEditorPageProps/MoveFocusedEditorPageProps'
import { MoveSlotGrid } from '../MoveSlotGrid/MoveSlotGrid'
import { SelectedMovePanel } from '../SelectedMovePanel/SelectedMovePanel'

export function MoveFocusedEditorPage(props: MoveFocusedEditorPageProps) {
  const {
    language,
    legalMoveIds,
    legalOnly = false,
    moveBasePp,
    moveCatalog,
    moves,
    plusMoves,
    t,
    onBack,
    onMovesChange,
    onPlusMovesChange,
  } = props
  const { api, state } = useWorkspace()
  const apiBase = state.apiBase
  const [selectedMoveId, setSelectedMoveId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const legalMoveSet = useMemo(() => new Set(legalMoveIds), [legalMoveIds])

  const { data: moveDetails } = useMoveDetails(api, apiBase, legalMoveIds)
  const moveById = useMemo(
    () => new Map(moveCatalog.map((e) => [e.id, e])),
    [moveCatalog],
  )
  const moveBasePpById = useMemo(
    () => new Map((moveBasePp ?? []).map((e) => [e.id, e.basePp])),
    [moveBasePp],
  )

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

  const groupedMoves = useMemo(() => {
    const legalEntries = moveCatalog.filter((e) => legalMoveSet.has(e.id))
    const otherEntries = legalOnly
      ? []
      : moveCatalog.filter((e) => !legalMoveSet.has(e.id))
    return {
      legal: groupCatalogEntriesByType(legalEntries, t),
      other: groupCatalogEntriesByType(otherEntries, t),
    }
  }, [legalMoveSet, legalOnly, moveCatalog, t])

  const selectedEntry = selectedMoveId ? moveById.get(selectedMoveId) : null
  const selectedDetail = selectedMoveId
    ? (moveDetails?.get(selectedMoveId) ?? null)
    : null

  // Modifier ability descriptions for the selected move. The v3 data carries
  // abilities by slug in current.modifiedBy.abilities, so we fetch by slug and
  // expose a slug-keyed map for the card to do an O(1) lookup per badge. The
  // hook's queryKey includes the slugs, so swapping to a different move with
  // the same modifier set is a cache hit.
  const modifierAbilitySlugs =
    selectedDetail?.current?.modifiedBy?.abilities ?? []
  const { data: abilityDetailsBySlug } = useAbilityDetailsBySlugs(
    api,
    apiBase,
    modifierAbilitySlugs,
  )

  const showList = searchFocused || query.length > 0 || !selectedEntry

  function handleSelect(id: number) {
    setSelectedMoveId(id)
    setQuery('')
    searchRef.current?.blur()
  }

  return (
    <FocusedEditorShell
      backLabel={t('backToSaveEditor')}
      onBack={onBack}
      title={`${t('moves')} · ${t('advanced')}`}
    >
      <div className="grid min-h-0 gap-4 p-4 lg:h-full lg:grid-cols-[minmax(21rem,24rem)_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-hidden rounded-md border border-black/10 bg-white/30 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <MoveSlotGrid
            moves={moves}
            groupedMoves={groupedMoves}
            moveById={moveById}
            moveBasePpById={moveBasePpById}
            selectedMoveIds={selectedMoveIds}
            legalMoveSet={legalMoveSet}
            plusMoves={plusMoves}
            t={t}
            onMovesChange={onMovesChange}
            onPlusMovesChange={onPlusMovesChange}
          />
        </aside>

        <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 rounded-md border border-black/10 bg-white/40 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <input
            ref={searchRef}
            aria-label={t('searchMovePlaceholder')}
            className="field w-full px-3 py-2 text-sm"
            placeholder={t('searchMovePlaceholder')}
            type="text"
            value={query}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          <div className="min-h-0 overflow-y-auto">
            {showList ? (
              <MoveBrowseList
                activeMoveId={selectedMoveId}
                groups={groupedMoves}
                query={query}
                selectedMoveIds={selectedMoveIds}
                t={t}
                onSelect={handleSelect}
              />
            ) : selectedEntry ? (
              <SelectedMovePanel
                abilityDetailsBySlug={abilityDetailsBySlug ?? new Map()}
                detail={selectedDetail}
                entry={selectedEntry}
                language={language}
                legal={legalMoveSet.has(selectedEntry.id)}
                moveBasePp={moveBasePpById.get(selectedEntry.id)}
                moves={moves}
                onMovesChange={onMovesChange}
                t={t}
              />
            ) : (
              <MoveDetailEmpty t={t} />
            )}
          </div>
        </section>
      </div>
    </FocusedEditorShell>
  )
}
