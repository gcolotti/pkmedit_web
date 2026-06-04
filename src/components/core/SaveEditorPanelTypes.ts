import type { Translator } from '../../core/i18n/i18n'
import type { DonutDraft, DonutPocket } from '../../core/types/donut'
import type {
  ArceusResearchStatusResponse,
  CatalogBundle,
  ItemBag,
  PokedexActionKey,
  PokedexStatusResponse,
  SaveSectionStatus,
  SaveView,
} from '../../core/types/index'
import type {
  MetDateFixerPreview,
  MetDateFixerRequest,
} from '../../core/types/metDateFixer'
import type { UndergroundItemsResponse } from '../../core/types/saveFeature'
import type { TrainerInfo } from '../../core/types/trainer'

export type SaveEditorPanelProps = {
  itemBag: ItemBag | null
  itemCatalog: CatalogBundle['items']
  itemStatus: SaveSectionStatus
  languageCatalog: CatalogBundle['languages']
  donutDrafts: DonutDraft[]
  sessionId: string | null
  onItemsChange: (bag: ItemBag) => void
  onAddDonut: (draft: DonutDraft) => void
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>
  onOpenDonutCreator: (pocket: DonutPocket) => void
  onOpenRaidsEditor: () => void
  onPokedexAction: (key: PokedexActionKey) => void
  onPreviewMetDateFixer: (
    request: MetDateFixerRequest,
  ) => Promise<MetDateFixerPreview | null>
  onQueueMetDateFixerDraft: (request: MetDateFixerRequest) => void
  pokedexDrafts: PokedexActionKey[]
  pokedexStatus: PokedexStatusResponse | null
  arceusResearchStatus: ArceusResearchStatusResponse | null
  onOpenArceusResearch: () => void
  metDateFixerDraft: MetDateFixerRequest | null
  onSaveViewChange: (view: SaveView) => void
  underground: {
    data: UndergroundItemsResponse | null
    status: string
    onChange: (data: UndergroundItemsResponse) => void
    onLoad: (sessionId: string) => void
  }
  onTrainerChange: (trainer: TrainerInfo) => void
  saveView: SaveView
  t: Translator
  trainer: TrainerInfo | null
  trainerStatus: SaveSectionStatus
}
