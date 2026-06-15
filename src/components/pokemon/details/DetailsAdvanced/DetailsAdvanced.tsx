import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import type {
  PokemonCosmetic,
  PokemonMain,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { UINT32_MAX } from '../../../../core/utils/numberInput/numberInput'
import { ExtraByteGrid } from '../../../common/ExtraByteGrid/ExtraByteGrid'
import { FocusedEditorShell } from '../../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'
import { RibbonGrid } from '../../ribbon/RibbonGrid/RibbonGrid'
import { DetailsTechnical } from '../DetailsTechnical/DetailsTechnical'

const sectionTitle = 'label text-[0.7rem]'
const card =
  'grid gap-2 rounded-md border border-black/10 p-3 dark:border-white/10'
const contestKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const

export function DetailsAdvanced({
  cosmetic,
  languageCatalog,
  main,
  onBack,
  onCosmeticChange,
  onTrainerChange,
  t,
  trainer,
}: {
  cosmetic: PokemonCosmetic
  languageCatalog: CatalogEntry[]
  main: PokemonMain
  onBack: () => void
  onCosmeticChange: (cosmetic: PokemonCosmetic) => void
  onTrainerChange: (trainer: PokemonTrainer) => void
  t: Translator
  trainer: PokemonTrainer
}) {
  const formFields = [
    { aria: t('formArgument'), label: t('argShort'), max: UINT32_MAX, path: 'cosmetic.formArgument', value: cosmetic.formArgument, patch: (v: number) => ({ formArgument: v }) },
    { aria: t('formArgumentRemain'), label: t('remainShort'), max: 255, path: 'cosmetic.formArgumentRemain', value: cosmetic.formArgumentRemain, patch: (v: number) => ({ formArgumentRemain: v }) },
    { aria: t('formArgumentElapsed'), label: t('elapsedShort'), max: 255, path: 'cosmetic.formArgumentElapsed', value: cosmetic.formArgumentElapsed, patch: (v: number) => ({ formArgumentElapsed: v }) },
    { aria: t('formArgumentMaximum'), label: t('maxShort'), max: 255, path: 'cosmetic.formArgumentMaximum', value: cosmetic.formArgumentMaximum, patch: (v: number) => ({ formArgumentMaximum: v }) },
  ]

  return (
    <FocusedEditorShell backLabel={t('backToDetails')} onBack={onBack} title={`${t('details')} · ${t('advanced')}`}>
      <div className="grid h-full min-h-0 gap-4 overflow-y-auto p-4">
        <DetailsTechnical
          languageCatalog={languageCatalog}
          main={main}
          t={t}
          trainer={trainer}
          onTrainerChange={onTrainerChange}
        />

        <section className={card}>
          <div className={sectionTitle}>{t('ribbons')}</div>
          <div className="grid sm:grid-cols-2">
            <RibbonGrid
              ribbons={cosmetic.ribbons}
              onChange={(ribbons) => onCosmeticChange({ ...cosmetic, ribbons })}
            />
          </div>
        </section>

        <section className={card}>
          <div className={sectionTitle}>{t('contestStats')}</div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {contestKeys.map((field) => (
              <CompactNumberField
                key={field}
                label={t(field)}
                max={255}
                validationPath={`cosmetic.contest.${field}`}
                value={cosmetic.contest[field]}
                onChange={(value) =>
                  onCosmeticChange({
                    ...cosmetic,
                    contest: { ...cosmetic.contest, [field]: value },
                  })
                }
              />
            ))}
          </div>
        </section>

        <section className={card}>
          <div className={sectionTitle}>{t('formCounters')}</div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {formFields.map((f) => (
              <CompactNumberField
                key={f.path}
                ariaLabel={f.aria}
                label={f.label}
                max={f.max}
                validationPath={f.path}
                value={f.value}
                onChange={(value) =>
                  onCosmeticChange({ ...cosmetic, ...f.patch(value) })
                }
              />
            ))}
          </div>
        </section>

        <section className={card}>
          <div className={sectionTitle}>{t('extraBytes')}</div>
          <ExtraByteGrid
            extraBytes={cosmetic.extraBytes}
            onChange={(extraBytes) =>
              onCosmeticChange({ ...cosmetic, extraBytes })
            }
          />
        </section>
      </div>
    </FocusedEditorShell>
  )
}
