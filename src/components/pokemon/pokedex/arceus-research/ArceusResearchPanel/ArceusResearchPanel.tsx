import type { Translator } from '../../../../../core/i18n/i18n/i18n'
import type {
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
} from '../../../../../core/types/index/index'
import { ARCEUS_BULK_LABEL } from '../arceusResearchPanelUtils/arceusResearchPanelUtils'

const BULK_ACTIONS: ArceusResearchBulkAction[] = [
  'markAllPerfect',
  'markAllComplete',
]

export function ArceusResearchPanel({
  bulkDrafts,
  onSelectDex,
  onToggleBulk,
  selectedDex,
  status,
  t,
}: {
  bulkDrafts: ArceusResearchBulkAction[]
  onSelectDex: (dexId: string | null) => void
  onToggleBulk: (action: ArceusResearchBulkAction) => void
  selectedDex: string | null
  status: ArceusResearchStatusResponse | null
  t: Translator
}) {
  if (!status) {
    return (
      <p className="text-base-content/60 mt-4 p-3 text-sm">
        {t('pokedexLoading')}
      </p>
    )
  }

  if (status.species.length === 0) {
    return (
      <p className="text-base-content/60 mt-4 p-3 text-sm">
        {t('arceusResearchEmpty')}
      </p>
    )
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 p-3">
      <div className="grid gap-2">
        {BULK_ACTIONS.map((action) => {
          const queued = bulkDrafts.includes(action)
          return (
            <button
              key={action}
              className={`btn btn-sm w-full justify-start ${queued ? 'btn-primary' : ''}`}
              type="button"
              onClick={() => onToggleBulk(action)}
            >
              {t(ARCEUS_BULK_LABEL[action])}
            </button>
          )
        })}
      </div>

      <div className="grid auto-rows-min gap-2 overflow-y-auto pr-1">
        {status.dexes.map((dex) => {
          const selected = selectedDex === dex.id
          return (
            <button
              key={dex.id}
              className={`flex w-full items-center justify-between gap-3 rounded border px-3 py-2 text-left transition ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-base-300 hover:bg-base-200/40'
              }`}
              type="button"
              onClick={() => onSelectDex(selected ? null : dex.id)}
            >
              <span className="text-base-content truncate text-sm font-medium">
                {dex.label}
              </span>
              <span className="text-base-content/70 whitespace-nowrap font-mono text-xs">
                {dex.perfect}★ · {dex.completed}✓ · {dex.totalSpecies}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
