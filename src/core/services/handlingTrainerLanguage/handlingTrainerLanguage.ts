import type { PokemonDetail } from '../../types/index/index'
import type { PokemonTrainer } from '../../types/pokemon/pokemon'

export function getEffectiveHandlingTrainerLanguage(
  trainer: PokemonTrainer,
  saveTrainerLanguage: number | null | undefined,
) {
  const hasHandler = (trainer.handlingTrainerName ?? '').trim().length > 0
  if (!hasHandler) return 0
  if ((trainer.currentHandler ?? 0) > 0 && saveTrainerLanguage != null)
    return saveTrainerLanguage
  return trainer.handlingTrainerLanguage ?? 0
}

export function syncHandlingTrainerLanguage(
  trainer: PokemonTrainer,
  saveTrainerLanguage: number | null | undefined,
) {
  const handlingTrainerLanguage = getEffectiveHandlingTrainerLanguage(
    trainer,
    saveTrainerLanguage,
  )
  return trainer.handlingTrainerLanguage === handlingTrainerLanguage
    ? trainer
    : { ...trainer, handlingTrainerLanguage }
}

export function syncPokemonHandlingTrainerLanguage(
  detail: PokemonDetail,
  saveTrainerLanguage: number | null | undefined,
) {
  const trainer = syncHandlingTrainerLanguage(
    detail.trainer,
    saveTrainerLanguage,
  )
  return trainer === detail.trainer ? detail : { ...detail, trainer }
}
