import type { Translator } from '../../core/i18n/i18n'
import type { CatalogEntry } from '../../core/types/index'
import type { TrainerInfo } from '../../core/types/trainer'
import { TrainerIdentitySection } from './TrainerIdentitySection'
import { TrainerTimelineSection } from './TrainerTimelineSection'

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
