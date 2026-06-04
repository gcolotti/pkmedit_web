import { Gift } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  EncounterDatabasePreview,
  MysteryGiftDatabasePreview,
} from '../../../core/types/database/database'
import type { BoxSummary } from '../../../core/types/index/index'
import type { PokemonSummary } from '../../../core/types/pokemon/pokemon'
import { PokemonHeaderIdentity } from '../../pokemon/PokemonHeaderIdentity/PokemonHeaderIdentity'
import { PreviewDetails } from '../../pokemon/PreviewDetails/PreviewDetails'
import { EncounterPreviewPanel } from '../encounters/EncounterPreviewPanel/EncounterPreviewPanel'
import { MysteryGiftApplyPanel } from '../mystery-gift/MysteryGiftApplyPanel/MysteryGiftApplyPanel'

export function DatabasePreviewPanel({
  boxes,
  onApplyEncounter,
  onApplyMysteryGift,
  onClearPreview,
  party,
  preview,
  t,
}: {
  boxes: BoxSummary[]
  onApplyEncounter: (
    preview: EncounterDatabasePreview,
    slotId: string,
  ) => Promise<void>
  onApplyMysteryGift: (
    preview: MysteryGiftDatabasePreview,
    slotId?: string,
  ) => Promise<void>
  onClearPreview: () => void
  party: PokemonSummary[]
  preview: EncounterDatabasePreview | MysteryGiftDatabasePreview | null
  t: Translator
}) {
  const [giftMode, setGiftMode] = useState<'card' | 'slot'>('card')
  const pokemon = preview && 'pokemon' in preview ? preview.pokemon : null

  const details = useMemo(() => {
    if (!preview) return []
    const entry = preview.entry
    return [
      [t('species'), entry.speciesName],
      [t('generation', { generation: entry.generation }), entry.versionName],
      [
        t('level'),
        'levelMin' in entry
          ? `${entry.levelMin}-${entry.levelMax}`
          : `${entry.level}`,
      ],
      [t('shiny'), entry.shiny ? t('yes') : t('no')],
    ] satisfies Array<[string, string | number, boolean?]>
  }, [preview, t])

  if (!preview) {
    return (
      <div className="mt-6 rounded-md border border-dashed border-stone-500/50 p-4 text-sm font-bold text-stone-300/80">
        {t('databasePreviewEmpty')}
      </div>
    )
  }

  if ('draft' in preview) {
    const canApplyCard = preview.entry.compatible
    const hasDestinationSlots =
      party.length > 0 || boxes.some((box) => box.slots.length > 0)
    const canApplySlot = Boolean(
      preview.pokemon && preview.replacement && hasDestinationSlots,
    )
    const applyDisabled = giftMode === 'card' ? !canApplyCard : !canApplySlot
    let cardApplyLabel = t('addMysteryGiftDraft')
    if (!canApplyCard) {
      if (preview.entry.saveLegality === 'illegal') {
        cardApplyLabel = t('incompatibleGift')
      } else if (!preview.storage.supported) {
        cardApplyLabel = t('mysteryGiftUnsupported')
      } else if (preview.storage.full) {
        cardApplyLabel = t('mysteryGiftStorageFull')
      } else {
        cardApplyLabel = t('mysteryGiftStorageUnavailable')
      }
    }
    const applyLabel =
      giftMode === 'card'
        ? cardApplyLabel
        : preview.replacement
          ? t('applyGiftToSlot')
          : t('giftHasNoPokemon')

    return (
      <div className="mt-5 grid gap-4">
        <div className="flex items-center gap-3">
          <Gift className="text-lagoon" size={28} />
          <div className="min-w-0">
            <h3 className="truncate text-xl font-black">
              {preview.entry.title}
            </h3>
            <div className="truncate text-sm font-bold text-stone-300/80">
              {preview.entry.fileName}
            </div>
          </div>
        </div>
        <PreviewDetails details={details} />
        {pokemon ? (
          <PokemonHeaderIdentity slot={pokemon.summary} t={t} />
        ) : null}
        <MysteryGiftApplyPanel
          applyDisabled={applyDisabled}
          applyLabel={applyLabel}
          boxes={boxes}
          giftMode={giftMode}
          party={party}
          preview={preview}
          setGiftMode={setGiftMode}
          t={t}
          onApply={onApplyMysteryGift}
        />
      </div>
    )
  }

  return (
    <EncounterPreviewPanel
      boxes={boxes}
      party={party}
      preview={preview}
      t={t}
      onApply={onApplyEncounter}
      onClear={onClearPreview}
    />
  )
}
