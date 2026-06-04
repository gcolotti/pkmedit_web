import { Database, SendToBack } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n'
import type { MysteryGiftDatabasePreview } from '../../../core/types/database'
import type { BoxSummary } from '../../../core/types/index'
import type { PokemonSummary } from '../../../core/types/pokemon'
import { SegmentedToggle } from '../../ui/SegmentedToggle'
import { SlotDestinationPicker } from '../SlotDestinationPicker'

export function MysteryGiftApplyPanel({
  applyDisabled,
  applyLabel,
  boxes,
  giftMode,
  onApply,
  party,
  preview,
  setGiftMode,
  t,
}: {
  applyDisabled: boolean
  applyLabel: string
  boxes: BoxSummary[]
  giftMode: 'card' | 'slot'
  onApply: (
    preview: MysteryGiftDatabasePreview,
    slotId?: string,
  ) => Promise<void>
  party: PokemonSummary[]
  preview: MysteryGiftDatabasePreview
  setGiftMode: (mode: 'card' | 'slot') => void
  t: Translator
}) {
  return (
    <>
      <div className="surface-muted grid gap-3 rounded-md p-3">
        <SegmentedToggle
          label={t('mysteryGiftApplyMode')}
          options={[
            { value: 'card', label: t('wonderCard') },
            { value: 'slot', label: t('slot') },
          ]}
          value={giftMode}
          onChange={setGiftMode}
        />
        {giftMode === 'slot' ? (
          <SlotDestinationPicker
            boxes={boxes}
            party={party}
            surface={false}
            t={t}
          >
            {({ disabled, slotId }) => (
              <button
                className="btn btn-primary h-10 shrink-0 px-3"
                disabled={applyDisabled || disabled}
                type="button"
                onClick={() => void onApply(preview, slotId)}
              >
                <SendToBack size={18} />
                {applyLabel}
              </button>
            )}
          </SlotDestinationPicker>
        ) : null}
      </div>
      {giftMode === 'card' ? (
        <button
          className="btn btn-primary w-full"
          disabled={applyDisabled}
          type="button"
          onClick={() => void onApply(preview)}
        >
          <Database size={18} />
          {applyLabel}
        </button>
      ) : null}
    </>
  )
}
