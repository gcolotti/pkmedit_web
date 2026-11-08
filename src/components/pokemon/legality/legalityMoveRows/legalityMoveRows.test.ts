import { describe, expect, it } from 'vitest'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { MoveLegality } from '../../../../core/types/index/index'
import { buildMoveLegalityRows } from './legalityMoveRows'

const t = ((key: string, params: Record<string, string | number> = {}) =>
  `${key}(${Object.values(params).join('|')})`) as Translator

const catalog = [
  { id: 33, name: 'Placaje' },
  { id: 45, name: 'Gruñido' },
]

const move = (overrides: Partial<MoveLegality>): MoveLegality => ({
  slot: 0,
  moveId: 33,
  valid: true,
  method: 'LevelUp',
  expectedMoveId: null,
  message: 'Learned by Level-up.',
  ...overrides,
})

describe('buildMoveLegalityRows', () => {
  it('returns no rows when the report has no move data', () => {
    expect(buildMoveLegalityRows(undefined, catalog, 'move', t)).toEqual([])
  })

  it('uses the localized move name and PKHeX detail for each slot', () => {
    const rows = buildMoveLegalityRows([move({ slot: 1 })], catalog, 'move', t)

    expect(rows).toEqual([
      {
        valid: true,
        message: 'legalityMoveRow(move(2)|Placaje|Learned by Level-up.)',
      },
    ])
  })

  it('names the expected move instead of PKHeX text when the slot has one', () => {
    const rows = buildMoveLegalityRows(
      [
        move({
          valid: false,
          method: 'UnobtainableExpect',
          expectedMoveId: 45,
        }),
      ],
      catalog,
      'relearn',
      t,
    )

    expect(rows).toEqual([
      {
        valid: false,
        message: 'legalityMoveRowExpected(relearn(1)|Placaje|Gruñido)',
      },
    ])
  })

  it('skips valid empty slots but keeps empty slots PKHeX marks invalid', () => {
    const rows = buildMoveLegalityRows(
      [
        move({ slot: 2, moveId: 0, method: 'Empty' }),
        move({
          slot: 3,
          moveId: 0,
          valid: false,
          method: 'EmptyInvalid',
          expectedMoveId: 45,
        }),
      ],
      catalog,
      'move',
      t,
    )

    expect(rows).toEqual([
      {
        valid: false,
        message: 'legalityMoveRowExpected(move(4)|legalityEmptyMove()|Gruñido)',
      },
    ])
  })

  it('says the slot should be empty when PKHeX expects move 0', () => {
    const rows = buildMoveLegalityRows(
      [
        move({
          valid: false,
          method: 'UnobtainableExpect',
          expectedMoveId: 0,
        }),
      ],
      catalog,
      'move',
      t,
    )

    expect(rows[0].message).toBe(
      'legalityMoveRowExpectedEmpty(move(1)|Placaje)',
    )
  })

  it('falls back to the move id when the catalog lacks the move', () => {
    const rows = buildMoveLegalityRows(
      [move({ moveId: 999 })],
      catalog,
      'move',
      t,
    )

    expect(rows[0].message).toContain('moveId(999)')
  })
})
