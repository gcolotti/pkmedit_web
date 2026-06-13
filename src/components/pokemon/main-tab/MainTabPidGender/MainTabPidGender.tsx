import { useState } from 'react'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import type { Translator } from '../../../../core/i18n/i18n/i18n'
import { useDraftStore } from '../../../../core/state/draftStore/draftStore'
import type { PokemonDetail } from '../../../../core/types/index/index'
import { UINT32_MAX } from '../../../../core/utils/numberInput/numberInput'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'
import { GenderToggle } from './GenderToggle/GenderToggle'

type Update = (mutate: (copy: PokemonDetail) => void) => void

type RerollFlags = {
  preserveGender: boolean
  preserveNature: boolean
  preserveAbility: boolean
  preserveShiny: boolean
  desiredGender?: number | null
}

type Props = {
  draft: PokemonDetail
  selectedSlotId: string | null
  sessionId: string | null
  t: Translator
  update: Update
}

export function MainTabPidGender({
  draft,
  selectedSlotId,
  sessionId,
  t,
  update,
}: Props) {
  const { api } = useWorkspace()
  const setDrafts = useDraftStore((s) => s.setPokemonDrafts)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reroll = async (flags: RerollFlags) => {
    if (!sessionId || !selectedSlotId || busy) return
    setBusy(true)
    setError(null)
    try {
      const next = await api.pokemon.previewRerollPid(
        sessionId,
        selectedSlotId,
        flags,
      )
      // Replace the slot's draft wholesale with the preview result. Using
      // setPokemonDrafts directly (same pattern as usePokemonSelection
      // changeDraftSpecies) so the reroll is visible to every consumer of
      // `drafts` (legality check, party/box summaries, etc.) — not just the
      // local useState inside PokemonEditor.
      const slot = selectedSlotId
      setDrafts((current) => {
        const latest = current[slot]
        if (!latest) return current
        return { ...current, [slot]: next }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('PID reroll failed', err)
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  const onReroll = () => {
    void reroll({
      preserveGender: true,
      preserveNature: true,
      preserveAbility: true,
      preserveShiny: true,
    })
  }
  const onShuffle = () => {
    void reroll({
      preserveGender: false,
      preserveNature: false,
      preserveAbility: false,
      preserveShiny: false,
    })
  }
  const onSetGender = (gender: number) => {
    if (busy || !selectedSlotId) return
    // Optimistic local toggle — flips the displayed gender immediately and
    // updates the draft so the optimistic UI matches the eventual result.
    update((copy) => {
      copy.main.gender = gender
      copy.summary.gender = gender
    })
    void reroll({
      preserveGender: false,
      preserveNature: true,
      preserveAbility: true,
      preserveShiny: true,
      desiredGender: gender,
    })
  }

  return (
    <div className="sm:col-span-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-1">
          <CompactNumberField
            label={t('pid')}
            max={UINT32_MAX}
            validationPath="main.pid"
            value={draft.main.pid}
            onChange={(value) => update((copy) => (copy.main.pid = value))}
          />
          <div className="flex h-9 gap-1">
            <button
              aria-label={t('reroll')}
              className="btn min-h-9 border-0 px-2"
              disabled={busy}
              title={t('reroll')}
              type="button"
              onClick={onReroll}
            >
              ↻
            </button>
            <button
              aria-label={t('shuffle')}
              className="btn min-h-9 border-0 px-2"
              disabled={busy}
              title={t('shuffle')}
              type="button"
              onClick={onShuffle}
            >
              ⚂
            </button>
          </div>
        </div>
        <label className="grid min-w-[6rem] gap-1">
          <span className="label truncate text-[0.65rem] leading-none">
            {t('gender')}
          </span>
          <GenderToggle
            disabled={busy}
            value={draft.main.gender}
            onChange={onSetGender}
          />
        </label>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
