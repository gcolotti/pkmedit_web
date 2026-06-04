import type { I18nKey, Translator } from '../../core/i18n/i18n'
import type { TrainerInfo } from '../../core/types/trainer'
import { parseClampedNumberInput } from '../../core/utils/numberInput'
import { TrainerSection } from './TrainerSection'
import {
  fromDateTimeLocalValue,
  TimelineEntryField,
  toDateTimeLocalValue,
} from './trainerTimelineHelpers'

const PINNED_KEYS = ['adventureStarted', 'enrollmentDate', 'hallOfFame']
const PLAY_TIME_FIELDS = [
  { key: 'playedHours' as const, label: 'hours' as I18nKey, max: 9999 },
  { key: 'playedMinutes' as const, label: 'minutes' as I18nKey, max: 59 },
  { key: 'playedSeconds' as const, label: 'seconds' as I18nKey, max: 59 },
]

export function TrainerTimelineSection({
  trainer,
  t,
  onChange,
}: {
  trainer: TrainerInfo
  t: Translator
  onChange: <K extends keyof TrainerInfo>(key: K, value: TrainerInfo[K]) => void
}) {
  const adventureEntry =
    trainer.timeline.find(
      (e) => e.key === 'adventureStarted' || e.key === 'enrollmentDate',
    ) ?? null
  const hallOfFame =
    trainer.timeline.find((e) => e.key === 'hallOfFame') ?? null
  const otherEntries = trainer.timeline.filter(
    (e) => !PINNED_KEYS.includes(e.key),
  )
  const hasPlayTime = trainer.canEditPlayTime
  const hasRow1 = hasPlayTime || adventureEntry !== null
  const hasRow2 = trainer.lastSaved !== null || hallOfFame !== null
  if (!hasRow1 && !hasRow2 && otherEntries.length === 0) return null

  const row1Cols = adventureEntry && hasPlayTime ? 'grid-cols-2' : 'grid-cols-1'
  const row2Cols =
    trainer.lastSaved && hallOfFame ? 'grid-cols-2' : 'grid-cols-1'
  const setTimeline = (tl: TrainerInfo['timeline']) => onChange('timeline', tl)

  return (
    <TrainerSection title={t('trainerTimeline')}>
      {hasRow1 && (
        <div className={`grid gap-4 ${row1Cols}`}>
          {adventureEntry && (
            <label className="grid min-w-0 gap-1.5">
              <span className="label text-[0.65rem]">
                {t(adventureEntry.labelKey as I18nKey)}
              </span>
              <TimelineEntryField
                entry={adventureEntry}
                timeline={trainer.timeline}
                onChange={setTimeline}
              />
            </label>
          )}
          {hasPlayTime && (
            <div className="grid min-w-0 grid-cols-3 gap-2">
              {PLAY_TIME_FIELDS.map(({ key, label, max }) => (
                <label key={key} className="grid gap-1.5">
                  <span className="label text-[0.65rem]">{t(label)}</span>
                  <input
                    className="field"
                    max={max}
                    min={0}
                    type="number"
                    value={trainer[key] ?? 0}
                    onChange={(e) =>
                      onChange(
                        key,
                        parseClampedNumberInput(e.target.value, {
                          max,
                          min: 0,
                        }),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {hasRow2 && (
        <div className={`grid gap-4 ${row2Cols}`}>
          {trainer.lastSaved && (
            <label className="grid min-w-0 gap-1.5">
              <span className="label text-[0.65rem]">{t('lastSaved')}</span>
              <input
                className="field"
                type="datetime-local"
                value={toDateTimeLocalValue(trainer.lastSaved)}
                onChange={(e) =>
                  onChange(
                    'lastSaved',
                    fromDateTimeLocalValue(e.currentTarget.value),
                  )
                }
              />
            </label>
          )}
          {hallOfFame && (
            <label className="grid min-w-0 gap-1.5">
              <span className="label text-[0.65rem]">
                {t(hallOfFame.labelKey as I18nKey)}
              </span>
              <TimelineEntryField
                entry={hallOfFame}
                timeline={trainer.timeline}
                onChange={setTimeline}
              />
            </label>
          )}
        </div>
      )}
      {otherEntries.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {otherEntries.map((entry) => (
            <label key={entry.key} className="grid gap-1.5">
              <span className="label text-[0.65rem]">
                {t(entry.labelKey as I18nKey)}
              </span>
              <TimelineEntryField
                entry={entry}
                timeline={trainer.timeline}
                onChange={setTimeline}
              />
            </label>
          ))}
        </div>
      )}
    </TrainerSection>
  )
}
