import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { useMemo } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { DonutBerryEntry } from '../../core/types/donut'
import type { CatalogEntry } from '../../core/types/index'
import { DONUT_FLAVOR_DISPLAY } from './DonutFlavorBadges'

type Props = {
  berries: number[]
  berryCatalog: DonutBerryEntry[]
  berryDescending: boolean
  itemCatalog: CatalogEntry[]
  t: Translator
  onBerryChange: (index: number, value: number) => void
  onOrderChange: () => void
}

export function DonutBerrySelectorList({
  berries,
  berryCatalog,
  berryDescending,
  itemCatalog,
  onBerryChange,
  onOrderChange,
  t,
}: Props) {
  const berryOptions = useMemo(
    () =>
      berryCatalog
        .map((berry) => ({
          id: berry.itemId,
          name: itemName(itemCatalog, berry.itemId),
        }))
        .sort((a, b) => (berryDescending ? b.id - a.id : a.id - b.id)),
    [berryCatalog, berryDescending, itemCatalog],
  )
  const orderLabel = berryDescending
    ? t('donutBerryOrderDesc')
    : t('donutBerryOrderAsc')

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-1">
        <div className="mr-4 flex flex-[2] items-center gap-2">
          <button
            aria-label={orderLabel}
            className="btn min-h-6 px-2"
            title={orderLabel}
            type="button"
            onClick={onOrderChange}
          >
            {berryDescending ? (
              <ArrowDownAZ size={16} />
            ) : (
              <ArrowUpAZ size={16} />
            )}
          </button>
          <span className="label text-[0.65rem]">{t('donutBerries')}</span>
        </div>
        <div className="flex flex-[3] gap-1 text-center">
          <span className="flex-1 text-[0.65rem]">{t('donutFlavorSpicy')}</span>
          <span className="flex-1 text-[0.65rem]">{t('donutFlavorFresh')}</span>
          <span className="flex-1 text-[0.65rem]">{t('donutFlavorSweet')}</span>
          <span className="flex-1 text-[0.65rem]">
            {t('donutFlavorBitter')}
          </span>
          <span className="flex-1 text-[0.65rem]">{t('donutFlavorSour')}</span>
        </div>
      </div>
      {berries.map((berry, index) => {
        const profile = berry > 0 ? berryProfile(berryCatalog, berry) : null
        return (
          <div key={index} className="flex items-center gap-1">
            <select
              className="field min-w-0 flex-[2] text-sm"
              value={berry}
              onChange={(event) =>
                onBerryChange(index, Number(event.currentTarget.value))
              }
            >
              <option value={0}>{t('donutNoBerry')}</option>
              {berryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="flex flex-[3] gap-1">
              {DONUT_FLAVOR_DISPLAY.map((flavor) => (
                <span
                  key={flavor.key}
                  className={`flex-1 rounded border px-1 text-center text-[0.65rem] font-bold ${profile ? flavor.className : flavor.dimClassName}`}
                >
                  {profile ? profile[flavor.key] : 0}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function itemName(items: CatalogEntry[], itemId: number) {
  return items.find((item) => item.id === itemId)?.name ?? `#${itemId}`
}

function berryProfile(berries: DonutBerryEntry[], itemId: number) {
  const berry = berries.find((entry) => entry.itemId === itemId)
  return {
    bitter: berry?.bitter ?? 0,
    fresh: berry?.fresh ?? 0,
    sour: berry?.sour ?? 0,
    spicy: berry?.spicy ?? 0,
    sweet: berry?.sweet ?? 0,
  }
}
