import type { enMetDateFixer } from './enMetDateFixer'

export const jaMetDateFixer = {
  changedDates: '\u5909\u66f4\u65e5',
  current: '\u73fe\u5728',
  dateFixerQueued:
    '\u65e5\u4ed8\u4fee\u6b63\u3092\u4e88\u7d04\u3057\u307e\u3057\u305f',
  fixInvalidDates: '\u4e0d\u6b63\u306a\u65e5\u4ed8\u3092\u4fee\u6b63',
  includeParty: '\u624b\u6301\u3061\u3092\u542b\u3080',
  loading: '\u8aad\u307f\u8fbc\u307f\u4e2d...',
  metDateFixer: '\u6355\u7372\u65e5',
  noDateSuggestions:
    '\u65e5\u4ed8\u63d0\u6848\u306f\u3042\u308a\u307e\u305b\u3093',
  postGameEndDate: '\u30af\u30ea\u30a2\u5f8c\u7d42\u4e86',
  preset: '\u30d7\u30ea\u30bb\u30c3\u30c8',
  preview: '\u30d7\u30ec\u30d3\u30e5\u30fc',
  proposed: '\u63d0\u6848',
  queueChanges: '\u5909\u66f4\u3092\u4e88\u7d04',
  queued: '\u4e88\u7d04\u6e08\u307f',
  rewriteAllDates: '\u3059\u3079\u3066\u66f8\u304d\u63db\u3048',
  startDate: '\u958b\u59cb\u65e5',
  storyEndDate: '\u7269\u8a9e\u7d42\u4e86',
  trainerDates: '\u30c8\u30ec\u30fc\u30ca\u30fc\u65e5\u4ed8',
  updateTrainerDates: '\u30c8\u30ec\u30fc\u30ca\u30fc\u65e5\u4ed8',
} satisfies Record<keyof typeof enMetDateFixer, string>
