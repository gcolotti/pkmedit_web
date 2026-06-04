import type { FieldHelpContent } from '../../../components/core/focused/FieldHelpDialog/FieldHelpDialog'
import type { I18nKey, Translator } from '../../i18n/i18n/i18n'
import type { RaidHelpTopic } from '../../types/raidHelp/raidHelp'

const BULBAPEDIA_TERA_RAID_URL =
  'https://bulbapedia.bulbagarden.net/wiki/Tera_Raid'
const POKEMON_GRENINJA_2026_URL =
  'https://www.pokemon.com/us/pokemon-news/greninja-with-the-mightiest-mark-returns-to-7-star-tera-raid-battles'

export function getRaidHelpContent(
  topic: RaidHelpTopic,
  t: Translator,
): FieldHelpContent {
  const values: Record<
    RaidHelpTopic,
    {
      body: I18nKey
      example: I18nKey
      range: I18nKey
      risk: I18nKey
      sourceUrl?: string
      title: I18nKey
    }
  > = {
    areaId: {
      title: 'raidArea',
      body: 'raidHelpArea',
      range: 'raidHelpRangeUint32',
      example: 'raidHelpExampleArea',
      risk: 'raidHelpRiskLocation',
    },
    captured: {
      title: 'raidCaptured',
      body: 'raidHelpCaptured',
      range: 'raidHelpRangeBoolean',
      example: 'raidHelpExampleCaptured',
      risk: 'raidHelpRiskSevenStarState',
    },
    content: {
      title: 'raidContent',
      body: 'raidHelpContent',
      range: 'raidHelpRangeContent',
      example: 'raidHelpExampleContent',
      risk: 'raidHelpRiskContent',
      sourceUrl: BULBAPEDIA_TERA_RAID_URL,
    },
    defeated: {
      title: 'raidDefeated',
      body: 'raidHelpDefeated',
      range: 'raidHelpRangeBoolean',
      example: 'raidHelpExampleDefeated',
      risk: 'raidHelpRiskSevenStarState',
    },
    denType: {
      title: 'raidDenType',
      body: 'raidHelpDenType',
      range: 'raidHelpRangeDenType',
      example: 'raidHelpExampleDenType',
      risk: 'raidHelpRiskDenType',
      sourceUrl: 'https://www.serebii.net/swordshield/maxraidbattles.shtml',
    },
    flags: {
      title: 'raidFlags',
      body: 'raidHelpFlags',
      range: 'raidHelpRangeFlags',
      example: 'raidHelpExampleFlags',
      risk: 'raidHelpRiskFlags',
    },
    hash: {
      title: 'raidHash',
      body: 'raidHelpHash',
      range: 'raidHelpRangeHex64',
      example: 'raidHelpExampleHash',
      risk: 'raidHelpRiskHash',
      sourceUrl: 'https://www.serebii.net/swordshield/maxraidbattledens.shtml',
    },
    identifier: {
      title: 'raidIdentifier',
      body: 'raidHelpIdentifier',
      range: 'raidHelpRangeUint32',
      example: 'raidHelpExampleIdentifier',
      risk: 'raidHelpRiskIdentifier',
      sourceUrl: POKEMON_GRENINJA_2026_URL,
    },
    lotteryGroup: {
      title: 'raidLotteryGroup',
      body: 'raidHelpLottery',
      range: 'raidHelpRangeUint32',
      example: 'raidHelpExampleLottery',
      risk: 'raidHelpRiskLocation',
    },
    lp: {
      title: 'raidClaimedLp',
      body: 'raidHelpLp',
      range: 'raidHelpRangeBoolean',
      example: 'raidHelpExampleLp',
      risk: 'raidHelpRiskLp',
      sourceUrl: BULBAPEDIA_TERA_RAID_URL,
    },
    randRoll: {
      title: 'raidRandRoll',
      body: 'raidHelpRandRoll',
      range: 'raidHelpRangeRandRoll',
      example: 'raidHelpExampleRandRoll',
      risk: 'raidHelpRiskRandRoll',
    },
    seed: {
      title: 'raidSeed',
      body: 'raidHelpSeed',
      range: 'raidHelpRangeSeed',
      example: 'raidHelpExampleSeed',
      risk: 'raidHelpRiskSeed',
    },
    spawnPointId: {
      title: 'raidSpawnPoint',
      body: 'raidHelpSpawnPoint',
      range: 'raidHelpRangeUint32',
      example: 'raidHelpExampleSpawnPoint',
      risk: 'raidHelpRiskLocation',
    },
    stars: {
      title: 'raidStars',
      body: 'raidHelpStars',
      range: 'raidHelpRangeStars',
      example: 'raidHelpExampleStars',
      risk: 'raidHelpRiskStars',
    },
  }
  const help = values[topic]
  return {
    body: t(help.body),
    example: t(help.example),
    range: t(help.range),
    risk: t(help.risk),
    sourceLabel: help.sourceUrl ? t('learnMore') : undefined,
    sourceUrl: help.sourceUrl,
    title: t(help.title),
  }
}
