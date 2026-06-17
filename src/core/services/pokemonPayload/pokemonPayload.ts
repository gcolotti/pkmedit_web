import type { PokemonDetail } from '../../types/index/index'
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

export function buildPokemonLegalityInputKey(
  draft: PokemonDetail,
  saveTrainerLanguage?: number | null,
) {
  return JSON.stringify(buildPokemonPayload(draft, saveTrainerLanguage))
}
