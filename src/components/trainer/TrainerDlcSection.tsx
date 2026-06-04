import type { Translator } from '../../core/i18n/i18n'
import type { DonutDraft, DonutPocket } from '../../core/types/donut'
import type { CatalogEntry } from '../../core/types/index'
import type { TrainerInfo } from '../../core/types/trainer'
import { DonutPocketSection } from '../donut/DonutPocketSection'
import { TrainerDlcFields } from './TrainerDlcFields'
import { TrainerGameFieldsSection } from './TrainerGameFieldsSection'

export function TrainerDlcSection({
  donutDrafts,
  itemCatalog,
  sessionId,
  trainer,
  t,
  onChange,
  onAddDonut,
  onLoadDonuts,
  onOpenDonutCreator,
}: {
  donutDrafts: DonutDraft[]
  itemCatalog: CatalogEntry[]
  sessionId: string | null
  trainer: TrainerInfo
  t: Translator
  onChange: (trainer: TrainerInfo) => void
  onAddDonut: (draft: DonutDraft) => void
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>
  onOpenDonutCreator: (pocket: DonutPocket) => void
}) {
  if (!hasTrainerDlcContent(trainer)) {
    return (
      <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
        {t('trainerDlcNotAvailable')}
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      {trainer.dlc && (
        <TrainerDlcFields
          dlc={trainer.dlc}
          t={t}
          onChange={(dlc) => onChange({ ...trainer, dlc })}
        />
      )}
      {((trainer.dlcGameFields?.length ?? 0) > 0 ||
        (trainer.dlcGameActions?.length ?? 0) > 0) && (
        <TrainerGameFieldsSection
          fields={trainer.dlcGameFields ?? []}
          actions={trainer.dlcGameActions ?? []}
          pendingActions={trainer.pendingGameActions}
          t={t}
          onFieldChange={(key, value) =>
            onChange({
              ...trainer,
              dlcGameFields: (trainer.dlcGameFields ?? []).map((f) =>
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
      )}
      {trainer.hasDonutPocket && (
        <DonutPocketSection
          donutDrafts={donutDrafts}
          itemCatalog={itemCatalog}
          sessionId={sessionId}
          t={t}
          onAddDonut={onAddDonut}
          onLoadDonuts={onLoadDonuts}
          onOpenCreator={onOpenDonutCreator}
        />
      )}
    </div>
  )
}

export function hasTrainerDlcContent(trainer: TrainerInfo) {
  return Boolean(
    trainer.dlc ||
    trainer.hasDonutPocket ||
    (trainer.dlcGameFields?.length ?? 0) > 0 ||
    (trainer.dlcGameActions?.length ?? 0) > 0,
  )
}
