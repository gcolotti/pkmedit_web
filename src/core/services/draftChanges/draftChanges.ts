import type { Translator } from '../../i18n/i18n/i18n'
import type {
  PokemonDraftChange,
  PokemonReplacement,
} from '../../types/database/database'
import type { DraftChange, PokemonDetail } from '../../types/index/index'
import type { PokemonSummary } from '../../types/pokemon/pokemon'
import {
  flatten,
  formatValue,
  labelPath,
} from '../draftPathUtils/draftPathUtils'
import { buildPokemonPayload } from '../pokemonPayload/pokemonPayload'
import { areStructurallyEqual } from '../structuralEquality/structuralEquality'

export function buildDraftRequests(
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  replacements: Record<string, PokemonReplacement> = {},
): PokemonDraftChange[] {
  // A slot with a replacement (applied database encounter) sends the raw
  // bytes AND the field payload: the backend builds the mon from the bytes,
  // then applies the payload on top, so manual edits made after "Apply to
  // draft" survive the export (replacement alone silently dropped them).
  return Object.entries(drafts)
    .filter(([slotId, draft]) => hasPokemonChanged(baseDetails[slotId], draft))
    .map(([slotId, draft]) =>
      replacements[slotId]
        ? {
            slotId,
            pokemon: buildPokemonPayload(draft),
            replacement: replacements[slotId],
          }
        : { slotId, pokemon: buildPokemonPayload(draft) },
    )
}

export function buildDraftChangeList(
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  t: Translator,
): DraftChange[] {
  return Object.entries(drafts).flatMap(([slotId, draft]) => {
    const base = baseDetails[slotId]
    if (!base) return []
    const basePayloadSource = buildPokemonPayload(base)
    const draftPayloadSource = buildPokemonPayload(draft)
    if (areStructurallyEqual(basePayloadSource, draftPayloadSource)) return []
    const basePayload = flatten(basePayloadSource)
    const draftPayload = flatten(draftPayloadSource)
    return Object.entries(draftPayload)
      .filter(([path, value]) => !Object.is(basePayload[path], value))
      .map(([path, value]) => ({
        slotId,
        path,
        label: `${draft.summary.speciesName} - ${labelPath(path, t)}`,
        before: formatValue(basePayload[path], t, path),
        after: formatValue(value, t, path),
      }))
  })
}

export function hasPokemonChanged(
  base: PokemonDetail | undefined,
  draft: PokemonDetail | undefined,
) {
  if (!base || !draft) return false
  return !areStructurallyEqual(
    buildPokemonPayload(base),
    buildPokemonPayload(draft),
  )
}

export function mergeDraftSummary(
  slot: PokemonSummary,
  drafts: Record<string, PokemonDetail>,
) {
  const draft = drafts[slot.slotId]
  return draft ? { ...draft.summary, alpha: draft.cosmetic.alpha } : slot
}
