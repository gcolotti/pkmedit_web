import { CircleAlert, Sparkles } from 'lucide-react'
import { memo } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { CatalogEntry } from '../../core/types/index'
import type { PokemonSummary } from '../../core/types/pokemon'
import { getHeldItemImageUrl } from '../../core/utils/wikiDexAssets'
import { AlphaIcon } from '../ui/AlphaIcon'
import { PokemonSprite } from '../ui/PokemonSprite'

const denseSlotGridRows = 5
const minimumDenseSlotGridColumns = 5
const defaultDenseSlotGridColumns = 6

export function getDenseSlotGridColumnCount(slotCount: number) {
  if (slotCount <= 0) return defaultDenseSlotGridColumns
  return Math.min(
    slotCount,
    Math.max(
      minimumDenseSlotGridColumns,
      Math.ceil(slotCount / denseSlotGridRows),
    ),
  )
}

export const SlotGrid = memo(function SlotGrid({
  dense = false,
  heldItemsSupported = true,
  itemCatalog,
  onSelect,
  selectedSlotId,
  showHeldItems = false,
  slots,
  t,
}: {
  dense?: boolean
  heldItemsSupported?: boolean
  itemCatalog: CatalogEntry[]
  onSelect: (slotId: string) => void
  selectedSlotId: string | null
  showHeldItems?: boolean
  slots: PokemonSummary[]
  t: Translator
}) {
  const denseColumnCount = getDenseSlotGridColumnCount(slots.length)
  const grid = dense ? '' : 'grid-cols-2 sm:grid-cols-3'
  const gridStyle = dense
    ? { gridTemplateColumns: `repeat(${denseColumnCount}, minmax(0, 1fr))` }
    : undefined

  return (
    <div className={`grid gap-1.5 ${grid}`} style={gridStyle}>
      {slots.map((slot) => {
        const selected = selectedSlotId === slot.slotId
        const occupied = slot.present && slot.species > 0
        const hasItem =
          heldItemsSupported && occupied && slot.hasItem && slot.heldItem > 0
        const showItemIcon = hasItem && (showHeldItems || !dense)
        const dim = heldItemsSupported && showHeldItems && hasItem
        const heldItemName = getCatalogName(itemCatalog, slot.heldItem)
        const heldItemLabel = heldItemName
          ? `${t('heldItem')}: ${heldItemName}`
          : undefined

        return (
          <button
            key={slot.slotId}
            aria-label={slot.present ? slot.speciesName : t('empty')}
            className={`relative grid aspect-square place-items-center rounded border transition hover:border-lagoon ${
              selected
                ? 'border-lagoon bg-lagoon/15 ring-2 ring-lagoon/30'
                : 'surface-muted'
            }`}
            type="button"
            onClick={() => onSelect(slot.slotId)}
          >
            <span className={dim ? 'opacity-40' : undefined}>
              <PokemonSprite compact slot={slot} t={t} />
            </span>
            {occupied && !slot.legal && (
              <CircleAlert
                className="absolute bottom-1 left-1 text-rose-500"
                size={15}
              />
            )}
            {occupied && slot.shiny && (
              <Sparkles
                className="absolute left-1 top-1 text-rose-500"
                size={14}
              />
            )}
            {occupied && slot.alpha && (
              <AlphaIcon
                className="absolute right-1 top-1 text-rose-500"
                size={15}
              />
            )}
            {showItemIcon && (
              <span
                aria-label={heldItemLabel}
                className="group/item absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center"
              >
                {getHeldItemImageUrl(slot.heldItem) && (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain"
                    decoding="async"
                    loading="lazy"
                    src={getHeldItemImageUrl(slot.heldItem)}
                  />
                )}
                {heldItemLabel && (
                  <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-1 whitespace-nowrap rounded bg-zinc-950 px-2 py-1 text-[0.65rem] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-75 group-hover/item:opacity-100">
                    {heldItemLabel}
                  </span>
                )}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})

function getCatalogName(catalog: CatalogEntry[], id: number) {
  return catalog.find((entry) => entry.id === id)?.name
}
