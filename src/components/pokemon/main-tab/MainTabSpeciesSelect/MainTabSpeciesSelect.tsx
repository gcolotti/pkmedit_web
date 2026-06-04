import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry, PokemonDetail } from '../../../../core/types/index/index'
import { CatalogSearchCombobox } from '../../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'

type Props = {
  catalogs: { species: CatalogEntry[] }
  draft: PokemonDetail
  onSpeciesChange: (species: number, speciesName: string) => void
  t: Translator
}

export function MainTabSpeciesSelect({
  catalogs,
  draft,
  onSpeciesChange,
  t,
}: Props) {
  return (
    <CatalogSearchCombobox
      id="species"
      label={t('species')}
      validationPath="species"
      value={draft.summary.species}
      entries={catalogs.species}
      t={t}
      onChange={(value) =>
        onSpeciesChange(
          value,
          catalogs.species.find((entry) => entry.id === value)?.name ??
            value.toString(),
        )
      }
    />
  )
}
