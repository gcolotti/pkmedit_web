import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokedexActionKey,
  PokedexStatusResponse,
} from '../../../../core/types/index/index'
import { PokedexDexSection } from '../PokedexDexSection/PokedexDexSection'
import { buildGlobalDex } from '../pokedexPanelUtils/pokedexPanelUtils'

export function PokedexPanel({
  t,
  onAction,
  queuedActions,
  status,
}: {
  t: Translator
  onAction: (key: PokedexActionKey) => void
  queuedActions: PokedexActionKey[]
  status: PokedexStatusResponse | null
}) {
  if (!status)
    return (
      <p className="text-base-content/60 mt-4 text-sm">{t('pokedexLoading')}</p>
    )

  if (status.dexes.length === 0)
    return (
      <p className="text-base-content/60 mt-4 text-sm">
        {t('pokedexUnavailable')}
      </p>
    )

  const globalDex = buildGlobalDex(status)
  const sections = globalDex ? [globalDex, ...status.dexes] : status.dexes

  return (
    <div className="mt-4 grid gap-3">
      {sections.map((dex) => (
        <PokedexDexSection
          key={dex.id}
          dex={dex}
          onAction={onAction}
          queuedActions={queuedActions}
          t={t}
        />
      ))}
    </div>
  )
}
