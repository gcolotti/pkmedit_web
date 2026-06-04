import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  DonutDraft,
  DonutPocket,
  DonutPreview,
} from '../../../core/types/donut/donut'
import type { CatalogEntry } from '../../../core/types/index/index'
import { DonutCreatePanel } from '../../donut/DonutCreatePanel/DonutCreatePanel'

type Props = {
  donutCreatorPocket: DonutPocket | null
  itemCatalog: CatalogEntry[]
  t: Translator
  onAddDonut: (draft: DonutDraft) => void
  onCloseDonutCreator: () => void
  onPreviewDonut: (
    berries: number[],
    berryName: number,
  ) => Promise<DonutPreview | null>
}

export function WorkspaceSavePanel({
  donutCreatorPocket,
  itemCatalog,
  onAddDonut,
  onCloseDonutCreator,
  onPreviewDonut,
  t,
}: Props) {
  if (!donutCreatorPocket) return null

  return (
    <div className="mx-auto mt-5 max-w-xl">
      <DonutCreatePanel
        berryCatalog={donutCreatorPocket.berryCatalog}
        flavorCatalog={donutCreatorPocket.flavorCatalog}
        itemCatalog={itemCatalog}
        t={t}
        onAdd={(draft) => {
          onAddDonut(draft)
          onCloseDonutCreator()
        }}
        onCancel={onCloseDonutCreator}
        onPreview={onPreviewDonut}
      />
    </div>
  )
}
