import type { I18nKey, Translator } from '../../../../core/i18n/i18n'
import type {
  ArceusResearchActionName,
  ArceusResearchBulkAction,
  ArceusResearchTaskEntry,
} from '../../../../core/types/index'

export const ARCEUS_BULK_LABEL: Record<ArceusResearchBulkAction, I18nKey> = {
  markAllPerfect: 'arceusResearchActionMarkAllPerfect',
  markAllComplete: 'arceusResearchActionMarkAllComplete',
}

export const ARCEUS_PER_SPECIES_LABEL: Record<
  Exclude<ArceusResearchActionName, 'completeTask'>,
  I18nKey
> = {
  completeSpecies: 'arceusResearchActionCompleteSpecies',
  perfectSpecies: 'arceusResearchActionPerfectSpecies',
}

export function getCurrentLevelThreshold(task: ArceusResearchTaskEntry) {
  if (task.reportedLevel <= 1) return task.thresholds[0] ?? 0
  const index = Math.min(task.reportedLevel - 1, task.thresholds.length - 1)
  return task.thresholds[index] ?? 0
}

export function getNextLevelThreshold(task: ArceusResearchTaskEntry) {
  const index = Math.min(task.reportedLevel - 1, task.thresholds.length - 1)
  return task.thresholds[index] ?? 0
}

export function formatTaskProgress(
  t: Translator,
  task: ArceusResearchTaskEntry,
) {
  return t('arceusResearchTaskProgress', {
    current: String(task.currentValue),
    target: String(task.thresholds[task.thresholds.length - 1] ?? 0),
  })
}

export function isTaskComplete(task: ArceusResearchTaskEntry) {
  return task.reportedLevel >= task.maxLevel
}
