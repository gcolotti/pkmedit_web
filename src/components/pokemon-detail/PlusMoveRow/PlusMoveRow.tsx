import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { PokemonPlusMoves } from '../../../core/types/pokemon/pokemon'
import { getCatalogEntryOptionStyle } from '../../../core/utils/catalogStyle/catalogStyle'
import type { PlusMoveListRow } from '../../../core/utils/plusMoveUtils/plusMoveUtils'
import { updatePlusMoveFlag } from '../../../core/utils/plusMoveUtils/plusMoveUtils'
import { TypeIcon } from '../../ui/TypeIcon/TypeIcon'

export function PlusMoveRow({
  plusMoves,
  row,
  t,
  onPlusMovesChange,
}: {
  plusMoves: PokemonPlusMoves
  row: PlusMoveListRow
  t: Translator
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
}) {
  const gridClassName = plusMoves.hasPurchasedFlags
    ? 'grid-cols-[minmax(9rem,1fr)_4.5rem_4.5rem]'
    : 'grid-cols-[minmax(9rem,1fr)_4.5rem]'

  return (
    <div
      className={`grid items-center gap-2 border-t border-black/5 px-2 py-1.5 text-sm dark:border-white/10 ${gridClassName}`}
      style={getCatalogEntryOptionStyle(row.entry, { legal: row.legal })}
    >
      <span className="flex min-w-0 items-center gap-2">
        <TypeIcon typeId={row.entry.typeId} />
        <span className="min-w-0 truncate">{row.entry.name}</span>
      </span>
      {plusMoves.hasPurchasedFlags && (
        <input
          aria-label={`${row.entry.name} ${t('purchased')}`}
          checked={plusMoves.purchasedFlags[row.index] ?? false}
          className="mx-auto h-4 w-4"
          type="checkbox"
          onChange={(event) =>
            onPlusMovesChange(
              updatePlusMoveFlag(
                plusMoves,
                'purchasedFlags',
                row.index,
                event.currentTarget.checked,
              ),
            )
          }
        />
      )}
      <input
        aria-label={`${row.entry.name} ${t('plus')}`}
        checked={plusMoves.masteredFlags[row.index] ?? false}
        className="mx-auto h-4 w-4"
        type="checkbox"
        onChange={(event) =>
          onPlusMovesChange(
            updatePlusMoveFlag(
              plusMoves,
              'masteredFlags',
              row.index,
              event.currentTarget.checked,
            ),
          )
        }
      />
    </div>
  )
}
