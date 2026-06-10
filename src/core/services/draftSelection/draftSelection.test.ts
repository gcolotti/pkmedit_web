import { describe, expect, it } from 'vitest'

import type { PokemonDetail } from '../../types/index/index'
import { selectedDetail } from './draftSelection'

const pokemon = (id: number): PokemonDetail =>
  ({ id, summary: { slotId: String(id) } }) as unknown as PokemonDetail

describe('selectedDetail', () => {
  it('returns null when no slot is selected', () => {
    expect(selectedDetail(null, { a: pokemon(1) }, { a: pokemon(2) })).toBeNull()
  })

  it('prefers the draft over the base detail', () => {
    const draft = pokemon(1)
    const base = pokemon(2)
    expect(selectedDetail('a', { a: draft }, { a: base })).toBe(draft)
  })

  it('falls back to the base detail when the slot is not in drafts', () => {
    const base = pokemon(2)
    expect(selectedDetail('a', {}, { a: base })).toBe(base)
  })

  it('returns null when the slot is missing from both drafts and base', () => {
    expect(selectedDetail('missing', {}, {})).toBeNull()
  })
})
