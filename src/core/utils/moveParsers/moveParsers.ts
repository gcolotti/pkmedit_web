import type { Language, MoveDetail } from '../../types/index/index'
import {
  capitalize,
  humanizeSlug,
  numberValue,
  statLabel,
  statusLabel,
  stringValue,
} from '../moveFormatters/moveFormatters'

export type SecondaryEffect = {
  chance: string
  effect: string
}

export type SourceUrls = {
  wikidex?: string | null
  bulbapedia?: string | null
}

export function formatStructuredSecondaryEffects(
  items: Array<Record<string, unknown>> | undefined,
  language: Language,
): SecondaryEffect[] {
  if (!items?.length) return []
  return items.map((item) => ({
    chance: formatChance(item.chance),
    effect: formatStructuredSecondaryEffect(item, language),
  }))
}

function formatChance(value: unknown) {
  if (typeof value === 'number') return `${value}%`
  if (typeof value === 'string' && value.length > 0) {
    return value.endsWith('%') ? value : `${value}%`
  }
  return '-'
}

function formatStructuredSecondaryEffect(
  item: Record<string, unknown>,
  language: Language,
) {
  const kind = stringValue(item.kind)
  if (kind === 'status') {
    return capitalize(statusLabel(stringValue(item.status), language))
  }
  if (kind === 'volatile') {
    return capitalize(statusLabel(stringValue(item.effect), language))
  }
  if (kind === 'stat') {
    const stat = statLabel(stringValue(item.stat), language)
    const stages = numberValue(item.stages)
    if (stages && stages < 0) {
      return language === 'es'
        ? `Baja ${stat} ${Math.abs(stages)} nivel${Math.abs(stages) === 1 ? '' : 'es'}`
        : `Lower ${stat} by ${Math.abs(stages)} stage${Math.abs(stages) === 1 ? '' : 's'}`
    }
    if (stages && stages > 0) {
      return language === 'es'
        ? `Sube ${stat} ${stages} nivel${stages === 1 ? '' : 'es'}`
        : `Raise ${stat} by ${stages} stage${stages === 1 ? '' : 's'}`
    }
    return stat
  }
  return capitalize(humanizeSlug(stringValue(item.effect) || kind || 'effect'))
}

export function getSourceUrls(
  detail: MoveDetail | null | undefined,
): SourceUrls {
  return {
    wikidex: detail?.urls?.wikidex ?? null,
    bulbapedia: detail?.urls?.bulbapedia ?? null,
  }
}

export function extractSecondaryEffect(text: string): SecondaryEffect | null {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const patterns = [
    /\b(?:has|have)\s+(?:a|an)?\s*(\d+(?:[.,]\d+)?)\s*%\s+chance\s+to\s+([^.;]+)/i,
    /\b(\d+(?:[.,]\d+)?)\s*%\s+chance\s+to\s+([^.;]+)/i,
    /\b(?:probabilidad|posibilidad)\s+del?\s+(\d+(?:[.,]\d+)?)\s*%\s+de\s+([^.;]+)/i,
    /\btiene\s+(?:un|una)?\s*(\d+(?:[.,]\d+)?)\s*%\s+de\s+([^.;]+)/i,
    /\b(\d+(?:[.,]\d+)?)\s*%\s+de\s+(?:probabilidad\s+de\s+)?([^.;]+)/i,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (!match) continue
    return {
      chance: `${match[1].replace(',', '.')}%`,
      effect: capitalize(match[2].trim()),
    }
  }

  return null
}
