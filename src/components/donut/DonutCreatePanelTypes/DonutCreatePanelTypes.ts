import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  DonutBerryEntry,
  DonutDraft,
  DonutFlavorEntry,
  DonutPreview,
} from '../../../core/types/donut/donut'
import type { CatalogEntry } from '../../../core/types/index/index'

export type DonutCreatePanelProps = {
  berryCatalog: DonutBerryEntry[]
  flavorCatalog: DonutFlavorEntry[]
  itemCatalog: CatalogEntry[]
  t: Translator
  onAdd: (draft: DonutDraft) => void
  onCancel: () => void
  onPreview: (
    berries: number[],
    berryName: number,
  ) => Promise<DonutPreview | null>
}
