import { Archive, Download, FolderOpen, Upload } from 'lucide-react'
import { useRef } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type {
  DraftChange,
  DraftLegalityViolation,
  SaveFileEntry,
  SaveSummary,
} from '../../core/types/index'
import { SummaryPanel } from '../pokemon/SummaryPanel'
import { DraftChangesPanel } from './DraftChangesPanel'

export function SavesPanel({
  allowIllegalChanges,
  changes,
  onAllowIllegalChangesChange,
  onCheckDraft,
  onOpenSelectedSave,
  onRevertAll,
  onRevertChange,
  onSelectedSaveChange,
  onUploadFile,
  onWrite,
  onWriteZip,
  saves,
  selectedSave,
  summary,
  t,
  violations,
}: {
  allowIllegalChanges: boolean
  changes: DraftChange[]
  onAllowIllegalChangesChange: (value: boolean) => void
  onCheckDraft: () => void
  onOpenSelectedSave: () => void
  onRevertAll: () => void
  onRevertChange: (change: DraftChange) => void
  onSelectedSaveChange: (value: string) => void
  onUploadFile: (file: File) => void
  onWrite: () => void
  onWriteZip: () => void
  saves: SaveFileEntry[]
  selectedSave: string
  summary: SaveSummary | null
  t: Translator
  violations: DraftLegalityViolation[]
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <aside className="glass-panel rounded-lg p-4 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain">
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0] ?? null
          event.currentTarget.value = ''
          if (file) onUploadFile(file)
        }}
      />
      <button
        className="btn btn-primary w-full"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} />
        {t('openFile')}
      </button>
      {saves.length > 0 && (
        <div className="mt-3 grid gap-2">
          <label className="grid gap-1.5">
            <span className="label text-[0.65rem]">{t('workspaceSave')}</span>
            <select
              className="field min-w-0 text-sm"
              value={selectedSave}
              onChange={(event) =>
                onSelectedSaveChange(event.currentTarget.value)
              }
            >
              {saves.map((save) => (
                <option key={save.relativePath} value={save.relativePath}>
                  {save.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn w-full text-sm"
            disabled={!selectedSave}
            type="button"
            onClick={onOpenSelectedSave}
          >
            <FolderOpen size={15} />
            {t('openWorkspaceSave')}
          </button>
        </div>
      )}
      <SummaryPanel summary={summary} t={t} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className="btn btn-primary"
          disabled={!summary}
          type="button"
          onClick={onWrite}
        >
          <Download size={16} />
          {t('export')}
        </button>
        <button
          className="btn btn-primary"
          disabled={!summary}
          type="button"
          onClick={onWriteZip}
        >
          <Archive size={16} />
          {t('exportZip')}
        </button>
      </div>
      <DraftChangesPanel
        allowIllegalChanges={allowIllegalChanges}
        changes={changes}
        t={t}
        violations={violations}
        onAllowIllegalChangesChange={onAllowIllegalChangesChange}
        onCheckDraft={onCheckDraft}
        onRevertAll={onRevertAll}
        onRevertChange={onRevertChange}
      />
    </aside>
  )
}
