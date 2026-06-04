import type { Translator } from '../../../core/i18n/i18n'
import type { MysteryGiftDatabaseSearchRequest } from '../../../core/types/database'
import type { CatalogBundle } from '../../../core/types/index'
import { getHeldItemImageUrl } from '../../../core/utils/wikiDexAssets'
import { AnyBooleanSelect } from '../../ui/AnyBooleanSelect'
import { BooleanField } from '../../ui/BooleanField'
import { CatalogSearchCombobox } from '../../ui/catalog-select/CatalogSearchCombobox'

export function MysteryGiftGeneralTab({
  catalogs,
  filters,
  onFiltersChange,
  t,
}: {
  catalogs: CatalogBundle
  filters: MysteryGiftDatabaseSearchRequest
  onFiltersChange: (next: Partial<MysteryGiftDatabaseSearchRequest>) => void
  t: Translator
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CatalogSearchCombobox
        id="mystery-gift-view-species"
        entries={catalogs.species}
        label={t('species')}
        clearValue={-1}
        emptyLabel={t('any')}
        t={t}
        value={filters.species}
        onChange={(species) => onFiltersChange({ species })}
      />
      <CatalogSearchCombobox
        id="mystery-gift-view-held-item"
        entries={catalogs.items}
        label={t('heldItem')}
        clearValue={-1}
        emptyLabel={t('any')}
        getImageUrl={getHeldItemImageUrl}
        t={t}
        value={filters.heldItem}
        onChange={(heldItem) => onFiltersChange({ heldItem })}
      />
      <AnyBooleanSelect
        label={t('shiny')}
        t={t}
        value={filters.shiny}
        onChange={(shiny) => onFiltersChange({ shiny })}
      />
      <AnyBooleanSelect
        label={t('egg')}
        t={t}
        value={filters.egg}
        onChange={(egg) => onFiltersChange({ egg })}
      />
      <BooleanField
        label={t('saveLegalityLegal')}
        value={filters.includeLegal}
        onChange={(includeLegal) => onFiltersChange({ includeLegal })}
      />
      <BooleanField
        label={t('saveLegalityUncertain')}
        value={filters.includeUncertain}
        onChange={(includeUncertain) => onFiltersChange({ includeUncertain })}
      />
      <BooleanField
        label={t('saveLegalityIllegal')}
        value={filters.includeIllegal}
        onChange={(includeIllegal) => onFiltersChange({ includeIllegal })}
      />
    </div>
  )
}
