import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry, Language } from '../../../core/types/index/index'
import type { PokemonMoves, PokemonPlusMoves } from '../../../core/types/pokemon/pokemon'

export type MoveFocusedEditorPageProps = {
  language: Language
  legalMoveIds: number[]
  legalOnly?: boolean
  moveBasePp?: Array<{ id: number; basePp: number }>
  moveCatalog: CatalogEntry[]
  moves: PokemonMoves
  plusMoves: PokemonPlusMoves | null
  pokemonName: string
  t: Translator
  onBack: () => void
  onMovesChange: (moves: PokemonMoves) => void
  onPlusMovesChange: (plusMoves: PokemonPlusMoves) => void
}
