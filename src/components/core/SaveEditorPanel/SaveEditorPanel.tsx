import type { SaveView } from '../../../core/types/index/index'
import { ItemBagEditor } from '../../items/ItemBagEditor/ItemBagEditor'
import { UndergroundItemsPanel } from '../../items/underground/UndergroundItemsPanel/UndergroundItemsPanel'
import { MetDateFixerPanel } from '../../pokemon/met-date/MetDateFixerPanel/MetDateFixerPanel'
import { PokedexPanel } from '../../pokemon/pokedex/PokedexPanel/PokedexPanel'
import { TrainerInfoEditor } from '../../trainer/TrainerInfoEditor/TrainerInfoEditor'
import { SubPanelTabs } from '../../ui/SubPanelTabs/SubPanelTabs'
import type { SaveEditorPanelProps } from '../SaveEditorPanelTypes/SaveEditorPanelTypes'

export function SaveEditorPanel({
  arceusResearchStatus,
  itemBag,
  itemCatalog,
  itemStatus,
  languageCatalog,
  donutDrafts,
  sessionId,
  onAddDonut,
  onItemsChange,
  onLoadDonuts,
  onOpenArceusResearch,
  onOpenDonutCreator,
  onOpenRaidsEditor,
  onPokedexAction,
  onPreviewMetDateFixer,
  onQueueMetDateFixerDraft,
  pokedexDrafts,
  pokedexStatus,
  metDateFixerDraft,
  onSaveViewChange,
  underground,
  onTrainerChange,
  saveView,
  t,
  trainer,
  trainerStatus,
}: SaveEditorPanelProps) {
  const supportsUnderground = trainer?.saveKind === 'bdsp'
  const supportsRaids =
    trainer?.saveKind === 'swsh' || trainer?.saveKind === 'sv'
  const tabs: Array<{ value: SaveView; label: string }> = [
    { value: 'trainer', label: t('trainer') },
    { value: 'items', label: t('items') },
    { value: 'pokedex', label: t('pokedex') },
    { value: 'metDateFixer', label: t('metDateFixer') },
    ...(supportsUnderground
      ? [{ value: 'underground' as SaveView, label: t('underground') }]
      : []),
    ...(supportsRaids
      ? [{ value: 'raids' as SaveView, label: t('raids') }]
      : []),
  ]
  const activeView = tabs.some((tab) => tab.value === saveView)
    ? saveView
    : 'trainer'
  const visibleActiveView = activeView === 'raids' ? 'trainer' : activeView

  function handleSaveViewChange(view: SaveView) {
    if (view === 'raids') {
      onOpenRaidsEditor()
      return
    }
    onSaveViewChange(view)
  }

  return (
    <>
      <SubPanelTabs
        active={visibleActiveView}
        label={t('saveTabs')}
        options={tabs}
        onChange={handleSaveViewChange}
      />
      {visibleActiveView === 'items' && (
        <ItemBagEditor
          current={itemBag}
          itemCatalog={itemCatalog}
          status={itemStatus}
          t={t}
          onChange={onItemsChange}
        />
      )}
      {visibleActiveView === 'trainer' && (
        <TrainerInfoEditor
          catalogs={{ languages: languageCatalog }}
          current={trainer}
          donutDrafts={donutDrafts}
          itemCatalog={itemCatalog}
          sessionId={sessionId}
          status={trainerStatus}
          t={t}
          onChange={onTrainerChange}
          onAddDonut={onAddDonut}
          onLoadDonuts={onLoadDonuts}
          onOpenDonutCreator={onOpenDonutCreator}
        />
      )}
      {visibleActiveView === 'pokedex' && (
        <>
          {arceusResearchStatus && (
            <button
              className="btn btn-primary mt-4 w-full justify-between"
              type="button"
              onClick={onOpenArceusResearch}
            >
              <span>{t('arceusResearchLauncher')}</span>
              <span className="text-xs opacity-75">
                ★{arceusResearchStatus.currentRank}/
                {arceusResearchStatus.maxRank}
              </span>
            </button>
          )}
          <PokedexPanel
            t={t}
            onAction={onPokedexAction}
            queuedActions={pokedexDrafts}
            status={pokedexStatus}
          />
        </>
      )}
      {visibleActiveView === 'metDateFixer' && (
        <MetDateFixerPanel
          queuedDraft={metDateFixerDraft}
          sessionId={sessionId}
          t={t}
          onPreview={onPreviewMetDateFixer}
          onQueue={onQueueMetDateFixerDraft}
        />
      )}
      {visibleActiveView === 'underground' && (
        <UndergroundItemsPanel
          sessionId={sessionId}
          t={t}
          data={underground.data}
          status={underground.status}
          onLoad={underground.onLoad}
          onChange={underground.onChange}
        />
      )}
    </>
  )
}
