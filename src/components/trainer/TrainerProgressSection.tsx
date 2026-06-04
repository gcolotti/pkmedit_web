import type { Translator } from '../../core/i18n/i18n'
import type { TrainerInfo } from '../../core/types/trainer'
import { TrainerGameFieldsSection } from './TrainerGameFieldsSection'
import { TrainerRoyaleSection } from './TrainerRoyaleSection'

export function TrainerProgressSection({
  trainer,
  t,
  onChange,
}: {
  trainer: TrainerInfo
  t: Translator
  onChange: (trainer: TrainerInfo) => void
}) {
  return (
    <div className="grid gap-5">
      {trainer.royale && (
        <TrainerRoyaleSection
          royale={trainer.royale}
          t={t}
          onChange={(royale) => onChange({ ...trainer, royale })}
        />
      )}
      <TrainerGameFieldsSection
        fields={trainer.gameFields}
        actions={trainer.gameActions}
        pendingActions={trainer.pendingGameActions}
        t={t}
        onFieldChange={(key, value) =>
          onChange({
            ...trainer,
            gameFields: trainer.gameFields.map((f) =>
              f.key === key ? { ...f, value } : f,
            ),
          })
        }
        onActionQueue={(key) => {
          if (trainer.pendingGameActions?.includes(key)) return
          onChange({
            ...trainer,
            pendingGameActions: [...(trainer.pendingGameActions ?? []), key],
          })
        }}
      />
    </div>
  )
}
