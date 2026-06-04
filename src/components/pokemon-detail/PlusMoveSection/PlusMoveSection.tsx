import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index/index'
import type { PokemonPlusMoves } from '../../../core/types/pokemon/pokemon'
import { PlusMoveRow } from '../PlusMoveRow/PlusMoveRow'

export function PlusMoveSection({
  rows,
  plusMoves,
  title,
  t,
  onPlusMovesChange,
}: {
  rows: Array<{ entry: CatalogEntry; index: number; legal: boolean }>
  plusMoves: PokemonPlusMoves
  title: string
  t: Translator
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
}) {
  return (
    <>
      <div className="bg-black/5 px-2 py-1 text-[0.6rem] font-semibold uppercase text-stone-500 dark:bg-white/5 dark:text-stone-400">
        {title}
      </div>
      {rows.map((row) => (
        <PlusMoveRow
          key={`${row.entry.id}-${row.index}`}
          plusMoves={plusMoves}
          row={row}
          t={t}
          onPlusMovesChange={onPlusMovesChange}
        />
      ))}
    </>
  )
}
