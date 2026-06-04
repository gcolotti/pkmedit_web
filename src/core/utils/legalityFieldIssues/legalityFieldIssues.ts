import type { LegalityReport } from '../../types/index/index'

type IssueRule = {
  paths: string[]
  terms: string[]
}

const rules: IssueRule[] = [
  { paths: ['species', 'form'], terms: ['species', 'form', 'mega'] },
  { paths: ['level', 'main.exp'], terms: ['level', 'experience', 'exp'] },
  {
    paths: ['shiny', 'main.pid', 'main.encryptionConstant'],
    terms: ['shiny', 'pid', 'encryption', 'xor'],
  },
  { paths: ['nature', 'main.statNature'], terms: ['nature', 'mint'] },
  { paths: ['ability', 'abilityNumber'], terms: ['ability'] },
  { paths: ['heldItem'], terms: ['item', 'held'] },
  { paths: ['ball'], terms: ['ball'] },
  { paths: ['ivs'], terms: ['iv', 'hyper'] },
  { paths: ['evs'], terms: ['ev'] },
  { paths: ['moves'], terms: ['move', 'relearn', 'pp'] },
  {
    paths: [
      'origin.metLevel',
      'origin.metLocation',
      'origin.version',
      'origin.metDate',
    ],
    terms: ['met', 'encounter', 'location', 'origin', 'date', 'version'],
  },
  {
    paths: [
      'origin.eggLocation',
      'origin.eggMetDate',
      'origin.wasEgg',
      'origin.isEgg',
    ],
    terms: ['egg', 'hatch'],
  },
  {
    paths: ['trainer'],
    terms: ['trainer', 'ot', 'ht', 'friendship', 'handler', 'language'],
  },
  { paths: ['cosmetic.ribbons'], terms: ['ribbon', 'mark'] },
  {
    paths: ['cosmetic'],
    terms: ['height', 'weight', 'scale', 'contest', 'alpha', 'home', 'tracker'],
  },
]

export function getIllegalFieldPaths(report: LegalityReport | null) {
  if (!report || report.legal) return new Set<string>()

  const paths = new Set<string>()
  const invalidText = report.checks
    .filter((check) => !check.valid)
    .map((check) =>
      `${check.identifier} ${check.code} ${check.message}`.toLowerCase(),
    )

  for (const text of invalidText) {
    for (const rule of rules) {
      if (rule.terms.some((term) => text.includes(term))) {
        for (const path of rule.paths) paths.add(path)
      }
    }
  }

  return paths
}
