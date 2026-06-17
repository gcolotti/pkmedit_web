import { Maximize2 } from 'lucide-react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import {
  getEffectiveHandlingTrainerLanguage,
  syncHandlingTrainerLanguage,
} from '../../../../core/services/handlingTrainerLanguage/handlingTrainerLanguage'
import type { CatalogEntry } from '../../../../core/types/index/index'
import type {
  PokemonCosmetic,
  PokemonTrainer,
} from '../../../../core/types/pokemon/pokemon'
import { EditorGroup } from '../../../core/EditorGroup/EditorGroup'
import { DetailsCurrentHandler } from '../DetailsCurrentHandler/DetailsCurrentHandler'
import { DetailsFriendship } from '../DetailsFriendship/DetailsFriendship'
import { DetailsHome } from '../DetailsHome/DetailsHome'
import { DetailsHtLanguage } from '../DetailsHtLanguage/DetailsHtLanguage'
import { DetailsMarkings } from '../DetailsMarkings/DetailsMarkings'
import { DetailsTrainerIdentity } from '../DetailsTrainerIdentity/DetailsTrainerIdentity'

const sectionClassName = 'grid gap-2 sm:col-span-2'
const sectionTitleClassName = 'label text-[0.7rem]'

export function DetailsGroup({
  cosmetic,
  languageCatalog,
  onCosmeticChange,
  onOpenAdvanced,
  onTrainerChange,
  saveTrainerLanguage,
  t,
  trainer,
}: {
  cosmetic: PokemonCosmetic
  languageCatalog: CatalogEntry[]
  onCosmeticChange: (cosmetic: PokemonCosmetic) => void
  onOpenAdvanced: () => void
  onTrainerChange: (trainer: PokemonTrainer) => void
  saveTrainerLanguage: number | null
  t: Translator
  trainer: PokemonTrainer
}) {
  const hasHandler = trainer.handlingTrainerName.trim().length > 0
  const effectiveHtLanguage = getEffectiveHandlingTrainerLanguage(
    trainer,
    saveTrainerLanguage,
  )

  const handleTrainerChange = (next: PokemonTrainer) => {
    onTrainerChange(syncHandlingTrainerLanguage(next, saveTrainerLanguage))
  }

  const handleHandlingTrainerNameChange = (handlingTrainerName: string) => {
    handleTrainerChange({
      ...trainer,
      handlingTrainerName,
      ...(handlingTrainerName.trim().length === 0
        ? {
            currentHandler: 0,
            handlingTrainerFriendship: 0,
            handlingTrainerGender: 0,
            handlingTrainerLanguage: 0,
          }
        : {}),
    })
  }

  return (
    <EditorGroup title={t('details')}>
      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('trainerIdentity')}</div>
        <DetailsTrainerIdentity
          t={t}
          trainer={trainer}
          onHandlingTrainerNameChange={handleHandlingTrainerNameChange}
          onTrainerChange={handleTrainerChange}
        />

        <div className="grid grid-cols-3 items-end gap-2">
          <DetailsHtLanguage
            languageCatalog={languageCatalog}
            t={t}
            value={effectiveHtLanguage}
          />
          <DetailsCurrentHandler
            hasHandler={hasHandler}
            t={t}
            trainer={trainer}
            onTrainerChange={handleTrainerChange}
          />
        </div>
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('friendship')}</div>
        <DetailsFriendship
          hasHandler={hasHandler}
          trainer={trainer}
          t={t}
          onTrainerChange={handleTrainerChange}
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
