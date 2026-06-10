import type { Translator } from '../../i18n/i18n/i18n'
import type { PokemonDetail } from '../../types/index/index'
import {
  getTypeName,
  TERA_TYPE_OVERRIDE_NONE,
} from '../../utils/typeData/typeData'
import { buildPokemonPayload } from '../pokemonPayload/pokemonPayload'

const summaryPathMap: Record<string, string> = {
  species: 'species',
  level: 'level',
  form: 'form',
  shiny: 'shiny',
  nature: 'nature',
  ability: 'ability',
  abilityNumber: 'abilityNumber',
  heldItem: 'heldItem',
  ball: 'ball',
}

const labelMap: Record<string, string> = {
  heldItem: 'heldItem',
  teraTypeOriginal: 'teraTypeOriginal',
  teraTypeOverride: 'teraTypeOverride',
  isNicknamed: 'nicknameFlag',
  statNature: 'statNature',
  metLocation: 'metLocation',
  eggLocation: 'eggLocation',
  metDate: 'metDate',
  eggMetDate: 'eggDate',
  originalTrainerName: 'ot',
  handlingTrainerName: 'ht',
}

const labelTranslations = {
  ability: 'ability',
  abilityNumber: 'abilityNumber',
  ball: 'ball',
  form: 'form',
  heldItem: 'heldItem',
  teraTypeOriginal: 'teraTypeOriginal',
  teraTypeOverride: 'teraTypeOverride',
  level: 'level',
  nature: 'nature',
  shiny: 'shiny',
  species: 'species',
  nicknameFlag: 'nicknameFlag',
  statNature: 'statNature',
  metLocation: 'metLocation',
  eggLocation: 'eggLocation',
  metDate: 'metDate',
  eggDate: 'eggDate',
  ot: 'ot',
  ht: 'ht',
} as const

function isTranslationLabel(
  value: string,
): value is keyof typeof labelTranslations {
  return value in labelTranslations
}

export function flatten(value: unknown, prefix = ''): Record<string, unknown> {
  if (!value || typeof value !== 'object') return { [prefix]: value }
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.flatMap((item, index) =>
        Object.entries(flatten(item, joinPath(prefix, index.toString()))),
      ),
    )
  }

  return Object.entries(value).reduce<Record<string, unknown>>(
    (result, [key, item]) => {
      Object.assign(result, flatten(item, joinPath(prefix, key)))
      return result
    },
    {},
  )
}

function joinPath(prefix: string, key: string) {
  return prefix ? `${prefix}.${key}` : key
}

export function labelPath(path: string, t: Translator) {
  const parts = path.split('.')
  const last = parts[parts.length - 1] ?? path
  const known = labelMap[last] ?? last
  return isTranslationLabel(known) ? t(labelTranslations[known]) : known
}

export function formatValue(value: unknown, t: Translator, path?: string) {
  if (typeof value === 'boolean') return value ? t('yes') : t('no')
  if (value === null || value === undefined || value === '') return t('blank')
  if (path === 'teraTypeOverride' && value === TERA_TYPE_OVERRIDE_NONE)
    return t('none')
  if (
    (path === 'teraTypeOriginal' || path === 'teraTypeOverride') &&
    typeof value === 'number'
  )
    return getTypeName(t, value)
  if (typeof value === 'number' || typeof value === 'bigint')
    return value.toString()
  if (typeof value === 'string') return value
  return JSON.stringify(value) ?? t('blank')
}

function writePath(target: PokemonDetail, path: string, value: unknown) {
  const [root, ...rest] = path.split('.')
  let current = target as unknown as Record<string, unknown>
  if (
    root === 'species' ||
    root === 'level' ||
    root === 'form' ||
    root === 'shiny' ||
    root === 'nature' ||
    root === 'ability' ||
    root === 'abilityNumber' ||
    root === 'heldItem' ||
    root === 'ball' ||
    root === 'teraTypeOriginal' ||
    root === 'teraTypeOverride'
  ) {
    if (root === 'teraTypeOriginal' || root === 'teraTypeOverride') {
      current = target
      rest.unshift(root)
    } else {
      current = target.summary
      rest.unshift(summaryPathMap[root] ?? root)
    }
  } else {
    current = current[root] as Record<string, unknown>
  }

  for (const key of rest.slice(0, -1))
    current = current[key] as Record<string, unknown>
  current[rest[rest.length - 1] ?? root] = value
  if (root === 'teraTypeOriginal' || root === 'teraTypeOverride') {
    target.teraType =
      target.teraTypeOverride === TERA_TYPE_OVERRIDE_NONE
        ? target.teraTypeOriginal
        : target.teraTypeOverride
  }
}

export function revertDraftPath(
  base: PokemonDetail,
  draft: PokemonDetail,
  path: string,
) {
  const copy = structuredClone(draft)
  const basePayload = flatten(buildPokemonPayload(base))
  const value = basePayload[path]
  writePath(copy, path, value)
  return copy
}
