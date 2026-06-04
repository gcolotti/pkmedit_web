import type { Translator } from '../../core/i18n/i18n'
import { BooleanField } from '../ui/BooleanField'

export function PokemonStatusFlags({
  isEgg,
  infected,
  cured,
  t,
  onIsEggChange,
  onInfectedChange,
  onCuredChange,
}: {
  isEgg: boolean
  infected: boolean
  cured: boolean
  t: Translator
  onIsEggChange: (v: boolean) => void
  onInfectedChange: (v: boolean) => void
  onCuredChange: (v: boolean) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:col-span-2 sm:grid-cols-3">
      <BooleanField
        label={t('isEgg')}
        validationPath="origin.isEgg"
        value={isEgg}
        onChange={onIsEggChange}
      />
      <BooleanField
        label={t('infected')}
        validationPath="main.infected"
        value={infected}
        onChange={onInfectedChange}
      />
      <BooleanField
        label={t('cured')}
        validationPath="main.cured"
        value={cured}
        onChange={onCuredChange}
      />
    </div>
  )
}
