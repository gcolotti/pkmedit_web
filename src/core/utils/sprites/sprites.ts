import type { PokemonSummary } from '../../types/pokemon/pokemon'

type SpriteSource = Pick<
  PokemonSummary,
  'form' | 'gender' | 'present' | 'shiny' | 'species'
>

const defaultFormSpecies = new Set([
  414, 664, 665, 744, 778, 854, 855, 892, 982, 1012, 1013,
])
const genderedSpriteSpecies = new Set([449, 450, 521, 592, 593, 668])

function getSpriteStem(
  slot: SpriteSource,
  form: number,
  gender: number,
  shiny: boolean,
) {
  const formSuffix = form > 0 ? `-${form}` : ''
  const genderSuffix =
    gender === 1 && genderedSpriteSpecies.has(slot.species) ? 'f' : ''
  const shinySuffix = shiny ? 's' : ''

  return `a_${slot.species}${formSuffix}${genderSuffix}${shinySuffix}`
}

function getSpecialFormStems(slot: SpriteSource, form: number, shiny: boolean) {
  const shinySuffix = shiny ? 's' : ''

  if (slot.species === 25 && form === 8) {
    return [`a_${slot.species}-${form}p${shinySuffix}`]
  }

  if (slot.species === 133 && form === 1) {
    return [`a_${slot.species}-${form}p${shinySuffix}`]
  }

  return []
}

function getFolder(shiny: boolean) {
  return shiny ? 'artwork-shiny' : 'artwork'
}

function getUrl(stem: string, shiny: boolean) {
  return `/pkhex-sprites/${getFolder(shiny)}/${stem}.png`
}

export function getPokemonSpriteCandidates(slot: SpriteSource) {
  if (!slot.present || slot.species <= 0) {
    return []
  }

  const form = defaultFormSpecies.has(slot.species) ? 0 : slot.form
  const variants = [
    ...getSpecialFormStems(slot, form, slot.shiny),
    getSpriteStem(slot, form, slot.gender, slot.shiny),
    getSpriteStem(slot, form, 0, slot.shiny),
    getSpriteStem(slot, 0, slot.gender, slot.shiny),
    getSpriteStem(slot, 0, 0, slot.shiny),
  ]

  const normalFallbacks = [
    ...getSpecialFormStems(slot, form, false),
    getSpriteStem(slot, form, slot.gender, false),
    getSpriteStem(slot, form, 0, false),
    getSpriteStem(slot, 0, slot.gender, false),
    getSpriteStem(slot, 0, 0, false),
  ]

  return [
    ...new Set([
      ...variants.map((stem) => getUrl(stem, slot.shiny)),
      ...normalFallbacks.map((stem) => getUrl(stem, false)),
    ]),
  ]
}

export function getPokemonSpeciesSpriteCandidates(species: number, form = 0) {
  return getPokemonSpriteCandidates({
    form,
    gender: 0,
    present: true,
    shiny: false,
    species,
  })
}
