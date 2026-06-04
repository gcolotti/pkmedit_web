import type { Translator } from '../../core/i18n/i18n'
import type { TrainerMapInfo } from '../../core/types/trainer'
import { DecimalField } from '../ui/DecimalField'
import { TrainerSection } from './TrainerSection'

export function TrainerMapPositionSection({
  map,
  t,
  onChange,
}: {
  map: TrainerMapInfo
  t: Translator
  onChange: (map: TrainerMapInfo) => void
}) {
  return (
    <TrainerSection title={t('mapPosition')}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <DecimalField
          label={t('xCoordinate')}
          value={map.x}
          onChange={(x) => onChange({ ...map, x })}
        />
        <DecimalField
          label={t('zCoordinate')}
          value={map.z}
          onChange={(z) => onChange({ ...map, z })}
        />
        <DecimalField
          label={t('yCoordinate')}
          value={map.y}
          onChange={(y) => onChange({ ...map, y })}
        />
        <DecimalField
          label={t('rotation')}
          value={map.rotation}
          onChange={(rotation) => onChange({ ...map, rotation })}
        />
        <label className="grid gap-1.5 sm:col-span-4">
          <span className="label text-[0.65rem]">{t('map')}</span>
          <input
            className="field"
            maxLength={32}
            value={map.map}
            onChange={(event) =>
              onChange({ ...map, map: event.currentTarget.value })
            }
          />
        </label>
      </div>
    </TrainerSection>
  )
}
