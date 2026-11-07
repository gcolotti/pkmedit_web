import type { PokemonDetail } from '../../types/index/index'
import type { PokemonRibbon } from '../../types/pokemon/pokemon'

// The backend rebuilds the ribbon list on every preview (legal ribbons plus the
// ones the Pokémon holds), so its order and length can differ between the base
// and the draft. Draft comparisons therefore key ribbons by id and keep only the
// held ones: a missing `cosmetic.ribbons.<id>.value|count` path means "not held".

type ComparableRibbon = { value: true; count?: number }

const ribbonFieldPath = /^cosmetic\.ribbons\.(\d+)\.(value|count)$/

export function toComparableRibbons(ribbons: PokemonRibbon[] = []) {
  return Object.fromEntries(
    ribbons
      .filter((ribbon) => ribbon.value)
      .map((ribbon): [string, ComparableRibbon] => [
        ribbon.id.toString(),
        typeof ribbon.count === 'number'
          ? { value: true, count: ribbon.count }
          : { value: true },
      ]),
  )
}

export function getRibbonIdFromPath(path: string) {
  const id = ribbonFieldPath.exec(path)?.[1]
  return id === undefined ? undefined : Number(id)
}

export function readComparableValue(
  flat: Record<string, unknown>,
  path: string,
) {
  if (path in flat) return flat[path]
  const field = ribbonFieldPath.exec(path)?.[2]
  if (field === 'value') return false
  if (field === 'count') return 0
  return undefined
}

// Restores both the flag and the count of one ribbon to their base state.
export function revertRibbon(
  base: PokemonDetail,
  draft: PokemonDetail,
  id: number,
): PokemonDetail {
  const original = base.cosmetic.ribbons.find((ribbon) => ribbon.id === id)
  const ribbons = draft.cosmetic.ribbons
  const withRibbons = (next: PokemonRibbon[]) => ({
    ...draft,
    cosmetic: { ...draft.cosmetic, ribbons: next },
  })

  if (!ribbons.some((ribbon) => ribbon.id === id))
    return original ? withRibbons([...ribbons, original]) : draft
  return withRibbons(
    ribbons.map((ribbon) =>
      ribbon.id === id ? restoreRibbon(ribbon, original) : ribbon,
    ),
  )
}

function restoreRibbon(ribbon: PokemonRibbon, original?: PokemonRibbon) {
  if (original)
    return { ...ribbon, value: original.value, count: original.count }
  const count = typeof ribbon.count === 'number' ? 0 : ribbon.count
  return { ...ribbon, value: false, count }
}
