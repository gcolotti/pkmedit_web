import { Plus } from 'lucide-react'

import {
  duplicateDraft,
  duplicateExistingDonut,
  nameForItem,
  useDonutPocket,
} from '../../core/hooks/useDonutPocket'
import type { Translator } from '../../core/i18n/i18n'
import type { DonutDraft, DonutPocket } from '../../core/types/donut'
import { donutDisplayName } from '../../core/types/donut'
import type { CatalogEntry } from '../../core/types/index'
import { DonutCard } from './DonutCard'

export function DonutPocketSection({
  donutDrafts,
  itemCatalog,
  onAddDonut,
  onLoadDonuts,
  onOpenCreator,
  sessionId,
  t,
}: {
  donutDrafts: DonutDraft[]
  itemCatalog: CatalogEntry[]
  sessionId: string | null
  t: Translator
  onAddDonut: (draft: DonutDraft) => void
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>
  onOpenCreator: (pocket: DonutPocket) => void
}) {
  const { pocket, loading, error } = useDonutPocket(onLoadDonuts, sessionId)
  const currentCount = (pocket?.donuts.length ?? 0) + donutDrafts.length

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{t('donutPocket')}</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('donutCapacity', { count: currentCount, total: 999 })}
          </p>
        </div>
        <button
          className="btn btn-primary min-h-9 gap-2"
          disabled={!pocket}
          type="button"
          onClick={() => pocket && onOpenCreator(pocket)}
        >
          <Plus size={16} />
          {t('donutCreate')}
        </button>
      </div>
      {loading && (
        <div className="py-4 text-sm text-stone-500 dark:text-stone-400">
          {t('saveSectionLoading')}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-rose-300/50 p-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </div>
      )}
      {!loading &&
        pocket &&
        pocket.donuts.length === 0 &&
        donutDrafts.length === 0 && (
          <div className="rounded-md border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            {t('donutPocketEmpty')}
          </div>
        )}
      <div className="grid gap-2">
        {pocket?.donuts.map((donut) => (
          <DonutCard
            key={donut.index}
            title={donutDisplayName(
              t,
              nameForItem(itemCatalog, donut.berryName),
              donut.donutType,
            )}
            subtitle={`${nameForItem(itemCatalog, donut.berryName)} - ${t('donutStars', { stars: donut.stars })}`}
            duplicateLabel={t('donutDuplicate')}
            onDuplicate={(times) =>
              duplicateExistingDonut(donut, times, itemCatalog, t, onAddDonut)
            }
          />
        ))}
        {donutDrafts.map((draft) => (
          <DonutCard
            key={draft.id}
            title={draft.label}
            subtitle={t('newDonut')}
            duplicateLabel={t('donutDuplicate')}
            onDuplicate={(times) => duplicateDraft(draft, times, onAddDonut)}
          />
        ))}
      </div>
    </section>
  )
}
