import type { I18nKey, Translator } from '../i18n/i18n'
import type {
  PokedexActionKey,
  PokedexActionName,
  PokedexStatusResponse,
} from '../types/index'

const POKEDEX_SLOT_PREFIX = '__pokedex__:'

export const POKEDEX_GLOBAL_DEX_ID = 'all'

export const POKEDEX_ACTION_ORDER: PokedexActionName[] = [
  'seen',
  'caught',
  'shinySeen',
  'shinyCaught',
  'formsSeen',
  'formsCaught',
  'complete',
]

export const POKEDEX_ACTION_LABELS: Record<PokedexActionName, I18nKey> = {
  seen: 'pokedexActionSeen',
  caught: 'pokedexActionCaught',
  shinySeen: 'pokedexActionShinySeen',
  shinyCaught: 'pokedexActionShinyCaught',
  formsSeen: 'pokedexActionFormsSeen',
  formsCaught: 'pokedexActionFormsCaught',
  complete: 'pokedexActionComplete',
}

export function samePokedexAction(
  left: PokedexActionKey,
  right: PokedexActionKey,
) {
  return left.dexId === right.dexId && left.action === right.action
}

export function hasPokedexAction(
  actions: PokedexActionKey[],
  target: PokedexActionKey,
) {
  return actions.some((action) => samePokedexAction(action, target))
}

export function pokedexActionSlotId(target: PokedexActionKey) {
  return `${POKEDEX_SLOT_PREFIX}${target.dexId}:${target.action}`
}

export function parsePokedexActionSlotId(
  slotId: string,
): PokedexActionKey | null {
  if (!slotId.startsWith(POKEDEX_SLOT_PREFIX)) return null

  const [dexId, action] = slotId.slice(POKEDEX_SLOT_PREFIX.length).split(':')
  if (!dexId || !isPokedexActionName(action)) return null

  return { dexId, action }
}

export function pokedexActionLabel(t: Translator, action: PokedexActionName) {
  return t(POKEDEX_ACTION_LABELS[action])
}

export function pokedexDexLabel(
  t: Translator,
  dexId: string,
  status: PokedexStatusResponse | null,
) {
  if (dexId === POKEDEX_GLOBAL_DEX_ID) return t('pokedexAllDexes')
  return status?.dexes.find((dex) => dex.id === dexId)?.label ?? dexId
}

export function formatPokedexDraftLabel(
  t: Translator,
  target: PokedexActionKey,
  status: PokedexStatusResponse | null,
) {
  return t('pokedexDraftLabel', {
    dex: pokedexDexLabel(t, target.dexId, status),
    action: pokedexActionLabel(t, target.action),
  })
}

function isPokedexActionName(
  value: string | undefined,
): value is PokedexActionName {
  return POKEDEX_ACTION_ORDER.includes(value as PokedexActionName)
}
