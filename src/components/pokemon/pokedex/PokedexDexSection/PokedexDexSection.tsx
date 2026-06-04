import type { Translator } from '../../../../core/i18n/i18n/i18n'
import { POKEDEX_GLOBAL_DEX_ID } from '../../../../core/services/pokedexActionUtils/pokedexActionUtils'
import type {
  PokedexActionKey,
  PokedexDexStatus,
} from '../../../../core/types/index/index'
import { PokedexActionButton } from '../PokedexActionButton/PokedexActionButton'

export function PokedexDexSection({
  dex,
  onAction,
  queuedActions,
  t,
}: {
  dex: PokedexDexStatus
  onAction: (key: PokedexActionKey) => void
  queuedActions: PokedexActionKey[]
  t: Translator
}) {
  return (
    <section className="border-base-300 rounded-md border p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base-content text-sm font-semibold">
          {dex.id === POKEDEX_GLOBAL_DEX_ID ? t('pokedexAllDexes') : dex.label}
        </h3>
        <span className="text-base-content/60 text-xs">{dex.totalSpecies}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {dex.supportedActions.map((action) => (
          <PokedexActionButton
            key={`${dex.id}:${action}`}
            action={action}
            dex={dex}
            onAction={onAction}
            queuedActions={queuedActions}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}
