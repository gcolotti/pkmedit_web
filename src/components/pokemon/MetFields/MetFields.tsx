import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogBundle, PokemonDetail } from '../../../core/types/index/index'
import { getBallImageUrl } from '../../../core/utils/wikiDexAssets/wikiDexAssets'
import { BooleanField } from '../../ui/BooleanField/BooleanField'
import { CatalogSearchCombobox } from '../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'
import { CatalogSelect } from '../../ui/catalog-select/CatalogSelect/CatalogSelect'
import { DateField } from '../../ui/DateField/DateField'
import { NumberField } from '../../ui/NumberField/NumberField'

export function MetFields({
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
    <>
      <CatalogSelect
        id="version"
        label={t('originGame')}
        validationPath="origin.version"
        value={draft.origin.version}
        entries={catalogs.versions}
        onChange={(value) => update((copy) => (copy.origin.version = value))}
      />
      <CatalogSelect
        id="battle-version"
        label={t('battleVersion')}
        validationPath="origin.battleVersion"
        value={draft.origin.battleVersion}
        entries={draft.contextCatalogs.battleVersions}
        onChange={(value) =>
          update((copy) => (copy.origin.battleVersion = value))
        }
      />
      <CatalogSelect
        id="met-location"
        label={t('metLocation')}
        validationPath="origin.metLocation"
        value={draft.origin.metLocation}
        entries={draft.contextCatalogs.metLocations}
        onChange={(value) =>
          update((copy) => (copy.origin.metLocation = value))
        }
      />
      <CatalogSearchCombobox
        id="ball"
        label={t('ball')}
        validationPath="ball"
        value={draft.summary.ball}
        entries={draft.contextCatalogs.balls}
        getImageUrl={getBallImageUrl}
        t={t}
        onChange={(value) => update((copy) => (copy.summary.ball = value))}
      />
      <DateField
        label={t('metDate')}
        validationPath="origin.metDate"
        value={draft.origin.metDate}
        onChange={(value) => update((copy) => (copy.origin.metDate = value))}
      />
      <NumberField
        label={t('metLevel')}
        max={100}
        validationPath="origin.metLevel"
        value={draft.origin.metLevel}
        onChange={(value) => update((copy) => (copy.origin.metLevel = value))}
      />
      <NumberField
        label={t('obedienceLevel')}
        max={100}
        validationPath="origin.obedienceLevel"
        value={draft.origin.obedienceLevel}
        onChange={(value) =>
          update((copy) => (copy.origin.obedienceLevel = value))
        }
      />
      <div className="col-span-full flex flex-wrap items-center gap-x-8 gap-y-2 py-1">
        <BooleanField
          label={t('fateful')}
          validationPath="origin.fatefulEncounter"
          value={draft.origin.fatefulEncounter}
          onChange={(value) =>
            update((copy) => (copy.origin.fatefulEncounter = value))
          }
        />
        <BooleanField
          label={t('asEgg')}
          validationPath="origin.wasEgg"
          value={draft.origin.wasEgg}
          onChange={(value) => update((copy) => (copy.origin.wasEgg = value))}
        />
      </div>
      <CatalogSelect
        id="egg-location"
        label={t('eggLocation')}
        validationPath="origin.eggLocation"
        value={draft.origin.eggLocation}
        entries={draft.contextCatalogs.eggLocations}
        onChange={(value) =>
          update((copy) => (copy.origin.eggLocation = value))
        }
      />
      <DateField
        label={t('eggDate')}
        validationPath="origin.eggMetDate"
        value={draft.origin.eggMetDate}
        onChange={(value) => update((copy) => (copy.origin.eggMetDate = value))}
      />
    </>
  )
}
