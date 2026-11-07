export type PokemonSummary = {
  slotId: string
  present: boolean
  species: number
  speciesName: string
  form: number
  level: number
  shiny: boolean
  gender: number
  nature: number
  ability: number
  abilityNumber: number
  heldItem: number
  ball: number
  legal: boolean
  alpha: boolean
  egg: boolean
  hasItem: boolean
  legalSeverity: string | null
}

export type PokemonStats = {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

export type PokemonHyperTrain = {
  hp: boolean
  atk: boolean
  def: boolean
  spa: boolean
  spd: boolean
  spe: boolean
}

export type PokemonMain = {
  pid: number
  encryptionConstant: number
  nickname: string
  isNicknamed: boolean
  exp: number
  gender: number
  language: number
  statNature: number
  pokerusStrain: number
  pokerusDays: number
  infected: boolean
  cured: boolean
}

export type PokemonMoves = {
  move1: number
  move2: number
  move3: number
  move4: number
  move1Pp: number
  move2Pp: number
  move3Pp: number
  move4Pp: number
  move1PpUps: number
  move2PpUps: number
  move3PpUps: number
  move4PpUps: number
  relearnMove1: number
  relearnMove2: number
  relearnMove3: number
  relearnMove4: number
}

export type PokemonPlusMoves = {
  permittedMoves: number[]
  purchasedFlags: boolean[]
  masteredFlags: boolean[]
  hasPurchasedFlags: boolean
}

export type PokemonOrigin = {
  version: number
  battleVersion: number
  metLevel: number
  obedienceLevel: number
  metLocation: number
  metLocationName: string
  metDate: string | null
  wasEgg: boolean
  isEgg: boolean
  eggLocation: number
  eggLocationName: string
  eggMetDate: string | null
  fatefulEncounter: boolean
}

export type PokemonTrainer = {
  originalTrainerName: string
  tid16: number
  sid16: number
  displayTid: number
  displaySid: number
  originalTrainerGender: number
  originalTrainerFriendship: number
  handlingTrainerName: string
  handlingTrainerGender: number
  handlingTrainerFriendship: number
  handlingTrainerLanguage: number
  currentHandler: 0 | 1
}

// id matches the ribbons catalog. The list holds the ribbons the Pokémon can
// legally get plus any it holds illegally (obtainable: false). When PKHeX
// matches no encounter it holds every ribbon of the format, unverified
// (obtainable: null). count/maxCount only come with count ribbons (Gen 3
// contest ranks, memory ribbons).
export type PokemonRibbon = {
  id: number
  name: string
  value: boolean
  count?: number | null
  maxCount?: number | null
  obtainable?: boolean | null
}

export type PokemonExtraByte = {
  offset: number
  value: number
}

export type PokemonCosmetic = {
  alpha: boolean
  height: number
  weight: number
  scale: number
  contest: PokemonStats
  markings: number[]
  ribbons: PokemonRibbon[]
  homeTracker: number
  formArgument: number
  formArgumentRemain: number
  formArgumentElapsed: number
  formArgumentMaximum: number
  extraBytes: PokemonExtraByte[]
}
