import { useEffect, useState } from 'react'

import type { Translator } from '../../i18n/i18n/i18n'
import type { DonutDraft, DonutEntry, DonutPocket } from '../../types/donut/donut'
import { donutDisplayName } from '../../types/donut/donut'
import type { CatalogEntry } from '../../types/index/index'

export function useDonutPocket(
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>,
  sessionId: string | null,
) {
  const [pocket, setPocket] = useState<DonutPocket | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    load(sessionId, setLoading, setError, setPocket, onLoadDonuts, cancelled)
    return () => {
      cancelled = true
    }
  }, [onLoadDonuts, sessionId])

  return { pocket, loading, error }
}

function load(
  sessionId: string,
  setLoading: (v: boolean) => void,
  setError: (v: string) => void,
  setPocket: (v: DonutPocket | null) => void,
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>,
  cancelled: boolean,
) {
  setLoading(true)
  setError('')
  void (async () => {
    try {
      const next = await onLoadDonuts(sessionId)
      if (!cancelled) setPocket(next)
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (!cancelled) setLoading(false)
    }
  })()
}

export function duplicateExistingDonut(
  donut: DonutEntry,
  times: number,
  itemCatalog: CatalogEntry[],
  t: Translator,
  onAddDonut: (draft: DonutDraft) => void,
) {
  const berryName = nameForItem(itemCatalog, donut.berryName)
  const label: string = donutDisplayName(t, berryName, donut.donutType)
  for (let i = 0; i < times; i++) {
    onAddDonut({
      id: crypto.randomUUID(),
      berries: [...donut.berries],
      berryName: donut.berryName,
      flavor0: donut.flavor0,
      flavor1: donut.flavor1,
      flavor2: donut.flavor2,
      label,
    })
  }
}

export function duplicateDraft(
  draft: DonutDraft,
  times: number,
  onAddDonut: (draft: DonutDraft) => void,
) {
  for (let i = 0; i < times; i++) {
    onAddDonut({ ...draft, id: crypto.randomUUID() })
  }
}

export function nameForItem(items: CatalogEntry[], itemId: number) {
  return items.find((item) => item.id === itemId)?.name ?? `#${itemId}`
}
