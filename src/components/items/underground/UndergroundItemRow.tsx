import type { I18nKey, Translator } from '../../../core/i18n/i18n'
import type { UndergroundItemEntry } from '../../../core/types/saveFeature'
import { parseClampedNumberInput } from '../../../core/utils/numberInput'

export function UndergroundItemRow({
  item,
  t,
  onChange,
}: {
  item: UndergroundItemEntry
  t: Translator
  onChange: (index: number, patch: Partial<UndergroundItemEntry>) => void
}) {
  return (
    <tr className="border-t border-black/5 odd:bg-black/[0.02] dark:border-white/5 dark:odd:bg-white/[0.03]">
      <td className="px-2 py-1 font-mono">
        {String(item.index).padStart(3, '0')}
      </td>
      <td className="px-2 py-1">{t(undergroundTypeKey(item.type))}</td>
      <td className="px-2 py-1">{item.name}</td>
      <td className="px-2 py-1">
        <input
          aria-label={t('undergroundCountFor', { name: item.name })}
          className="w-20 rounded border border-black/10 bg-white px-2 py-1 dark:border-white/10 dark:bg-white/10"
          max={item.maxCount}
          min={0}
          type="number"
          value={item.count}
          onChange={(event) =>
            onChange(item.index, {
              count: parseClampedNumberInput(event.currentTarget.value, {
                max: item.maxCount,
                min: 0,
              }),
            })
          }
        />
      </td>
      <td className="px-2 py-1">
        <input
          aria-label={`${t('new')} ${item.name}`}
          checked={item.isNew}
          type="checkbox"
          onChange={(event) =>
            onChange(item.index, { isNew: event.currentTarget.checked })
          }
        />
      </td>
      <td className="px-2 py-1">
        <input
          aria-label={`${t('favorite')} ${item.name}`}
          checked={item.favorite}
          type="checkbox"
          onChange={(event) =>
            onChange(item.index, { favorite: event.currentTarget.checked })
          }
        />
      </td>
    </tr>
  )
}

function undergroundTypeKey(type: string): I18nKey {
  if (type === 'Sphere') return 'undergroundTypeSphere'
  if (type === 'Statue') return 'undergroundTypeStatue'
  if (type === 'Pedestal') return 'undergroundTypePedestal'
  return 'undergroundTypeItem'
}
