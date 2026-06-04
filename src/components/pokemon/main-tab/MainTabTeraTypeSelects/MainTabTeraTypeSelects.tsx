import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry, PokemonDetail } from '../../../../core/types/index/index'
import {
  BASE_TYPE_IDS,
  getTypeName,
  TERA_TYPE_OVERRIDE_NONE,
  TERA_TYPE_STELLAR,
} from '../../../../core/utils/typeData/typeData'
import { CatalogSelect } from '../../../ui/catalog-select/CatalogSelect/CatalogSelect'

const TERA_TYPE_IDS = [...BASE_TYPE_IDS, TERA_TYPE_STELLAR]

function buildTeraTypeEntries(t: Translator): CatalogEntry[] {
  return TERA_TYPE_IDS.map((id) => ({ id, name: getTypeName(t, id) }))
}

function buildTeraTypeOverrideEntries(t: Translator): CatalogEntry[] {
  return [
    { id: TERA_TYPE_OVERRIDE_NONE, name: t('none') },
    ...buildTeraTypeEntries(t),
  ]
}

function getEffectiveTeraType(original: number, overrideValue: number) {
  return overrideValue === TERA_TYPE_OVERRIDE_NONE ? original : overrideValue
}

export function MainTabTeraTypeSelects({
  draft,
  t,
  update,
}: {
  draft: PokemonDetail
  t: Translator
  update: (mutate: (copy: PokemonDetail) => void) => void
}) {
  if (
    typeof draft.teraTypeOriginal !== 'number' ||
    typeof draft.teraTypeOverride !== 'number' ||
    draft.teraTypeOriginal < 0 ||
    draft.teraTypeOverride < 0
  )
    return null

  const typeEntries = buildTeraTypeEntries(t)
  const overrideEntries = buildTeraTypeOverrideEntries(t)
  const formatOptionLabel = (entry: CatalogEntry) => entry.name

  return (
    <>
      <CatalogSelect
        id="tera-type-original"
        entries={typeEntries}
        formatOptionLabel={formatOptionLabel}
        label={t('teraType')}
        suffix="OG"
        preserveOrder
        validationPath="teraTypeOriginal"
        value={draft.teraTypeOriginal}
        onChange={(value) =>
          update((copy) => {
            copy.teraTypeOriginal = value
            copy.teraType = getEffectiveTeraType(value, copy.teraTypeOverride)
          })
        }
      />
      <CatalogSelect
        id="tera-type-override"
        entries={overrideEntries}
        formatOptionLabel={formatOptionLabel}
        label={t('teraType')}
        suffix="OV"
        preserveOrder
        validationPath="teraTypeOverride"
        value={draft.teraTypeOverride}
        onChange={(value) =>
          update((copy) => {
            copy.teraTypeOverride = value
            copy.teraType = getEffectiveTeraType(copy.teraTypeOriginal, value)
          })
        }
      />
    </>
  )
}
