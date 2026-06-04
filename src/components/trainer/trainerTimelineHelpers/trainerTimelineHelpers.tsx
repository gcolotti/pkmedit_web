import type { TrainerTimelineEntry } from '../../../core/types/trainer/trainer'

export function toDateTimeLocalValue(value: string) {
  return value.slice(0, 16)
}

export function fromDateTimeLocalValue(value: string) {
  return value ? `${value}:00` : null
}

export function toTimelineInputValue(entry: TrainerTimelineEntry) {
  if (!entry.value) return ''
  return entry.kind === 'date'
    ? entry.value.slice(0, 10)
    : entry.value.slice(0, 16)
}

export function fromTimelineInputValue(
  value: string,
  kind: TrainerTimelineEntry['kind'],
) {
  if (!value) return ''
  return kind === 'date' ? value : `${value}:00`
}

export function formatTimelineValue(entry: TrainerTimelineEntry) {
  if (entry.kind === 'text') return entry.value
  if (entry.kind === 'duration') return entry.value
  const date = new Date(entry.value)
  if (Number.isNaN(date.getTime())) return entry.value
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    ...(entry.kind === 'datetime' ? { timeStyle: 'short' as const } : {}),
  }).format(date)
}

function updateTimeline(
  timeline: TrainerTimelineEntry[],
  key: string,
  inputValue: string,
  kind: TrainerTimelineEntry['kind'],
): TrainerTimelineEntry[] {
  return timeline.map((it) =>
    it.key === key
      ? { ...it, value: fromTimelineInputValue(inputValue, kind) }
      : it,
  )
}

export function TimelineEntryField({
  entry,
  timeline,
  onChange,
}: {
  entry: TrainerTimelineEntry
  timeline: TrainerTimelineEntry[]
  onChange: (t: TrainerTimelineEntry[]) => void
}) {
  if (entry.editable && entry.kind !== 'text') {
    return (
      <input
        className="field"
        type={entry.kind === 'date' ? 'date' : 'datetime-local'}
        value={toTimelineInputValue(entry)}
        onChange={(e) =>
          onChange(
            updateTimeline(
              timeline,
              entry.key,
              e.currentTarget.value,
              entry.kind,
            ),
          )
        }
      />
    )
  }
  return (
    <div className="field-readonly px-3 py-2 text-sm tabular-nums">
      {formatTimelineValue(entry)}
    </div>
  )
}
