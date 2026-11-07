import type { PokemonDetail } from '../../types/index/index'
import { toComparableRibbons } from '../draftRibbons/draftRibbons'
import { syncHandlingTrainerLanguage } from '../handlingTrainerLanguage/handlingTrainerLanguage'

export function buildPokemonPayload(
  draft: PokemonDetail,
  saveTrainerLanguage?: number | null,
) {
  const {
    cosmetic,
    evs,
    hyperTrainedIvs,
    ivs,
    main,
    moves,
    origin,
    plusMoves,
    summary,
    trainer,
  } = draft
  const syncedTrainer = trainer
    ? syncHandlingTrainerLanguage(trainer, saveTrainerLanguage)
    : trainer
  const payload = {
    ability: summary.ability,
    abilityNumber: summary.abilityNumber,
    ball: summary.ball,
    cosmetic,
    evs,
    form: summary.form,
    heldItem: summary.heldItem,
    hyperTrainedIvs,
    ivs,
    level: summary.level,
    main,
    moves,
    nature: summary.nature,
    origin,
    plusMoves,
    shiny: summary.shiny,
    species: summary.species,
    trainer: syncedTrainer,
  }

  if (
    typeof draft.teraTypeOriginal === 'number' &&
    typeof draft.teraTypeOverride === 'number' &&
    draft.teraTypeOriginal >= 0 &&
    draft.teraTypeOverride >= 0
  ) {
    return {
      ...payload,
      teraTypeOriginal: draft.teraTypeOriginal,
      teraTypeOverride: draft.teraTypeOverride,
    }
  }

  return payload
}

// Shape used to compare a draft against its base: ribbons keyed by id, held ones only.
export function buildComparablePokemonPayload(
  draft: PokemonDetail,
  saveTrainerLanguage?: number | null,
) {
  const payload = buildPokemonPayload(draft, saveTrainerLanguage)
  return {
    ...payload,
    cosmetic: {
      ...payload.cosmetic,
      ribbons: toComparableRibbons(payload.cosmetic.ribbons),
    },
  }
}

// Built from the comparable payload so refreshing the ribbon list from a
// legality preview (names, limits, obtainable flags) does not count as new input.
export function buildPokemonLegalityInputKey(
  draft: PokemonDetail,
  saveTrainerLanguage?: number | null,
) {
  return JSON.stringify(
    buildComparablePokemonPayload(draft, saveTrainerLanguage),
  )
}
