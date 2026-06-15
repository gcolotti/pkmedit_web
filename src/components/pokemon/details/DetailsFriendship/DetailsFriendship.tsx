import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'

export function DetailsFriendship({
  hasHandler,
  onTrainerChange,
  t,
  trainer,
}: {
  hasHandler: boolean
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  return (
    <div className={`grid gap-1.5 ${hasHandler ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <CompactNumberField
        label={t('otFriendship')}
        max={255}
        validationPath="trainer.originalTrainerFriendship"
        value={trainer.originalTrainerFriendship}
        onChange={(value) =>
          onTrainerChange({ ...trainer, originalTrainerFriendship: value })
        }
      />
      {hasHandler && (
        <CompactNumberField
          label={t('htFriendship')}
          max={255}
          validationPath="trainer.handlingTrainerFriendship"
          value={trainer.handlingTrainerFriendship}
          onChange={(value) =>
            onTrainerChange({ ...trainer, handlingTrainerFriendship: value })
          }
        />
      )}
    </div>
  )
}
