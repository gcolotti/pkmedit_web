import type { I18nKey, Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  CatalogEntry,
  MoveLegality,
} from '../../../../core/types/index/index'

export type LegalityRow = { valid: boolean; message: string }

// Turns PKHeX's per-slot move parse into check-style rows. Valid empty slots are
// skipped as noise; when PKHeX knows which move belongs in a slot (egg move order,
// Gen 1/2 learn order) the row names it with localized move names instead of
// PKHeX's English "Expected: X" text.
export function buildMoveLegalityRows(
  moves: MoveLegality[] | undefined,
  moveCatalog: CatalogEntry[],
  slotKey: Extract<I18nKey, 'move' | 'relearn'>,
  t: Translator,
): LegalityRow[] {
  if (!moves) return []

  const names = new Map(moveCatalog.map((entry) => [entry.id, entry.name]))
  const moveName = (id: number) =>
    id === 0 ? t('legalityEmptyMove') : (names.get(id) ?? t('moveId', { id }))

  return moves
    .filter((move) => !(move.valid && move.moveId === 0))
    .map((move) => {
      const slot = t(slotKey, { number: move.slot + 1 })
      const name = moveName(move.moveId)
      return { valid: move.valid, message: describe(move, slot, name) }
    })

  function describe(move: MoveLegality, slot: string, name: string) {
    if (move.expectedMoveId === null)
      return t('legalityMoveRow', { slot, move: name, detail: move.message })
    // PKHeX expects move 0 when the slot should be empty.
    if (move.expectedMoveId === 0)
      return t('legalityMoveRowExpectedEmpty', { slot, move: name })
    return t('legalityMoveRowExpected', {
      slot,
      move: name,
      expected: moveName(move.expectedMoveId),
    })
  }
}
