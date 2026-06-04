import type { Translator } from '../../../../core/i18n/i18n'
import type {
  ArceusResearchActionKey,
  ArceusResearchTaskEntry,
} from '../../../../core/types/index'
import { formatTaskProgress, isTaskComplete } from './arceusResearchPanelUtils'

export function ArceusResearchTaskRow({
  species,
  task,
  queued,
  onApply,
  t,
}: {
  species: number
  task: ArceusResearchTaskEntry
  queued: boolean
  onApply: (key: ArceusResearchActionKey) => void
  t: Translator
}) {
  const finalThreshold = task.thresholds[task.thresholds.length - 1] ?? 0
  const percent =
    finalThreshold > 0
      ? Math.min(100, Math.round((task.currentValue / finalThreshold) * 100))
      : 0
  const complete = isTaskComplete(task)
  const queuedOrComplete = queued || complete
  const canApply = task.editable && !complete

  return (
    <div className="border-base-300/40 grid gap-1 border-b py-1.5 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base-content break-words text-xs font-medium leading-snug">
            {task.label}
            {task.required && (
              <span className="text-warning ml-1 text-[10px] uppercase">
                {t('arceusResearchTaskRequired')}
              </span>
            )}
          </p>
          <p className="text-base-content/60 mt-0.5 text-[10px]">
            {t('arceusResearchTaskLevel', {
              level: String(task.reportedLevel),
              max: String(task.maxLevel),
            })}
            {' · '}
            {formatTaskProgress(t, task)}
            {' · '}
            {t('arceusResearchTaskPoints', {
              single: String(task.pointsSingle),
              bonus: String(task.pointsBonus),
            })}
          </p>
        </div>
        <button
          className={`btn btn-xs shrink-0 ${queued ? 'btn-primary' : complete ? 'btn-disabled' : ''}`}
          disabled={!canApply || queued}
          type="button"
          onClick={() =>
            canApply &&
            onApply({
              species,
              action: 'completeTask',
              taskIndex: task.index,
            })
          }
        >
          {complete
            ? t('arceusResearchTaskComplete')
            : !task.editable
              ? t('arceusResearchTaskNotEditable')
              : t('arceusResearchActionCompleteTask')}
        </button>
      </div>
      <div className="bg-base-300 h-1 w-full rounded-full">
        <div
          className={`h-1 rounded-full transition-all ${queuedOrComplete ? 'bg-success' : 'bg-primary'}`}
          style={{ width: `${queuedOrComplete ? 100 : percent}%` }}
        />
      </div>
    </div>
  )
}
