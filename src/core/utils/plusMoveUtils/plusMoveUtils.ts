import type { CatalogEntry } from '../../types/index/index'
import type { PokemonPlusMoves } from '../../types/pokemon/pokemon'
import { sortCatalogEntriesByType } from '../catalogSort/catalogSort'

export type PlusMoveListRow = {
  entry: CatalogEntry
  index: number
  legal: boolean
}

export function buildPlusMoveRows(
  plusMoves: PokemonPlusMoves,
  moveById: Map<number, CatalogEntry>,
  legalMoveSet: Set<number>,
  legal: boolean,
): PlusMoveListRow[] {
  const rows = plusMoves.permittedMoves
    .map((moveId, index) => {
      const entry = moveById.get(moveId) ?? { id: moveId, name: `#${moveId}` }
      return { entry, index, legal: legalMoveSet.has(moveId) }
    })
    .filter((row) => row.legal === legal)

  const sortedEntries = sortCatalogEntriesByType(rows.map((row) => row.entry))
  return sortedEntries.flatMap((entry) => {
    const match = rows.find((item) => item.entry.id === entry.id)
    return match ? [match] : []
  })
}

export function markAllLegalAsPlus(
  plusMoves: PokemonPlusMoves,
  legalMoveSet: Set<number>,
): PokemonPlusMoves {
  const masteredFlags = plusMoves.permittedMoves.map((moveId, index) =>
    legalMoveSet.has(moveId) ? true : (plusMoves.masteredFlags[index] ?? false),
  )
  const purchasedFlags = plusMoves.hasPurchasedFlags
    ? plusMoves.permittedMoves.map((moveId, index) =>
        legalMoveSet.has(moveId)
          ? true
          : (plusMoves.purchasedFlags[index] ?? false),
      )
    : plusMoves.purchasedFlags
  return { ...plusMoves, masteredFlags, purchasedFlags }
}

export function updatePlusMoveFlag(
  plusMoves: PokemonPlusMoves,
  key: 'purchasedFlags' | 'masteredFlags',
  index: number,
  value: boolean,
) {
  const flags = [...plusMoves[key]]
  flags[index] = value
  return { ...plusMoves, [key]: flags }
}
