import type { DatabaseBrowserState } from '../../core/hooks/useDatabaseBrowser'
import type { Translator } from '../../core/i18n/i18n'
import type {
  EncounterDatabasePreview,
  EncounterDatabaseSearchRequest,
  MysteryGiftDatabasePreview,
} from '../../core/types/database'
import type {
  DonutDraft,
  DonutPocket,
  DonutPreview,
} from '../../core/types/donut'
import type {
  BoxSummary,
  CatalogEntry,
  DatabaseView,
  View,
} from '../../core/types/index'
import type { PokemonSummary } from '../../core/types/pokemon'

export type WorkspacePanelProps = {
  boxIndex: number
  boxes: BoxSummary[]
  currentBox: BoxSummary | undefined
  databaseBrowser: DatabaseBrowserState
  databasePreview: EncounterDatabasePreview | MysteryGiftDatabasePreview | null
  databaseView: DatabaseView
  donutCreatorPocket: DonutPocket | null
  heldItemsSupported: boolean
  itemCatalog: CatalogEntry[]
  onBoxChange: (index: number) => void
  onAddDonut: (draft: DonutDraft) => void
  onApplyEncounter: (
    preview: EncounterDatabasePreview,
    slotId: string,
  ) => Promise<void>
  onApplyMysteryGift: (
    preview: MysteryGiftDatabasePreview,
    slotId?: string,
  ) => Promise<void>
  onEncounterPreview: (
    search: EncounterDatabaseSearchRequest,
    resultId: string,
  ) => void
  onClearPreview: () => void
  onCloseDonutCreator: () => void
  onMysteryGiftPreview: (resultId: string) => void
  onPreviewDonut: (
    berries: number[],
    berryName: number,
  ) => Promise<DonutPreview | null>
  onSelectSlot: (slotId: string) => void
  onViewChange: (view: View) => void
  party: PokemonSummary[]
  selectedSlotId: string | null
  t: Translator
  view: View
}
