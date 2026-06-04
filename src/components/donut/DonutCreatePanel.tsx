import { useMemo, useState } from 'react'

import type { DonutPreview } from '../../core/types/donut'
import { donutDisplayName } from '../../core/types/donut'
import {
  computeVisibleFlavors,
  toggleFlavor,
  updateBerry,
} from '../../core/utils/donutCreateLogic'
import { DonutBerrySelectorList } from './DonutBerrySelectorList'
import type { DonutCreatePanelProps } from './DonutCreatePanelTypes'
import { DonutPreviewSummary } from './DonutPreviewSummary'

export function DonutCreatePanel({
  berryCatalog,
  flavorCatalog,
  itemCatalog,
  onAdd,
  onCancel,
  onPreview,
  t,
}: DonutCreatePanelProps) {
  const [berries, setBerries] = useState<number[]>(
    Array.from({ length: 8 }, () => 0),
  )
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const [preview, setPreview] = useState<DonutPreview | null>(null)
  const [berryDescending, setBerryDescending] = useState(true)
  const primaryBerry = berries.find((berry) => berry > 0) ?? 0
  const visibleFlavors = useMemo(
    () => computeVisibleFlavors(filter, preview, flavorCatalog),
    [filter, preview, flavorCatalog],
  )

  async function runPreview() {
    const next = await onPreview(berries, primaryBerry)
    setSelectedFlavors([])
    setPreview(next)
  }

  function handleBerryChange(index: number, value: number) {
    setBerries((prev) => updateBerry(prev, index, value))
    setSelectedFlavors([])
    setPreview(null)
  }

  function handleToggleFlavor(hash: string) {
    setSelectedFlavors((current) => toggleFlavor(current, hash, flavorCatalog))
  }

  function addDraft() {
    if (!preview || primaryBerry === 0) return
    const berryName =
      itemCatalog.find((i) => i.id === primaryBerry)?.name ?? `#${primaryBerry}`
    const label = `${donutDisplayName(t, berryName, preview.donutType)} (${t('donutStars', { stars: preview.stars })})`
    onAdd({
      id: crypto.randomUUID(),
      berries,
      berryName: primaryBerry,
      flavor0: selectedFlavors[0] ?? '0',
      flavor1: selectedFlavors[1] ?? '0',
      flavor2: selectedFlavors[2] ?? '0',
      label,
    })
  }

  return (
    <div className="grid gap-4 rounded-md border border-stone-200 p-3 dark:border-stone-800">
      <DonutBerrySelectorList
        berries={berries}
        berryCatalog={berryCatalog}
        berryDescending={berryDescending}
        itemCatalog={itemCatalog}
        t={t}
        onBerryChange={handleBerryChange}
        onOrderChange={() => setBerryDescending((v) => !v)}
      />
      <button
        className="btn w-full"
        disabled={primaryBerry === 0}
        type="button"
        onClick={() => void runPreview()}
      >
        {t('donutPreview')}
      </button>
      {preview && <DonutPreviewSummary preview={preview} t={t} />}
      {preview && (
        <div className="grid gap-2">
          <label className="grid gap-1.5">
            <span className="label text-[0.65rem]">{t('donutFlavors')}</span>
            <input
              className="field"
              placeholder={t('donutFlavorSearch')}
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </label>
          <div className="grid max-h-56 gap-1 overflow-auto pr-1">
            {visibleFlavors.map((flavor) => (
              <label
                key={flavor.hash}
                className="flex items-center gap-2 rounded border border-stone-200 px-2 py-1.5 text-sm dark:border-stone-800"
              >
                <input
                  checked={selectedFlavors.includes(flavor.hash)}
                  disabled={
                    !selectedFlavors.includes(flavor.hash) &&
                    selectedFlavors.length >= 3
                  }
                  type="checkbox"
                  onChange={() => handleToggleFlavor(flavor.hash)}
                />
                {flavor.label}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button className="btn" type="button" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button
          className="btn btn-primary"
          disabled={!preview || primaryBerry === 0}
          type="button"
          onClick={addDraft}
        >
          {t('donutAddToDraft')}
        </button>
      </div>
    </div>
  )
}
