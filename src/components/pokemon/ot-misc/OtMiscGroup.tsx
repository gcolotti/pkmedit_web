import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import type {
  PokemonCosmetic,
  PokemonMain,
  PokemonTrainer,
} from '../../../core/types/pokemon'
import { MAX_SAFE_INTEGER } from '../../../core/utils/numberInput'
import { ExtraByteGrid } from '../../common/ExtraByteGrid'
import { EditorGroup } from '../../core/EditorGroup'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'
import { CompactNumberField } from '../../ui/CompactNumberField'
import { OtMiscTechnicalData } from './OtMiscTechnicalData'
import { OtMiscTrainerIds } from './OtMiscTrainerIds'

export function OtMiscGroup({
  cosmetic,
  languageCatalog,
  main,
  onCosmeticChange,
  onMainChange,
  onTrainerChange,
  t,
  trainer,
}: {
  cosmetic: PokemonCosmetic
  languageCatalog: CatalogEntry[]
  main: PokemonMain
  onCosmeticChange: (cosmetic: PokemonCosmetic) => void
  onMainChange: (main: PokemonMain) => void
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const fieldClassName = 'field h-9 min-w-0 px-2 py-1 text-sm font-bold'
  const labelClassName = 'label truncate text-[0.65rem] leading-none'
  const sectionClassName = 'grid gap-2 sm:col-span-2'
  const sectionTitleClassName = 'label text-[0.7rem]'
  const languageIssue = useFieldIssue('trainer.handlingTrainerLanguage')
  const otIssue = useFieldIssue('trainer.originalTrainerName')
  const htIssue = useFieldIssue('trainer.handlingTrainerName')

  return (
    <EditorGroup title={t('otMisc')}>
      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('trainerData')}</div>
        <OtMiscTrainerIds
          trainer={trainer}
          t={t}
          onTrainerChange={onTrainerChange}
        />
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
        <div className="grid grid-cols-2 gap-1.5">
          <label className="grid min-w-0 gap-1">
            <span
              className={`${labelClassName}${languageIssue.labelClassName}`}
            >
              {t('language')}
            </span>
            <select
              aria-invalid={languageIssue.invalid || undefined}
              className={`${fieldClassName}${languageIssue.fieldClassName}`}
              value={trainer.handlingTrainerLanguage}
              onChange={(event) =>
                onTrainerChange({
                  ...trainer,
                  handlingTrainerLanguage: Number(event.currentTarget.value),
                })
              }
            >
              {!languageCatalog.some(
                (entry) => entry.id === trainer.handlingTrainerLanguage,
              ) && (
                <option
                  value={trainer.handlingTrainerLanguage}
                >{`#${trainer.handlingTrainerLanguage}`}</option>
              )}
              {languageCatalog.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {`${entry.name} (#${entry.id})`}
                </option>
              ))}
            </select>
          </label>
          <CompactNumberField
            ariaLabel={t('homeTracker')}
            label={t('homeShort')}
            max={MAX_SAFE_INTEGER}
            validationPath="cosmetic.homeTracker"
            value={cosmetic.homeTracker}
            onChange={(value) =>
              onCosmeticChange({ ...cosmetic, homeTracker: value })
            }
          />
        </div>
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('technicalData')}</div>
        <OtMiscTechnicalData main={main} t={t} onMainChange={onMainChange} />
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('extraBytes')}</div>
        <ExtraByteGrid
          extraBytes={cosmetic.extraBytes}
          onChange={(extraBytes) =>
            onCosmeticChange({ ...cosmetic, extraBytes })
          }
        />
      </div>
    </EditorGroup>
  )
}
