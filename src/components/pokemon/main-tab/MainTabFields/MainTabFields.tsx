import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  CatalogBundle,
  Language,
  PokemonDetail,
} from '../../../../core/types/index/index'
import { CatalogSelect } from '../../../ui/catalog-select/CatalogSelect/CatalogSelect'
import { NatureListbox } from '../../../ui/catalog-select/NatureListbox/NatureListbox'
import { TextField } from '../../../ui/TextField/TextField'
import { AbilityListbox } from '../../ability/AbilityListbox/AbilityListbox'
import { PokemonStatusFlags } from '../../PokemonStatusFlags/PokemonStatusFlags'
import { PokemonTypeBadges } from '../../PokemonTypeBadges/PokemonTypeBadges'
import { MainTabHeldItemSelect } from '../MainTabHeldItemSelect/MainTabHeldItemSelect'
import { MainTabLevelExpFields } from '../MainTabLevelExpFields/MainTabLevelExpFields'
import { MainTabSpeciesSelect } from '../MainTabSpeciesSelect/MainTabSpeciesSelect'
import { MainTabTeraTypeSelects } from '../MainTabTeraTypeSelects/MainTabTeraTypeSelects'

type Props = {
  catalogs: CatalogBundle
  draft: PokemonDetail
  language: Language
  onFormChange: (form: number) => void
  onOpenTypeChart?: (typeId: number) => void
  onSpeciesChange: (species: number, speciesName: string) => void
  showHeldItem: boolean
  t: Translator
  update: (mutate: (copy: PokemonDetail) => void) => void
}

export function MainTabFields({
  catalogs,
  draft,
  language,
  onFormChange,
  onOpenTypeChart,
  onSpeciesChange,
  showHeldItem,
  t,
  update,
}: Props) {
  const contextAbilities = draft.contextCatalogs.abilities
  const abilityEntries = contextAbilities.length
    ? contextAbilities
    : catalogs.abilities

  return (
    <>
      <PokemonTypeBadges
        t={t}
        teraType={draft.teraType}
        type1={draft.type1}
        type2={draft.type2}
        onOpenTypeChart={onOpenTypeChart}
      />
      <MainTabSpeciesSelect
        catalogs={catalogs}
        draft={draft}
        t={t}
        onSpeciesChange={onSpeciesChange}
      />
      <TextField
        label={t('nickname')}
        validationPath="main.nickname"
        value={draft.main.nickname}
        onChange={(value) => update((copy) => (copy.main.nickname = value))}
      />
      <CatalogSelect
        id="form"
        label={t('form')}
        validationPath="form"
        value={draft.summary.form}
        entries={draft.contextCatalogs.forms}
        onChange={onFormChange}
      />
      <CatalogSelect
        id="language-met"
        label={t('pokemonLanguage')}
        validationPath="main.language"
        value={draft.main.language}
        entries={draft.contextCatalogs.languages}
        onChange={(value) => update((copy) => (copy.main.language = value))}
      />
      <MainTabLevelExpFields draft={draft} t={t} update={update} />
      <NatureListbox
        id="nature"
        label={t('nature')}
        suffix="OG"
        validationPath="nature"
        value={draft.summary.nature}
        entries={catalogs.natures}
        t={t}
        onChange={(value) => update((copy) => (copy.summary.nature = value))}
      />
      <NatureListbox
        id="stat-nature"
        label={t('statNature')}
        suffix="OV"
        validationPath="main.statNature"
        value={draft.main.statNature}
        entries={catalogs.natures}
        t={t}
        onChange={(value) => update((copy) => (copy.main.statNature = value))}
      />
      <AbilityListbox
        id="ability"
        label={t('ability')}
        validationPath="ability"
        value={draft.summary.ability}
        entries={abilityEntries}
        contextAbilities={contextAbilities}
        language={language}
        onChange={(value) =>
          update((copy) => {
            copy.summary.ability = value
            const abilityIndex = contextAbilities.findIndex(
              (entry) => entry.id === value,
            )
            if (abilityIndex >= 0) {
              copy.summary.abilityNumber =
                abilityIndex === 2 ? 4 : abilityIndex + 1
            }
          })
        }
      />
      {showHeldItem && (
        <MainTabHeldItemSelect
          catalogs={catalogs}
          draft={draft}
          t={t}
          update={update}
        />
      )}
      <MainTabTeraTypeSelects draft={draft} t={t} update={update} />
      <PokemonStatusFlags
        cured={draft.main.cured}
        infected={draft.main.infected}
        isEgg={draft.origin.isEgg}
        t={t}
        onCuredChange={(v) => update((copy) => (copy.main.cured = v))}
        onInfectedChange={(v) => update((copy) => (copy.main.infected = v))}
        onIsEggChange={(v) => update((copy) => (copy.origin.isEgg = v))}
      />
    </>
  )
}
