import type { Translator } from '../../../core/i18n/i18n/i18n'
import { SegmentedToggle } from '../../ui/SegmentedToggle/SegmentedToggle'

export type DatabaseFilterTab = 'general' | 'advanced' | 'criteria' | 'settings'

export function DatabaseFilterTabs({
  active,
  onChange,
  t,
}: {
  active: DatabaseFilterTab
  onChange: (tab: DatabaseFilterTab) => void
  t: Translator
}) {
  return (
    <SegmentedToggle
      label={t('databaseFilterTabs')}
      options={[
        { value: 'general', label: t('general') },
        { value: 'advanced', label: t('advanced') },
        { value: 'criteria', label: t('criteria') },
        { value: 'settings', label: t('settings') },
      ]}
      value={active}
      onChange={onChange}
    />
  )
}
