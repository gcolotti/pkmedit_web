import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  AbilityDetail,
  CatalogEntry,
  Language,
  MoveDetail,
} from '../../../core/types/index/index'
import type { PokemonMoves } from '../../../core/types/pokemon/pokemon'
import { MoveDetailCard } from '../MoveDetailCard/MoveDetailCard'

type SelectedMovePanelProps = {
  abilityDetailsBySlug: Map<string, AbilityDetail>
  detail: MoveDetail | null | undefined
  entry: CatalogEntry
  language: Language
  legal: boolean
  moveBasePp: number | undefined
  moves: PokemonMoves
  onMovesChange: (moves: PokemonMoves) => void
  t: Translator
}

export function SelectedMovePanel({
  abilityDetailsBySlug,
  detail,
  entry,
  language,
  legal,
  moveBasePp,
  moves,
  onMovesChange,
  t,
}: SelectedMovePanelProps) {
  function handleReplaceMoveSlot(field: 'move1' | 'move2' | 'move3' | 'move4') {
    const basePp = moveBasePp ?? entry.basePp ?? 0
    const ppUps = moves[`${field}PpUps` as keyof typeof moves]
    const maxPp = basePp + Math.floor((basePp * ppUps) / 5)
    onMovesChange({
      ...moves,
      [field]: entry.id,
      [`${field}Pp` as keyof typeof moves]: maxPp,
    })
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        {(['move1', 'move2', 'move3', 'move4'] as const).map((field, index) => (
          <button
            key={field}
            className="rounded-md border border-black/15 px-2.5 py-1 text-xs font-semibold text-stone-600 transition hover:bg-black/5 dark:border-white/15 dark:text-stone-300 dark:hover:bg-white/5"
            type="button"
            onClick={() => handleReplaceMoveSlot(field)}
          >
            {t('replaceMoveSlot', { number: index + 1 })}
          </button>
        ))}
      </div>
      <MoveDetailCard
        basePpOverride={moveBasePp}
        detail={detail}
        entry={entry}
        language={language}
        legal={legal}
        abilityDetailsBySlug={abilityDetailsBySlug}
        t={t}
      />
    </div>
  )
}
