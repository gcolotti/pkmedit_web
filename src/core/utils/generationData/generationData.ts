import { localizedText } from '../../i18n/i18n/i18n'
import type { Language, MoveDetail } from '../../types/index/index'
import { publicAssetUrl } from '../publicAssetUrl/publicAssetUrl'

export type GenerationEffectChange = {
  generation: number
  text: string
}

export type CatKey =
  | 'moveCategoryStatus'
  | 'moveCategoryPhysical'
  | 'moveCategorySpecial'

export const CAT_ICONS: Record<number, [string, CatKey]> = {
  0: [publicAssetUrl('/assets/moves_category/state.png'), 'moveCategoryStatus'],
  1: [
    publicAssetUrl('/assets/moves_category/physical.png'),
    'moveCategoryPhysical',
  ],
  2: [
    publicAssetUrl('/assets/moves_category/special.png'),
    'moveCategorySpecial',
  ],
}

export function getMaxGeneration(detail: MoveDetail | null | undefined) {
  if (!detail?.generations) return 9
  return Math.max(
    1,
    ...Object.keys(detail.generations)
      .map(Number)
      .filter((g) => !Number.isNaN(g)),
  )
}

export function getIntroducedGeneration(
  detail: MoveDetail | null | undefined,
): number {
  if (!detail?.current?.availability) return 1
  return detail.current.availability.introducedGeneration ?? 1
}

export function getAvailableGenerationNumbers(
  detail: MoveDetail | null | undefined,
): number[] {
  const introduced = getIntroducedGeneration(detail)
  const maxGeneration = getMaxGeneration(detail)
  const unavailable =
    detail?.current?.availability?.unavailableInGenerations ?? []
  const generations: number[] = []
  for (let g = introduced; g <= maxGeneration; g++) {
    if (!unavailable.includes(g)) generations.push(g)
  }
  return generations
}

export function getMoveEffectChanges(
  detail: MoveDetail | null | undefined,
  language: Language,
): GenerationEffectChange[] {
  if (!detail?.generations) return []
  const changes: GenerationEffectChange[] = []
  for (const [genKey, entry] of Object.entries(detail.generations)) {
    const text = localizedText(entry.effectChanges?.description, language)
    const cleaned = text ? stripContestParagraphs(text) : null
    if (cleaned) {
      changes.push({ generation: Number(genKey), text: cleaned })
    }
  }
  return changes.sort((a, b) => b.generation - a.generation)
}

// Per-gen change notes sometimes include paragraphs about Pokémon Contests
// or Contest Spectaculars (Gen 3-5 feature). The data is kept in the JSON
// for reference but hidden in the UI — we only surface in-battle effects.
function stripContestParagraphs(text: string): string | null {
  const kept = text
    .split(/\n\n+/)
    .filter((p) => !/contest/i.test(p))
    .join('\n\n')
    .trim()
  return kept || null
}
