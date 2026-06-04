import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonMain } from '../../../../core/types/pokemon/pokemon'
import { UINT32_MAX } from '../../../../core/utils/numberInput/numberInput'
import { CompactNumberField } from '../../../ui/CompactNumberField/CompactNumberField'

type Props = {
  main: PokemonMain
  onMainChange: (main: PokemonMain) => void
  t: Translator
}

export function OtMiscTechnicalData({ main, onMainChange, t }: Props) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      <CompactNumberField
        label={t('pid')}
        max={UINT32_MAX}
        validationPath="main.pid"
        value={main.pid}
        onChange={(value) => onMainChange({ ...main, pid: value })}
      />
      <CompactNumberField
        label={t('encryptionConstant')}
        max={UINT32_MAX}
        validationPath="main.encryptionConstant"
        value={main.encryptionConstant}
        onChange={(value) =>
          onMainChange({ ...main, encryptionConstant: value })
        }
      />
    </div>
  )
}
