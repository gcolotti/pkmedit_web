import type { Translator } from '../../../../../core/i18n/i18n/i18n'
import { sameArceusResearchAction } from '../../../../../core/services/arceusResearchActionUtils/arceusResearchActionUtils'
import type {
  ArceusResearchActionKey,
  ArceusResearchSpeciesEntry,
} from '../../../../../core/types/index/index'

export function ArceusResearchSpeciesActions({
  onApplyAction,
  queued,
  species,
  t,
}: {
  onApplyAction: (key: ArceusResearchActionKey) => void
  queued: ArceusResearchActionKey[]
  species: ArceusResearchSpeciesEntry
  t: Translator
}) {
  const completeKey: ArceusResearchActionKey = {
    species: species.species,
    action: 'completeSpecies',
  }
  const perfectKey: ArceusResearchActionKey = {
    species: species.species,
    action: 'perfectSpecies',
  }
  const completeQueued = queued.some((item) =>
    sameArceusResearchAction(item, completeKey),
  )
  const perfectQueued = queued.some((item) =>
    sameArceusResearchAction(item, perfectKey),
  )

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`btn btn-xs ${completeQueued ? 'btn-primary' : ''} ${species.complete ? 'btn-disabled' : ''}`}
        disabled={species.complete || completeQueued}
        type="button"
        onClick={() => onApplyAction(completeKey)}
      >
        {t('arceusResearchActionCompleteSpecies')}
      </button>
      <button
        className={`btn btn-xs ${perfectQueued ? 'btn-primary' : ''} ${species.perfect ? 'btn-disabled' : ''}`}
        disabled={species.perfect || perfectQueued}
        type="button"
        onClick={() => onApplyAction(perfectKey)}
      >
        {t('arceusResearchActionPerfectSpecies')}
      </button>
    </div>
  )
}
