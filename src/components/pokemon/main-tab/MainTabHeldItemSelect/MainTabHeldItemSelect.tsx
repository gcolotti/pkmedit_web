import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  CatalogBundle,
  PokemonDetail,
} from '../../../../core/types/index/index'
import { getHeldItemImageUrl } from '../../../../core/utils/wikiDexAssets/wikiDexAssets'
import { CatalogSearchCombobox } from '../../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'

export function MainTabHeldItemSelect({
  catalogs,
  draft,
  t,
  update,
}: {
  catalogs: CatalogBundle
  draft: PokemonDetail
  t: Translator
  update: (mutate: (copy: PokemonDetail) => void) => void
}) {
  return (
    <CatalogSearchCombobox
      id="item"
      clearValue={0}
      emptyLabel={t('none')}
      entries={draft.contextCatalogs.heldItems}
      getImageUrl={getHeldItemImageUrl}
      label={t('heldItem')}
      selectedEntry={catalogs.items.find(
        (entry) => entry.id === draft.summary.heldItem,
      )}
      t={t}
      validationPath="heldItem"
      value={draft.summary.heldItem}
      onChange={(value) => update((copy) => (copy.summary.heldItem = value))}
    />
  )
}
