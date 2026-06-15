import { Maximize2 } from 'lucide-react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokemonCosmetic,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { EditorGroup } from '../../../core/EditorGroup/EditorGroup'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsFriendship } from '../DetailsFriendship/DetailsFriendship'
import { DetailsHome } from '../DetailsHome/DetailsHome'
import { DetailsMarkings } from '../DetailsMarkings/DetailsMarkings'
import { DetailsTrainerIds } from '../DetailsTrainerIds/DetailsTrainerIds'

const fieldClassName = 'field h-9 min-w-0 px-2 py-1 text-sm font-bold'
const labelClassName = 'label truncate text-[0.65rem] leading-none'
const sectionClassName = 'grid gap-2 sm:col-span-2'
const sectionTitleClassName = 'label text-[0.7rem]'

export function DetailsGroup({
  cosmetic,
  onCosmeticChange,
  onOpenAdvanced,
  onTrainerChange,
  t,
  trainer,
}: {
  cosmetic: PokemonCosmetic
  onCosmeticChange: (cosmetic: PokemonCosmetic) => void
  onOpenAdvanced: () => void
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const otIssue = useFieldIssue('trainer.originalTrainerName')
  const htIssue = useFieldIssue('trainer.handlingTrainerName')
  const hasHandler = trainer.handlingTrainerName.trim().length > 0

  return (
    <EditorGroup title={t('details')}>
      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('trainerIdentity')}</div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <label className="grid min-w-0 gap-1">
            <span className={`${labelClassName}${otIssue.labelClassName}`}>
              {t('ot')}
            </span>
            <input
              aria-invalid={otIssue.invalid || undefined}
              className={`${fieldClassName}${otIssue.fieldClassName}`}
              value={trainer.originalTrainerName}
              onChange={(event) =>
                onTrainerChange({
                  ...trainer,
                  originalTrainerName: event.currentTarget.value,
                })
              }
            />
          </label>
          <label className="grid min-w-0 gap-1">
            <span className={`${labelClassName}${htIssue.labelClassName}`}>
              {t('ht')}
            </span>
            <input
              aria-invalid={htIssue.invalid || undefined}
              className={`${fieldClassName}${htIssue.fieldClassName}`}
              placeholder={t('none')}
              value={trainer.handlingTrainerName}
              onChange={(event) =>
                onTrainerChange({
                  ...trainer,
                  handlingTrainerName: event.currentTarget.value,
                })
              }
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className={labelClassName}>{t('currentHandler')}</span>
          <span className="rounded-md border border-black/15 px-2 py-0.5 text-xs font-bold dark:border-white/15">
            {hasHandler ? t('ht') : t('ot')}
          </span>
        </div>
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('trainerIds')}</div>
        <DetailsTrainerIds
          trainer={trainer}
          t={t}
          onTrainerChange={onTrainerChange}
        />
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('friendship')}</div>
        <DetailsFriendship
          hasHandler={hasHandler}
          trainer={trainer}
          t={t}
          onTrainerChange={onTrainerChange}
        />
      </div>

      <div className={sectionClassName}>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1 grid gap-2">
            <div className={sectionTitleClassName}>{t('homeShort')}</div>
            <DetailsHome
              cosmetic={cosmetic}
              t={t}
              onCosmeticChange={onCosmeticChange}
            />
          </div>
          <div className="col-span-2 grid gap-2">
            <div className={sectionTitleClassName}>{t('markings')}</div>
            <DetailsMarkings
              markings={cosmetic.markings}
              t={t}
              onChange={(markings) =>
                onCosmeticChange({ ...cosmetic, markings })
              }
            />
          </div>
        </div>
      </div>

      <div className={sectionClassName}>
        <button
          className="btn flex h-9 w-full items-center justify-center gap-1.5 text-sm"
          type="button"
          onClick={onOpenAdvanced}
        >
          <Maximize2 aria-hidden="true" size={14} />
          <span>{t('advanced')}</span>
        </button>
      </div>
    </EditorGroup>
  )
}
