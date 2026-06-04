import type { Translator } from '../../../core/i18n/i18n'
import type { DatabaseMoveFilters } from '../../../core/types/database'
import type { CatalogEntry } from '../../../core/types/index'
import { AnyCatalogSelect } from '../../ui/catalog-select/AnyCatalogSelect'

export function MoveFilterGrid({
  moveCatalog,
  moves,
  onChange,
  t,
}: {
  moveCatalog: CatalogEntry[]
  moves: DatabaseMoveFilters
  onChange: (moves: DatabaseMoveFilters) => void
  t: Translator
}) {
  const update = (key: keyof DatabaseMoveFilters, value: number) =>
    onChange({ ...moves, [key]: value })

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(['move1', 'move2', 'move3', 'move4'] as const).map((key, index) => (
        <AnyCatalogSelect
          key={key}
          entries={moveCatalog}
          label={t('move', { number: index + 1 })}
          t={t}
          value={moves[key]}
          onChange={(value) => update(key, value)}
        />
      ))}
    </div>
  )
}
