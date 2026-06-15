import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonTrainer } from '../../../../core/types/pokemon/pokemon'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'

const DISPLAY_ID_MAX = 999999

export function DetailsTrainerIds({
  onTrainerChange,
  t,
  trainer,
}: {
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const rawIds = [
    { label: t('tid16'), value: trainer.tid16 },
    { label: t('sid16'), value: trainer.sid16 },
  ]

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-1.5">
        <CompactNumberField
          label={t('displayTid')}
          max={DISPLAY_ID_MAX}
          validationPath="trainer.displayTid"
          value={trainer.displayTid}
          onChange={(value) => onTrainerChange({ ...trainer, displayTid: value })}
        />
        <CompactNumberField
          label={t('displaySid')}
          max={DISPLAY_ID_MAX}
          validationPath="trainer.displaySid"
          value={trainer.displaySid}
          onChange={(value) => onTrainerChange({ ...trainer, displaySid: value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-1.5 rounded-md border border-black/10 bg-black/[0.03] p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
        {rawIds.map((field) => (
          <div key={field.label} className="grid min-w-0 gap-1">
            <span className="label truncate text-[0.65rem] leading-none">
              {`${field.label} · ${t('internal')}`}
            </span>
            <div className="field flex h-9 min-w-0 items-center justify-center px-2 text-center text-sm font-bold tabular-nums opacity-60">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
