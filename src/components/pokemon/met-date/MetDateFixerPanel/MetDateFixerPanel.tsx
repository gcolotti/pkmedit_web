import { CalendarClock, ListChecks } from 'lucide-react'
import { useState } from 'react'

import { areStructurallyEqual } from '../../../../core/services/structuralEquality/structuralEquality'
import type { MetDateFixerPreview } from '../../../../core/types/metDateFixer/metDateFixer'
import { MetDateCheckboxes } from '../MetDateCheckboxes/MetDateCheckboxes'
import {
  buildMetDateRequest,
  MET_DATE_INITIAL_FORM,
  MET_DATE_PRESETS,
  type MetDateFixerPanelProps,
  type MetDateFormState,
} from '../metDateFixerData/metDateFixerData'
import { MetDateFixerPreviewReport } from '../MetDateFixerPreviewReport/MetDateFixerPreviewReport'

export function MetDateFixerPanel({
  queuedDraft,
  sessionId,
  t,
  onPreview,
  onQueue,
}: MetDateFixerPanelProps) {
  const [form, setForm] = useState<MetDateFormState>(MET_DATE_INITIAL_FORM)
  const [preview, setPreview] = useState<MetDateFixerPreview | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const request = buildMetDateRequest(form)
  const queued =
    queuedDraft !== null && areStructurallyEqual(queuedDraft, request)
  const changedTotal = preview
    ? preview.changedCount + preview.trainerChangedCount
    : 0

  async function handlePreview() {
    if (!sessionId) return
    setLoading(true)
    setStatus('')
    try {
      const result = await onPreview(request)
      setPreview(result)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  function handleQueue() {
    onQueue(request)
    setStatus(t('dateFixerQueued'))
  }

  return (
    <div className="mt-4 grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1.5">
          <span className="label text-[0.65rem]">{t('preset')}</span>
          <select
            className="field"
            value={form.preset}
            onChange={(event) =>
              setForm({ ...form, preset: event.currentTarget.value })
            }
          >
            {MET_DATE_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="label text-[0.65rem]">{t('startDate')}</span>
          <input
            className="field"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm({ ...form, startDate: event.currentTarget.value })
            }
          />
        </label>
        <label className="grid gap-1.5">
          <span className="label text-[0.65rem]">{t('storyEndDate')}</span>
          <input
            className="field"
            type="date"
            value={form.storyEndDate}
            onChange={(event) =>
              setForm({ ...form, storyEndDate: event.currentTarget.value })
            }
          />
        </label>
        <label className="grid gap-1.5">
          <span className="label text-[0.65rem]">{t('postGameEndDate')}</span>
          <input
            className="field"
            type="date"
            value={form.postGameEndDate}
            onChange={(event) =>
              setForm({ ...form, postGameEndDate: event.currentTarget.value })
            }
          />
        </label>
      </div>

      <MetDateCheckboxes form={form} t={t} onChange={setForm} />

      <div className="grid grid-cols-2 gap-2">
        <button
          className="btn"
          disabled={!sessionId || loading}
          type="button"
          onClick={() => void handlePreview()}
        >
          <CalendarClock className="h-4 w-4" />
          {loading ? t('loading') : t('preview')}
        </button>
        <button
          className={queued ? 'btn btn-primary' : 'btn'}
          disabled={!preview || changedTotal === 0 || queued}
          type="button"
          onClick={handleQueue}
        >
          <ListChecks className="h-4 w-4" />
          {queued ? t('queued') : t('queueChanges')}
        </button>
      </div>

      {status && (
        <p className="text-xs text-stone-500 dark:text-stone-400">{status}</p>
      )}

      {preview && <MetDateFixerPreviewReport preview={preview} t={t} />}
    </div>
  )
}
