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
import {
  getRibbonIdFromPath,
  readComparableValue,
} from '../draftRibbons/draftRibbons'
import {
  buildComparablePokemonPayload,
  buildPokemonPayload,
} from '../pokemonPayload/pokemonPayload'
import { areStructurallyEqual } from '../structuralEquality/structuralEquality'

export function buildDraftRequests(
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  replacements: Record<string, PokemonReplacement> = {},
  saveTrainerLanguage?: number | null,
): PokemonDraftChange[] {
  // A slot with a replacement (applied database encounter) sends the raw
  // bytes AND the field payload: the backend builds the mon from the bytes,
  // then applies the payload on top, so manual edits made after "Apply to
  // draft" survive the export (replacement alone silently dropped them).
  return Object.entries(drafts)
    .filter(([slotId, draft]) =>
      hasPokemonChanged(baseDetails[slotId], draft, saveTrainerLanguage),
    )
    .map(([slotId, draft]) =>
      replacements[slotId]
        ? {
            slotId,
            pokemon: buildPokemonPayload(draft, saveTrainerLanguage),
            replacement: replacements[slotId],
          }
        : { slotId, pokemon: buildPokemonPayload(draft, saveTrainerLanguage) },
    )
}

export function buildDraftChangeList(
  baseDetails: Record<string, PokemonDetail>,
  drafts: Record<string, PokemonDetail>,
  t: Translator,
  saveTrainerLanguage?: number | null,
): DraftChange[] {
  return Object.entries(drafts).flatMap(([slotId, draft]) => {
    const base = baseDetails[slotId]
    if (!base) return []
    const basePayloadSource = buildComparablePokemonPayload(
      base,
      saveTrainerLanguage,
    )
    const draftPayloadSource = buildComparablePokemonPayload(
      draft,
      saveTrainerLanguage,
    )
    if (areStructurallyEqual(basePayloadSource, draftPayloadSource)) return []
    const basePayload = flatten(basePayloadSource)
    const draftPayload = flatten(draftPayloadSource)
    // Union of paths: a ribbon dropped from the draft only exists in the base.
    const paths = new Set([
      ...Object.keys(draftPayload),
      ...Object.keys(basePayload),
    ])
    return [...paths].flatMap((path) => {
      const before = readComparableValue(basePayload, path)
      const after = readComparableValue(draftPayload, path)
      if (Object.is(before, after)) return []
      return {
        slotId,
        path,
        label: `${draft.summary.speciesName} - ${changeLabel(path, base, draft, t)}`,
        before: formatValue(before, t, path),
        after: formatValue(after, t, path),
      }
    })
  })
}

// Ribbon paths end in a generic "value"/"count", so name the ribbon instead.
function changeLabel(
  path: string,
  base: PokemonDetail,
  draft: PokemonDetail,
  t: Translator,
) {
  const id = getRibbonIdFromPath(path)
  const ribbon =
    id === undefined
      ? undefined
      : [...draft.cosmetic.ribbons, ...base.cosmetic.ribbons].find(
          (item) => item.id === id,
        )
  return ribbon ? `${t('ribbons')}: ${ribbon.name}` : labelPath(path, t)
}

export function hasPokemonChanged(
  base: PokemonDetail | undefined,
  draft: PokemonDetail | undefined,
  saveTrainerLanguage?: number | null,
) {
  if (!base || !draft) return false
  return !areStructurallyEqual(
    buildComparablePokemonPayload(base, saveTrainerLanguage),
    buildComparablePokemonPayload(draft, saveTrainerLanguage),
  )
}

export function mergeDraftSummary(
  slot: PokemonSummary,
  drafts: Record<string, PokemonDetail>,
) {
  const draft = drafts[slot.slotId]
  return draft ? { ...draft.summary, alpha: draft.cosmetic.alpha } : slot
}
