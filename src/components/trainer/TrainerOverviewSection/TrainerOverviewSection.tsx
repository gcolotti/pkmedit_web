import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index/index'
import type { TrainerInfo } from '../../../core/types/trainer/trainer'
import { TrainerIdentitySection } from '../TrainerIdentitySection/TrainerIdentitySection'
import { TrainerTimelineSection } from '../TrainerTimelineSection/TrainerTimelineSection'

export function TrainerOverviewSection({
  catalogs,
  trainer,
  t,
  onChange,
}: {
  catalogs: { languages: CatalogEntry[] }
  trainer: TrainerInfo
  t: Translator
  onChange: <K extends keyof TrainerInfo>(key: K, value: TrainerInfo[K]) => void
}) {
  return (
    <div className="grid gap-5">
      <TrainerIdentitySection
        catalogs={catalogs}
        trainer={trainer}
        t={t}
        onChange={onChange}
      />
      <TrainerTimelineSection trainer={trainer} t={t} onChange={onChange} />
    </div>
  )
}
