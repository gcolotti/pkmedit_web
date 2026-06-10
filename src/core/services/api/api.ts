import type { Language } from '../../types/index/index'
import {
  requestBlob,
  requestJson,
  type RequestOptions,
} from '../apiHttp/apiHttp'
import { CatalogApi } from '../catalogApi/catalogApi'
import { DatabaseApi } from '../databaseApi/databaseApi'
import { ExportApi } from '../exportApi/exportApi'
import { ItemApi } from '../itemApi/itemApi'
import { PokemonApi } from '../pokemonApi/pokemonApi'
import { SaveApi } from '../saveApi/saveApi'

type Req = <T>(path: string, options?: RequestOptions) => Promise<T>
type ReqBlob = (path: string, options?: RequestOptions) => Promise<Blob>

export class ApiClient {
  readonly save: SaveApi
  readonly pokemon: PokemonApi
  readonly catalog: CatalogApi
  readonly item: ItemApi
  readonly database: DatabaseApi
  readonly export_: ExportApi

  constructor(
    private readonly getBaseUrl: () => string,
    private readonly getLanguage: () => Language,
  ) {
    const rj: Req = (path, opts) =>
      requestJson(this.getBaseUrl(), this.getLanguage(), path, opts)
    const rb: ReqBlob = (path, opts) =>
      requestBlob(this.getBaseUrl(), this.getLanguage(), path, opts)
    this.save = new SaveApi(rj)
    this.pokemon = new PokemonApi(rj)
    this.catalog = new CatalogApi(rj, this.getLanguage)
    this.item = new ItemApi(rj)
    this.database = new DatabaseApi(rj)
    this.export_ = new ExportApi(rb, rj)
  }

  getHealth = () => this.request<{ status: string }>('/api/health')
  getCapabilities = () =>
    this.request<{ pkhexCoreVersion: string }>('/api/capabilities')

  listSaves = () => this.save.listSaves()
  openSave = (path: string) => this.save.openSave(path)
  uploadAndOpenSave = (file: File) => this.save.uploadAndOpenSave(file)
  getSummary = (s: string) => this.save.getSummary(s)
  getParty = (s: string) => this.pokemon.getParty(s)
  getBoxes = (s: string) => this.pokemon.getBoxes(s)
  getPokemon = (s: string, id: string) => this.pokemon.getPokemon(s, id)
  previewPokemonUpdate = (s: string, id: string, p: unknown) =>
    this.pokemon.previewPokemonUpdate(s, id, p)
  checkDraft = (
    s: string,
    c: Parameters<PokemonApi['checkDraft']>[1],
    a: boolean,
  ) => this.pokemon.checkDraft(s, c, a)
  getTrainerInfo = (s: string) => this.pokemon.getTrainerInfo(s)
  getCatalogs = () => this.catalog.getCatalogs()
  getItemBag = (s: string) => this.item.getItemBag(s)
  getDonuts = (s: string) => this.item.getDonuts(s)
  previewDonut = (s: string, b: number[], n: number) =>
    this.item.previewDonut(s, b, n)
  getUndergroundItems = (s: string) => this.item.getUndergroundItems(s)
  getRaids = (s: string) => this.item.getRaids(s)
  searchEncounters = (
    s: string,
    d: Parameters<DatabaseApi['searchEncounters']>[1],
  ) => this.database.searchEncounters(s, d)
  previewEncounter = (
    s: string,
    q: Parameters<DatabaseApi['previewEncounter']>[1],
    r: string,
  ) => this.database.previewEncounter(s, q, r)
  searchMysteryGifts = (
    s: string,
    d: Parameters<DatabaseApi['searchMysteryGifts']>[1],
  ) => this.database.searchMysteryGifts(s, d)
  previewMysteryGift = (s: string, r: string) =>
    this.database.previewMysteryGift(s, r)
  previewMetDateFixer = (
    s: string,
    r: Parameters<DatabaseApi['previewMetDateFixer']>[1],
  ) => this.database.previewMetDateFixer(s, r)
  exportSave = (s: string, format?: 'sav' | 'zip') =>
    this.export_.exportSave(s, format)
  exportDraft = (
    s: string,
    c: Parameters<ExportApi['exportDraft']>[1],
    a: boolean,
    tu?: Parameters<ExportApi['exportDraft']>[3],
    iu?: Parameters<ExportApi['exportDraft']>[4],
    mg?: Parameters<ExportApi['exportDraft']>[5],
    pa?: Parameters<ExportApi['exportDraft']>[6],
    dd?: Parameters<ExportApi['exportDraft']>[7],
    mf?: Parameters<ExportApi['exportDraft']>[8],
    uu?: Parameters<ExportApi['exportDraft']>[9],
    ru?: Parameters<ExportApi['exportDraft']>[10],
    arr?: Parameters<ExportApi['exportDraft']>[11],
    arb?: Parameters<ExportApi['exportDraft']>[12],
    format?: 'sav' | 'zip',
  ) =>
    this.export_.exportDraft(
      s,
      c,
      a,
      tu,
      iu,
      mg,
      pa,
      dd,
      mf,
      uu,
      ru,
      arr,
      arb,
      format,
    )

  private request = <T>(path: string, options?: RequestOptions) =>
    requestJson<T>(this.getBaseUrl(), this.getLanguage(), path, options)
}
