import type { I18nKey, Translator } from '../../i18n/i18n/i18n'
import type {
  ArceusResearchActionKey,
  ArceusResearchActionName,
  ArceusResearchBulkAction,
} from '../../types/index/index'

const SLOT_PREFIX = '__arceus_research__:'
const BULK_SLOT_PREFIX = '__arceus_research_bulk__:'

export const ARCEUS_RESEARCH_BULK_LABELS: Record<
  ArceusResearchBulkAction,
  I18nKey
> = {
  markAllPerfect: 'arceusResearchActionMarkAllPerfect',
  markAllComplete: 'arceusResearchActionMarkAllComplete',
}

export const ARCEUS_RESEARCH_ACTION_LABELS: Record<
  ArceusResearchActionName,
  I18nKey
> = {
  completeTask: 'arceusResearchActionCompleteTask',
  completeSpecies: 'arceusResearchActionCompleteSpecies',
  perfectSpecies: 'arceusResearchActionPerfectSpecies',
}

export function sameArceusResearchAction(
  left: ArceusResearchActionKey,
  right: ArceusResearchActionKey,
) {
  return (
    left.species === right.species &&
    left.action === right.action &&
    (left.taskIndex ?? null) === (right.taskIndex ?? null)
  )
}

export function arceusResearchActionSlotId(key: ArceusResearchActionKey) {
  const task = key.taskIndex ?? 'all'
  return `${SLOT_PREFIX}${key.species}:${key.action}:${task}`
}

export function arceusResearchBulkSlotId(action: ArceusResearchBulkAction) {
  return `${BULK_SLOT_PREFIX}${action}`
}

export function parseArceusResearchActionSlotId(
  slotId: string,
): ArceusResearchActionKey | null {
  if (!slotId.startsWith(SLOT_PREFIX)) return null
  const [speciesRaw, actionRaw, taskRaw] = slotId
    .slice(SLOT_PREFIX.length)
    .split(':')
  const species = Number.parseInt(speciesRaw ?? '', 10)
  const action = actionRaw ?? ''
  if (!Number.isFinite(species) || !isArceusResearchActionName(action)) {
    return null
  }
  const taskIndex =
    taskRaw === 'all' || taskRaw === undefined
      ? null
      : Number.parseInt(taskRaw, 10)
  if (taskIndex !== null && !Number.isFinite(taskIndex)) return null
  return { species, action, taskIndex }
}

export function parseArceusResearchBulkSlotId(
  slotId: string,
): ArceusResearchBulkAction | null {
  if (!slotId.startsWith(BULK_SLOT_PREFIX)) return null
  const action = slotId.slice(BULK_SLOT_PREFIX.length)
  return isArceusResearchBulkAction(action) ? action : null
}

export function formatArceusResearchDraftLabel(
  t: Translator,
  key: ArceusResearchActionKey,
  speciesName: string,
) {
  if (key.action === 'completeTask') {
    return t('arceusResearchDraftLabelTask', {
      species: speciesName,
      taskIndex: String((key.taskIndex ?? 0) + 1),
    })
  }
  return t('arceusResearchDraftLabelSpecies', {
    species: speciesName,
    action: t(ARCEUS_RESEARCH_ACTION_LABELS[key.action]),
  })
}

export function formatArceusResearchBulkLabel(
  t: Translator,
  action: ArceusResearchBulkAction,
) {
  return t(ARCEUS_RESEARCH_BULK_LABELS[action])
}

function isArceusResearchActionName(
  value: string,
): value is ArceusResearchActionName {
  return (
    value === 'completeTask' ||
    value === 'completeSpecies' ||
    value === 'perfectSpecies'
  )
}

function isArceusResearchBulkAction(
  value: string,
): value is ArceusResearchBulkAction {
  return value === 'markAllPerfect' || value === 'markAllComplete'
}
