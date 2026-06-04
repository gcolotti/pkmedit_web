import type { Translator } from '../../../core/i18n/i18n'
import {
  hasPokedexAction,
  POKEDEX_ACTION_LABELS,
} from '../../../core/services/pokedexActionUtils'
import type {
  PokedexActionKey,
  PokedexActionName,
  PokedexDexStatus,
} from '../../../core/types/index'

export function PokedexActionButton({
  action,
  dex,
  onAction,
  queuedActions,
  t,
}: {
  action: PokedexActionName
  dex: PokedexDexStatus
  onAction: (key: PokedexActionKey) => void
  queuedActions: PokedexActionKey[]
  t: Translator
}) {
  const status = dex.actions.find((item) => item.action === action)
  const target = { dexId: dex.id, action }
  const queued = hasPokedexAction(queuedActions, target)
  const complete = status?.complete ?? false
  const total = status?.total ?? 0
  const count = complete ? total : (status?.count ?? 0)
  const percent =
    total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0

  return (
    <div className="grid gap-1">
      <button
        className={`btn btn-sm justify-between gap-3 ${queued ? 'btn-primary' : complete ? 'btn-disabled' : ''}`}
        disabled={queued || complete || !status}
        type="button"
        onClick={() => onAction(target)}
      >
        <span>{t(POKEDEX_ACTION_LABELS[action])}</span>
        <span className="text-xs opacity-75">
          {count}/{total}
        </span>
      </button>
      {status && !complete && count > 0 && (
        <div className="bg-base-300 h-1 w-full rounded-full">
          <div
            className="bg-primary h-1 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  )
}
