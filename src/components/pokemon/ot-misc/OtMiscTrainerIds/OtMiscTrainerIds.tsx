import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { UINT16_MAX } from '../../../../core/utils/numberInput/numberInput'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'

type Props = {
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}

export function OtMiscTrainerIds({ onTrainerChange, t, trainer }: Props) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      <CompactNumberField
        label={t('sid16')}
        max={UINT16_MAX}
        validationPath="trainer.sid16"
        value={trainer.sid16}
        onChange={(value) => onTrainerChange({ ...trainer, sid16: value })}
      />
      <CompactNumberField
        label={t('tid16')}
        max={UINT16_MAX}
        validationPath="trainer.tid16"
        value={trainer.tid16}
        onChange={(value) => onTrainerChange({ ...trainer, tid16: value })}
      />
      <CompactNumberField
        ariaLabel={t('otFriendship')}
        label={t('friendshipShort')}
        max={255}
        validationPath="trainer.originalTrainerFriendship"
        value={trainer.originalTrainerFriendship}
        onChange={(value) =>
          onTrainerChange({ ...trainer, originalTrainerFriendship: value })
        }
      />
      <CompactNumberField
        ariaLabel={t('htFriendship')}
        label={t('htFriendshipShort')}
        max={255}
        validationPath="trainer.handlingTrainerFriendship"
        value={trainer.handlingTrainerFriendship}
        onChange={(value) =>
          onTrainerChange({ ...trainer, handlingTrainerFriendship: value })
        }
      />
    </div>
  )
}
