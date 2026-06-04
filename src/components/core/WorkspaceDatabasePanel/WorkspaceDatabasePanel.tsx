import type { DatabaseBrowserState } from '../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  EncounterDatabasePreview,
  EncounterDatabaseSearchRequest,
  MysteryGiftDatabasePreview,
} from '../../../core/types/database/database'
import type { BoxSummary, DatabaseView } from '../../../core/types/index/index'
import type { PokemonSummary } from '../../../core/types/pokemon/pokemon'
import { DatabasePreviewPanel } from '../../database/DatabasePreviewPanel/DatabasePreviewPanel'
import { EncounterDatabaseResults } from '../../database/encounters/EncounterDatabaseResults/EncounterDatabaseResults'
import { MysteryGiftDatabaseResults } from '../../database/mystery-gift/MysteryGiftDatabaseResults/MysteryGiftDatabaseResults'

export function WorkspaceDatabasePanel({
  boxes,
  databaseBrowser,
  databasePreview,
  databaseView,
  onApplyEncounter,
  onApplyMysteryGift,
  onClearPreview,
  onEncounterPreview,
  onMysteryGiftPreview,
  party,
  t,
}: {
  boxes: BoxSummary[]
  databaseBrowser: DatabaseBrowserState
  databasePreview: EncounterDatabasePreview | MysteryGiftDatabasePreview | null
  databaseView: DatabaseView
  onApplyEncounter: (
    preview: EncounterDatabasePreview,
    slotId: string,
  ) => Promise<void>
  onApplyMysteryGift: (
    preview: MysteryGiftDatabasePreview,
    slotId?: string,
  ) => Promise<void>
  onClearPreview: () => void
  onEncounterPreview: (
    search: EncounterDatabaseSearchRequest,
    resultId: string,
  ) => void
  onMysteryGiftPreview: (resultId: string) => void
  party: PokemonSummary[]
  t: Translator
}) {
  const selectedDatabaseId = databasePreview?.entry.id ?? null

  return (
    <>
      {databasePreview ? (
        <DatabasePreviewPanel
          boxes={boxes}
          party={party}
          preview={databasePreview}
          t={t}
          onApplyEncounter={onApplyEncounter}
          onApplyMysteryGift={onApplyMysteryGift}
          onClearPreview={onClearPreview}
        />
      ) : null}
      {databaseView === 'encounters' ? (
        <EncounterDatabaseResults
          filters={databaseBrowser.encounters.resultSearch}
          loading={databaseBrowser.encounters.loading}
          page={databaseBrowser.encounters.page}
          pageCount={databaseBrowser.encounters.pageCount}
          results={databaseBrowser.encounters.results}
          selectedId={selectedDatabaseId}
          t={t}
          total={databaseBrowser.encounters.total}
          onPageChange={databaseBrowser.encounters.goToPage}
          onPreview={onEncounterPreview}
        />
      ) : (
        <MysteryGiftDatabaseResults
          loading={databaseBrowser.mysteryGifts.loading}
          page={databaseBrowser.mysteryGifts.page}
          pageCount={databaseBrowser.mysteryGifts.pageCount}
          results={databaseBrowser.mysteryGifts.results}
          selectedId={selectedDatabaseId}
          t={t}
          total={databaseBrowser.mysteryGifts.total}
          onPageChange={databaseBrowser.mysteryGifts.goToPage}
          onPreview={onMysteryGiftPreview}
        />
      )}
    </>
  )
}
