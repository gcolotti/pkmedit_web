import type { Translator } from '../../i18n/i18n/i18n'
import type { RaidListResponse } from '../saveFeature/saveFeature'

export type RaidSelection =
  | { groupKey: string; index: number; kind: 'raid' }
  | { index: number; kind: 'sevenStar' }

export type RaidFocusedEditorPageProps = {
  data: RaidListResponse | null
  sessionId: string | null
  status: string
  t: Translator
  onBack: () => void
  onChange: (data: RaidListResponse) => void
  onLoad: (sessionId: string) => void
}
