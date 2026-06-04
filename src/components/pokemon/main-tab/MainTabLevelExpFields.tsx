import type { Translator } from '../../../core/i18n/i18n'
import type { PokemonDetail } from '../../../core/types/index'
import { expForLevel } from '../../../core/utils/expCalc'
import { UINT32_MAX } from '../../../core/utils/numberInput'
import { NumberField } from '../../ui/NumberField'

type Props = {
  draft: PokemonDetail
  t: Translator
  update: (mutate: (copy: PokemonDetail) => void) => void
}

export function MainTabLevelExpFields({ draft, t, update }: Props) {
  return (
    <>
      <NumberField
        label={t('level')}
        max={100}
        min={1}
        validationPath="level"
        value={draft.summary.level}
        onChange={(value) =>
          update((copy) => {
            copy.summary.level = value
            copy.main.exp = expForLevel(value, copy.growthRate)
          })
        }
      />
      <NumberField
        disabled
        label={t('exp')}
        max={UINT32_MAX}
        validationPath="main.exp"
        value={draft.main.exp}
        onChange={() => {}}
      />
    </>
  )
}
