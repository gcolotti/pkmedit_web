import type { Translator } from '../../../core/i18n/i18n'
import type { PokemonCosmetic, PokemonStats } from '../../../core/types/pokemon'
import { UINT32_MAX } from '../../../core/utils/numberInput'
import { EditorGroup } from '../../core/EditorGroup'
import { CompactNumberField } from '../../ui/CompactNumberField'
import { RibbonGrid } from '../ribbon/RibbonGrid'

export function CosmeticGroup({
  cosmetic,
  onChange,
  t,
}: {
  cosmetic: PokemonCosmetic
  onChange: (cosmetic: PokemonCosmetic) => void
  t: Translator
}) {
  const statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
  const sectionClassName = 'grid gap-2'
  const sectionTitleClassName = 'label text-[0.7rem]'

  function update(next: Partial<PokemonCosmetic>) {
    onChange({ ...cosmetic, ...next })
  }

  function updateContest(field: keyof PokemonStats, value: number) {
    update({ contest: { ...cosmetic.contest, [field]: value } })
  }

  return (
    <EditorGroup title={t('cosmetic')}>
      <div className={`${sectionClassName} sm:col-span-2`}>
        <div className={sectionTitleClassName}>{t('dimensions')}</div>
        <div className="grid grid-cols-3 gap-1.5">
          <CompactNumberField
            label={t('height')}
            max={255}
            validationPath="cosmetic.height"
            value={cosmetic.height}
            onChange={(value) => update({ height: value })}
          />
          <CompactNumberField
            label={t('weight')}
            max={255}
            validationPath="cosmetic.weight"
            value={cosmetic.weight}
            onChange={(value) => update({ weight: value })}
          />
          <CompactNumberField
            label={t('scale')}
            max={255}
            validationPath="cosmetic.scale"
            value={cosmetic.scale}
            onChange={(value) => update({ scale: value })}
          />
        </div>
      </div>

      <div className={`${sectionClassName} sm:col-span-2`}>
        <div className={sectionTitleClassName}>{t('contestStats')}</div>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {statKeys.map((field) => (
            <CompactNumberField
              key={field}
              label={t(field)}
              max={255}
              validationPath={`cosmetic.contest.${field}`}
              value={cosmetic.contest[field]}
              onChange={(value) => updateContest(field, value)}
            />
          ))}
        </div>
      </div>

      <div className={`${sectionClassName} sm:col-span-2`}>
        <div className={sectionTitleClassName}>{t('markings')}</div>
        <div className="grid grid-cols-6 gap-1.5">
          {cosmetic.markings.map((value, index) => (
            <CompactNumberField
              key={index}
              ariaLabel={t('marking', { number: index + 1 })}
              label={`${index + 1}`}
              max={2}
              validationPath="cosmetic.markings"
              value={value}
              onChange={(next) =>
                update({
                  markings: cosmetic.markings.map((item, itemIndex) =>
                    itemIndex === index ? next : item,
                  ),
                })
              }
            />
          ))}
        </div>
      </div>

      <div className={`${sectionClassName} sm:col-span-2`}>
        <div className={sectionTitleClassName}>{t('formCounters')}</div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <CompactNumberField
            ariaLabel={t('formArgument')}
            label={t('argShort')}
            max={UINT32_MAX}
            validationPath="cosmetic.formArgument"
            value={cosmetic.formArgument}
            onChange={(value) => update({ formArgument: value })}
          />
          <CompactNumberField
            ariaLabel={t('formArgumentRemain')}
            label={t('remainShort')}
            max={255}
            validationPath="cosmetic.formArgumentRemain"
            value={cosmetic.formArgumentRemain}
            onChange={(value) => update({ formArgumentRemain: value })}
          />
          <CompactNumberField
            ariaLabel={t('formArgumentElapsed')}
            label={t('elapsedShort')}
            max={255}
            validationPath="cosmetic.formArgumentElapsed"
            value={cosmetic.formArgumentElapsed}
            onChange={(value) => update({ formArgumentElapsed: value })}
          />
          <CompactNumberField
            ariaLabel={t('formArgumentMaximum')}
            label={t('maxShort')}
            max={255}
            validationPath="cosmetic.formArgumentMaximum"
            value={cosmetic.formArgumentMaximum}
            onChange={(value) => update({ formArgumentMaximum: value })}
          />
        </div>
      </div>

      <RibbonGrid
        ribbons={cosmetic.ribbons}
        onChange={(ribbons) => update({ ribbons })}
      />
    </EditorGroup>
  )
}
