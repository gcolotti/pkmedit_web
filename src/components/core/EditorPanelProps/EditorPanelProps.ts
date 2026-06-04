import type { DatabaseBrowserState } from '../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { DonutDraft, DonutPocket } from '../../../core/types/donut/donut'
import type {
  ArceusResearchStatusResponse,
  CatalogBundle,
  DatabaseView,
  EditorTab,
  ItemBag,
  Language,
  LegalityReport,
  PokedexActionKey,
  PokedexStatusResponse,
  PokemonDetail,
  SaveSectionStatus,
  SaveView,
  View,
} from '../../../core/types/index/index'
import type {
  MetDateFixerPreview,
  MetDateFixerRequest,
} from '../../../core/types/metDateFixer/metDateFixer'
import type { UndergroundItemsResponse } from '../../../core/types/saveFeature/saveFeature'
import type { TrainerInfo } from '../../../core/types/trainer/trainer'

export interface EditorPanelProps {
  catalogs: CatalogBundle
  databaseBrowser: DatabaseBrowserState
  language: Language
  databaseView: DatabaseView
  draft: PokemonDetail | null
  itemBag: ItemBag | null
  itemStatus: SaveSectionStatus
  itemCatalog: CatalogBundle['items']
  languageCatalog: CatalogBundle['languages']
  onCheck: () => Promise<LegalityReport | null>
  onDatabaseViewChange: (view: DatabaseView) => void
  onAddDonut: (draft: DonutDraft) => void
  onItemsChange: (bag: ItemBag) => void
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
  donutDrafts: DonutDraft[]
  onSaveViewChange: (view: SaveView) => void
  onLoadDonuts: (sessionId: string) => Promise<DonutPocket>
  onOpenDonutCreator: (pocket: DonutPocket) => void
  onOpenRaidsEditor: () => void
  underground: {
    data: UndergroundItemsResponse | null
    status: string
    onChange: (data: UndergroundItemsResponse) => void
    onLoad: (sessionId: string) => void
  }
  onCopyPokemon: () => void
  onOpenMovesBrowser: () => void
  onOpenTypeChart: (typeId: number) => void
  onPastePokemon: () => void
  onFormChange: (form: number) => void
  onPokemonEditorTabChange: (tab: EditorTab) => void
  pokemonEditorTab: EditorTab
  pokemonClipboard: PokemonDetail | null
  saveGameVersion: number
  onSpeciesChange: (species: number, speciesName: string) => void
  onTrainerChange: (trainer: TrainerInfo) => void
  selectedSlotId: string | null
  sessionId: string | null
  setDraft: React.Dispatch<React.SetStateAction<PokemonDetail | null>>
  saveView: SaveView
  t: Translator
  trainer: TrainerInfo | null
  trainerStatus: SaveSectionStatus
  view: View
}
