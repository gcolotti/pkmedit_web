import { useState } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { DonutDraft, DonutPocket } from '../../core/types/donut'
import type { CatalogEntry, SaveSectionStatus } from '../../core/types/index'
import type { TrainerInfo } from '../../core/types/trainer'
import { SubPanelTabs } from '../ui/SubPanelTabs'
import { hasTrainerDlcContent, TrainerDlcSection } from './TrainerDlcSection'
import { TrainerImagesSection } from './TrainerImagesSection'
import { TrainerMapPositionSection } from './TrainerMapPositionSection'
import { TrainerOverviewSection } from './TrainerOverviewSection'
import { TrainerProgressSection } from './TrainerProgressSection'

type TrainerTab = 'overview' | 'progress' | 'location' | 'images' | 'dlc'

export function TrainerInfoEditor({
  catalogs,
  current,
  donutDrafts,
  itemCatalog,
  sessionId,
  onChange,
  onAddDonut,
  onLoadDonuts,
  onOpenDonutCreator,
  status,
  t,
}: {
  catalogs: { languages: CatalogEntry[] }
  current: TrainerInfo | null
  donutDrafts: DonutDraft[]
  itemCatalog: CatalogEntry[]
  sessionId: string | null
  onChange: (trainer: TrainerInfo) => void
  onAddDonut: (draft: DonutDraft) => void
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>
  onOpenDonutCreator: (pocket: DonutPocket) => void
  status: SaveSectionStatus
  t: Translator
}) {
  const [activeTab, setActiveTab] = useState<TrainerTab>('overview')

  if (!current) {
    return (
      <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
        {emptyMessage(status, t)}
      </div>
    )
  }

  function set<K extends keyof TrainerInfo>(key: K, value: TrainerInfo[K]) {
    onChange({ ...current!, [key]: value })
  }

  const hasProgress =
    current.gameFields.length > 0 ||
    current.gameActions.length > 0 ||
    current.royale !== null
  const tabs: Array<{ value: TrainerTab; label: string }> = [
    { value: 'overview', label: t('overview') },
    ...(hasProgress
      ? [{ value: 'progress' as TrainerTab, label: t('progress') }]
      : []),
    ...(current.map
      ? [{ value: 'location' as TrainerTab, label: t('location') }]
      : []),
    ...(current.images.length > 0
      ? [{ value: 'images' as TrainerTab, label: t('images') }]
      : []),
    ...(hasTrainerDlcContent(current)
      ? [{ value: 'dlc' as TrainerTab, label: t('trainerDlc') }]
      : []),
  ]
  const activeView = tabs.some((tab) => tab.value === activeTab)
    ? activeTab
    : 'overview'

  return (
    <div className="mt-4 grid gap-5">
      <SubPanelTabs
        active={activeView}
        label={t('trainerData')}
        options={tabs}
        onChange={setActiveTab}
      />
      {activeView === 'overview' && (
        <TrainerOverviewSection
          catalogs={catalogs}
          trainer={current}
          t={t}
          onChange={set}
        />
      )}
      {activeView === 'progress' && (
        <TrainerProgressSection trainer={current} t={t} onChange={onChange} />
      )}
      {activeView === 'location' && current.map && (
        <TrainerMapPositionSection
          map={current.map}
          t={t}
          onChange={(map) => onChange({ ...current, map })}
        />
      )}
      {activeView === 'images' && (
        <TrainerImagesSection images={current.images} t={t} />
      )}
      {activeView === 'dlc' && (
        <TrainerDlcSection
          donutDrafts={donutDrafts}
          itemCatalog={itemCatalog}
          sessionId={sessionId}
          trainer={current}
          t={t}
          onChange={onChange}
          onAddDonut={onAddDonut}
          onLoadDonuts={onLoadDonuts}
          onOpenDonutCreator={onOpenDonutCreator}
        />
      )}
    </div>
  )
}

function emptyMessage(status: SaveSectionStatus, t: Translator) {
  if (status === 'loading') return t('saveSectionLoading')
  if (status === 'unavailable') return t('trainerNotAvailable')
  return t('noSaveLoaded')
}
