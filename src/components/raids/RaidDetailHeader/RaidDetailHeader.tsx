import type { ReactNode } from 'react'

import { RaidBadge } from '../RaidBadge/RaidBadge'

export function RaidDetailHeader({
  badges,
  title,
}: {
  badges: Array<string | null>
  title: string
}): ReactNode {
  const visibleBadges = badges.filter((badge): badge is string =>
    Boolean(badge),
  )
  return (
    <div className="border-b border-black/10 pb-4 dark:border-white/10">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {visibleBadges.map((badge) => (
          <RaidBadge key={badge}>{badge}</RaidBadge>
        ))}
      </div>
    </div>
  )
}
