import type { PokemonDetail } from '../types/index'

export function selectedDetail(
  selectedSlotId: string | null,
  drafts: Record<string, PokemonDetail>,
  baseDetails: Record<string, PokemonDetail>,
) {
  return selectedSlotId
    ? (drafts[selectedSlotId] ?? baseDetails[selectedSlotId] ?? null)
    : null
}
