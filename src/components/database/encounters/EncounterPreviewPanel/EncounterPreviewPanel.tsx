import { Check, X } from 'lucide-react'
import { useMemo } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { EncounterDatabasePreview } from '../../../../core/types/database/database'
import type { BoxSummary } from '../../../../core/types/index/index'
import type { PokemonSummary } from '../../../../core/types/pokemon/pokemon'
import { PokemonHeaderIdentity } from '../../../pokemon/PokemonHeaderIdentity/PokemonHeaderIdentity'
import { PreviewDetails } from '../../../pokemon/PreviewDetails/PreviewDetails'
import { SlotDestinationPicker } from '../../SlotDestinationPicker/SlotDestinationPicker'

export function EncounterPreviewPanel({
  boxes,
  onApply,
  onClear,
  party,
  preview,
  t,
}: {
  boxes: BoxSummary[]
  onApply: (preview: EncounterDatabasePreview, slotId: string) => Promise<void>
  onClear: () => void
  party: PokemonSummary[]
  preview: EncounterDatabasePreview
  t: Translator
}) {
  const details = useMemo(
    () =>
      [
        [t('game'), preview.entry.versionName],
        [t('level'), `${preview.entry.levelMin}-${preview.entry.levelMax}`],
        [t('shiny'), preview.entry.shiny ? t('yes') : t('no')],
        [t('egg'), preview.entry.egg ? t('yes') : t('no')],
        [
          t('metLocation'),
          preview.entry.locationName || preview.entry.context || t('blank'),
          true,
        ],
      ] satisfies Array<[string, string | number, boolean?]>,
    [preview, t],
  )

  return (
    <div className="mt-5 grid gap-4">
      <PokemonHeaderIdentity
        compact
        endAdornment={
          <button
            aria-label={t('closePreview')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-rose-400/70 text-rose-400 transition hover:bg-rose-500/10"
            type="button"
            onClick={onClear}
          >
            <X size={18} />
          </button>
        }
        slot={preview.pokemon.summary}
        suffix={t('previewSuffix')}
        t={t}
      />
      <PreviewDetails details={details} />
      <SlotDestinationPicker boxes={boxes} party={party} t={t}>
        {({ disabled, slotId }) => (
          <button
            aria-label={t('applyEncounterDraft')}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-emerald-400/80 text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled}
            type="button"
            onClick={() => void onApply(preview, slotId)}
          >
            <Check size={20} />
          </button>
        )}
      </SlotDestinationPicker>
    </div>
  )
}
