import type { I18nKey } from '../i18n/i18n'

export type SevenStarEventInfo = {
  firstRun: string
  pokemon: string
  sourceUrl: string
  teraTypeKey: I18nKey
}

const BULBAPEDIA_TERA_RAID_URL =
  'https://bulbapedia.bulbagarden.net/wiki/Tera_Raid'
const POKEMON_GRENINJA_2026_URL =
  'https://www.pokemon.com/us/pokemon-news/greninja-with-the-mightiest-mark-returns-to-7-star-tera-raid-battles'

const SEVEN_STAR_EVENT_DEFINITIONS = [
  ['20221202', 'Charizard', 'typeDragon'],
  ['20221216', 'Charizard', 'typeDragon'],
  ['20221230', 'Cinderace', 'typeFighting'],
  ['20230113', 'Cinderace', 'typeFighting'],
  ['20230127', 'Greninja', 'typePoison', POKEMON_GRENINJA_2026_URL],
  ['20230210', 'Greninja', 'typePoison', POKEMON_GRENINJA_2026_URL],
  ['20230224', 'Pikachu', 'typeWater'],
  ['20230317', 'Decidueye', 'typeFlying'],
  ['20230324', 'Decidueye', 'typeFlying'],
  ['20230331', 'Samurott', 'typeBug'],
  ['20230407', 'Samurott', 'typeBug'],
  ['20230414', 'Typhlosion', 'typeGhost'],
  ['20230421', 'Typhlosion', 'typeGhost'],
  ['20230428', 'Inteleon', 'typeIce'],
  ['20230505', 'Inteleon', 'typeIce'],
  ['20230512', 'Chesnaught', 'typeRock'],
  ['20230616', 'Chesnaught', 'typeRock'],
  ['20230707', 'Delphox', 'typeFairy'],
  ['20230714', 'Delphox', 'typeFairy'],
  ['20230728', 'Rillaboom', 'typeNormal'],
  ['20230804', 'Rillaboom', 'typeNormal'],
  ['20230901', 'Mewtwo', 'typePsychic'],
  ['20231006', 'Hisuian Decidueye', 'typeGrass'],
  ['20231013', 'Hisuian Decidueye', 'typeGrass'],
  ['20231103', 'Hisuian Typhlosion', 'typeFire'],
  ['20231110', 'Hisuian Typhlosion', 'typeFire'],
  ['20231117', 'Eevee', 'typeNormal'],
  ['20231124', 'Hisuian Samurott', 'typeWater'],
  ['20231201', 'Hisuian Samurott', 'typeWater'],
  ['20231222', 'Iron Bundle', 'typeIce'],
  ['20240112', 'Blaziken', 'typeFlying'],
  ['20240119', 'Blaziken', 'typeFlying'],
  ['20240202', 'Empoleon', 'typeIce'],
  ['20240209', 'Empoleon', 'typeIce'],
  ['20240228', 'Venusaur', 'typeGround'],
  ['20240306', 'Blastoise', 'typeSteel'],
  ['20240313', 'Charizard', 'typeDragon'],
  ['20240405', 'Meganium', 'typePsychic'],
  ['20240412', 'Meganium', 'typePsychic'],
  ['20240510', 'Primarina', 'typeFairy'],
  ['20240517', 'Primarina', 'typeFairy'],
  ['20240531', 'Swampert', 'typePoison'],
  ['20240607', 'Swampert', 'typePoison'],
  ['20240614', 'Emboar', 'typeElectric'],
  ['20240621', 'Emboar', 'typeElectric'],
  ['20240628', 'Sceptile', 'typeDragon'],
  ['20240705', 'Sceptile', 'typeDragon'],
  ['20240712', 'Pikachu', 'typeWater'],
  ['20240726', 'Dondozo', 'typeWater'],
  ['20240823', 'Dragonite', 'typeNormal'],
  ['20240906', 'Incineroar', 'typeDark'],
  ['20240913', 'Incineroar', 'typeDark'],
  ['20240920', 'Serperior', 'typeGrass'],
  ['20240927', 'Serperior', 'typeGrass'],
  ['20241004', 'Infernape', 'typeRock'],
  ['20241011', 'Infernape', 'typeRock'],
  ['20241101', 'Feraligatr', 'typeDark'],
  ['20241108', 'Feraligatr', 'typeDark'],
  ['20241115', 'Torterra', 'typeGround'],
  ['20241122', 'Torterra', 'typeGround'],
  ['20250228', 'Meowscarada', 'typeGrass'],
  ['20250307', 'Skeledirge', 'typeFire'],
  ['20250314', 'Quaquaval', 'typeWater'],
  ['20250328', 'Tyranitar', 'typeGhost'],
  ['20250404', 'Tyranitar', 'typeGhost'],
  ['20250418', 'Salamence', 'typeFlying'],
  ['20250425', 'Salamence', 'typeFlying'],
  ['20250509', 'Metagross', 'typeSteel'],
  ['20250512', 'Metagross', 'typeSteel'],
  ['20250523', 'Garchomp', 'typeGround'],
  ['20250530', 'Garchomp', 'typeGround'],
  ['20250605', 'Porygon2', 'typeNormal'],
  ['20250620', 'Baxcalibur', 'typeIce'],
  ['20250627', 'Baxcalibur', 'typeIce'],
  ['20250711', 'Kommo-o', 'typeFighting'],
  ['20250718', 'Kommo-o', 'typeFighting'],
  ['20251003', 'Roaring Moon / Iron Valiant', 'typeUnknown'],
  ['20251107', 'Hydreigon', 'typePoison'],
  ['20251114', 'Hydreigon', 'typePoison'],
  ['20251121', 'Goodra', 'typeWater'],
  ['20251128', 'Goodra', 'typeWater'],
  ['20251205', 'Dragapult', 'typeDragon'],
  ['20251212', 'Dragapult', 'typeDragon'],
  ['20260109', 'Venusaur', 'typeGround'],
  ['20260116', 'Charizard', 'typeDragon'],
  ['20260123', 'Blastoise', 'typeSteel'],
  ['20260130', 'Meganium', 'typePsychic'],
  ['20260206', 'Typhlosion', 'typeGhost'],
  ['20260213', 'Feraligatr', 'typeDark'],
  ['20260220', 'Sceptile', 'typeDragon'],
  ['20260227', 'Blaziken', 'typeFlying'],
  ['20260306', 'Swampert', 'typePoison'],
  ['20260313', 'Torterra', 'typeGround'],
  ['20260320', 'Infernape', 'typeRock'],
  ['20260327', 'Empoleon', 'typeIce'],
  ['20260403', 'Serperior', 'typeGrass'],
  ['20260410', 'Emboar', 'typeElectric'],
  ['20260507', 'Greninja', 'typePoison', POKEMON_GRENINJA_2026_URL],
  ['20260515', 'Decidueye', 'typePoison'],
] as const

const SEVEN_STAR_EVENTS: Record<number, SevenStarEventInfo> =
  Object.fromEntries(
    SEVEN_STAR_EVENT_DEFINITIONS.map(
      ([identifier, pokemon, teraTypeKey, sourceUrl]) => [
        Number(identifier),
        {
          firstRun: `${identifier.slice(0, 4)}-${identifier.slice(4, 6)}-${identifier.slice(6, 8)}`,
          pokemon,
          sourceUrl: sourceUrl ?? BULBAPEDIA_TERA_RAID_URL,
          teraTypeKey,
        },
      ],
    ),
  )

export function getSevenStarEvent(identifier: number) {
  return SEVEN_STAR_EVENTS[identifier] ?? null
}
