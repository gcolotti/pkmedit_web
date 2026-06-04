import { SlotGrid } from '../common/SlotGrid'
import { SegmentedToggle } from '../ui/SegmentedToggle'
import { WorkspaceBoxPanel } from './WorkspaceBoxPanel'
import { WorkspaceDatabasePanel } from './WorkspaceDatabasePanel'
import type { WorkspacePanelProps } from './WorkspacePanelTypes'
import { WorkspaceSavePanel } from './WorkspaceSavePanel'

export function WorkspacePanel({
  boxIndex,
  boxes,
  currentBox,
  databaseBrowser,
  databasePreview,
  databaseView,
  donutCreatorPocket,
  heldItemsSupported,
  itemCatalog,
  onBoxChange,
  onAddDonut,
  onApplyEncounter,
  onApplyMysteryGift,
  onEncounterPreview,
  onClearPreview,
  onCloseDonutCreator,
  onMysteryGiftPreview,
  onPreviewDonut,
  onSelectSlot,
  onViewChange,
  party,
  selectedSlotId,
  t,
  view,
}: WorkspacePanelProps) {
  return (
    <section className="glass-panel min-h-workspace rounded-lg p-4 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SegmentedToggle
          label={t('viewSwitcher')}
          options={[
            { value: 'party', label: t('party') },
            { value: 'boxes', label: t('boxes') },
            { value: 'save', label: t('save') },
            { value: 'database', label: t('database') },
          ]}
          value={view}
          onChange={onViewChange}
        />
      </div>

      <div className={view === 'party' ? undefined : 'hidden'}>
        <div className="mx-auto mt-5 max-w-sm">
          <SlotGrid
            heldItemsSupported={heldItemsSupported}
            itemCatalog={itemCatalog}
            slots={party}
            selectedSlotId={selectedSlotId}
            t={t}
            onSelect={onSelectSlot}
          />
        </div>
      </div>

      <div className={view === 'boxes' ? undefined : 'hidden'}>
        <WorkspaceBoxPanel
          boxIndex={boxIndex}
          boxes={boxes}
          currentBox={currentBox}
          heldItemsSupported={heldItemsSupported}
          itemCatalog={itemCatalog}
          selectedSlotId={selectedSlotId}
          t={t}
          onBoxChange={onBoxChange}
          onSelectSlot={onSelectSlot}
        />
      </div>

      <div className={view === 'save' ? undefined : 'hidden'}>
        <WorkspaceSavePanel
          donutCreatorPocket={donutCreatorPocket}
          itemCatalog={itemCatalog}
          t={t}
          onAddDonut={onAddDonut}
          onCloseDonutCreator={onCloseDonutCreator}
          onPreviewDonut={onPreviewDonut}
        />
      </div>

      <div className={view === 'database' ? undefined : 'hidden'}>
        <WorkspaceDatabasePanel
          boxes={boxes}
          databaseBrowser={databaseBrowser}
          databasePreview={databasePreview}
          databaseView={databaseView}
          party={party}
          t={t}
          onApplyEncounter={onApplyEncounter}
          onApplyMysteryGift={onApplyMysteryGift}
          onClearPreview={onClearPreview}
          onEncounterPreview={onEncounterPreview}
          onMysteryGiftPreview={onMysteryGiftPreview}
        />
      </div>
    </section>
  )
}
