import {
  CircleDot,
  Coins,
  Disc,
  Gem,
  KeyRound,
  type LucideIcon,
  Package,
  Pill,
  Sprout,
} from 'lucide-react'

import type { ItemPocket } from '../../../core/types/index/index'

const pocketIcons: Array<{ pattern: RegExp; icon: LucideIcon }> = [
  { pattern: /medicine|healing|remedy/i, icon: Pill },
  { pattern: /ball/i, icon: CircleDot },
  { pattern: /berr/i, icon: Sprout },
  { pattern: /tm|hm|machine|record/i, icon: Disc },
  { pattern: /mega|stone/i, icon: Gem },
  { pattern: /treasure|valuable/i, icon: Coins },
  { pattern: /key/i, icon: KeyRound },
  { pattern: /item/i, icon: Package },
]

function getPocketIcon(pocket: ItemPocket) {
  const searchable = `${pocket.pocketKey} ${pocket.pocketName}`
  return (
    pocketIcons.find(({ pattern }) => pattern.test(searchable))?.icon ?? Package
  )
}

export function ItemPocketTabs({
  activeIndex,
  pockets,
  onChange,
}: {
  activeIndex: number
  pockets: ItemPocket[]
  onChange: (index: number) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 rounded-md bg-black/5 p-1.5 dark:bg-white/5">
      {pockets.map((pocket, index) => {
        const Icon = getPocketIcon(pocket)
        const isActive = index === activeIndex
        const label = `${pocket.pocketName} (${pocket.items.length})`

        return (
          <button
            key={pocket.pocketKey}
            aria-label={label}
            aria-pressed={isActive}
            className={`btn relative h-4 w-8 border-0 p-0 ${isActive ? 'btn-primary shadow-inner' : ''}`}
            title={label}
            type="button"
            onClick={() => onChange(index)}
          >
            <Icon aria-hidden="true" size={15} strokeWidth={1.3} />
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-black/10 px-1 text-center text-[0.65rem] font-black leading-5 dark:bg-white/15">
              {pocket.items.length}
            </span>
          </button>
        )
      })}
    </div>
  )
}
