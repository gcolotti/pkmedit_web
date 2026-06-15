import { buildPokemonLegalityInputKey } from '../../services/pokemonPayload/pokemonPayload'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'

export function initializeSelectedLegality(
  slotId: string,
  detail: PokemonDetail,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  const inputKey = buildPokemonLegalityInputKey(detail)
  setPokemonLegality((current) => ({
    ...current,
    [slotId]: current[slotId] ?? {
      report: detail.legality,
      checkedAt: Date.now(),
      inputKey,
      status: 'fresh',
      error: null,
    },
  }))
}

export function markSelectedLegalityStale(
  selectedSlotId: string,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  setPokemonLegality((legality) => {
    const previous = legality[selectedSlotId]
    if (!previous || previous.status === 'stale') return legality
    return {
      ...legality,
      [selectedSlotId]: { ...previous, status: 'stale' },
    }
  })
}

export function writeSelectedLegality(
  selectedSlotId: string,
  detail: PokemonDetail,
  inputKey: string,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  setPokemonLegality((legality) => ({
    ...legality,
    [selectedSlotId]: {
      report: detail.legality,
      checkedAt: Date.now(),
      inputKey,
      status: 'fresh',
      error: null,
    },
  }))
}

export function markSelectedLegalityError(
  selectedSlotId: string,
  current: PokemonDetail,
  inputKey: string,
  error: unknown,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  setPokemonLegality((legality) => {
    const previous = legality[selectedSlotId]
    return {
      ...legality,
      [selectedSlotId]: {
        report: previous?.report ?? current.legality,
        checkedAt: previous?.checkedAt ?? null,
        inputKey,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  })
}
