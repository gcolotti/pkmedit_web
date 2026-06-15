import {
  Circle,
  Diamond,
  Heart,
  type LucideIcon,
  Square,
  Star,
  Triangle,
} from 'lucide-react'

import type { I18nKey, Translator } from '../../../../core/i18n/i18n/i18n'
import { MarkingToggle } from '../MarkingToggle/MarkingToggle'

// PKHeX marking order. Gen 3-5 saves expose 4, Gen 6+ expose 6 — we iterate the
// array the backend sends rather than assuming a fixed count.
const SHAPES: { icon: LucideIcon; key: I18nKey }[] = [
  { icon: Circle, key: 'markingCircle' },
  { icon: Triangle, key: 'markingTriangle' },
  { icon: Square, key: 'markingSquare' },
  { icon: Heart, key: 'markingHeart' },
  { icon: Star, key: 'markingStar' },
  { icon: Diamond, key: 'markingDiamond' },
]

export function DetailsMarkings({
  markings,
  onChange,
  t,
}: {
  markings: number[]
  onChange: (markings: number[]) => void
  t: Translator
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {markings.map((value, index) => {
        const shape = SHAPES[index]
        return (
          <MarkingToggle
            key={index}
            Icon={shape?.icon ?? Circle}
            label={shape ? t(shape.key) : t('marking', { number: index + 1 })}
            value={value}
            onChange={(next) =>
              onChange(markings.map((item, i) => (i === index ? next : item)))
            }
          />
        )
      })}
    </div>
  )
}
