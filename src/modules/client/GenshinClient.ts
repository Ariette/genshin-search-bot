import { parse } from 'cookie';
import type {
  HTTPResponse,
  IGameRecordCard,
  IGenshinDailyNote,
  IGenshinRecord,
  IGenshinSpiralAbyss,
  IRedeemCode,
  IGamesList,
} from 'hoyoapi';
import { Message } from '../messages';
import { CustomError, decode, encode, qsStringify } from '../utils/common';
import { GameId, GamesEnum, GenshinRegion, LanguageEnum, SpiralAbyssScheduleEnum } from './enums';
import { CloudflareKV } from '../../interface';
import { getDS } from '../utils/getDS';

declare const Cookie: CloudflareKV;

interface IGameRecordCardList {
  list: IGameRecordCard[];
}

const BBS_API = 'https://bbs-api-os.hoyolab.com';
const ACCOUNT_API = 'https://api-account-os.hoyolab.com';
const HK4E_API = 'https://sg-hk4e-api.hoyolab.com';
// const PUBLIC_API = 'https://sg-public-api.hoyolab.com';

const DEFAULT_REFERER = 'https://act.hoyolab.com';
const GAME_RECORD_CARD_API = `${BBS_API}/game_record/card/wapi/getGameRecordCard`;
const GAME_ROLE_API = `${ACCOUNT_API}/binding/api/getUserGameRolesByLtoken`;
const GAME_RECORD_DATA_SWITCH_API = `${BBS_API}/game_record/card/wapi/changeDataSwitch`;
const GENSHIN_RECORD_DAILY_NOTE_API = `${BBS_API}/game_record/genshin/api/dailyNote`;
const GENSHIN_RECORD_INDEX_API = `${BBS_API}/game_record/genshin/api/index`;
const GENSHIN_RECORD_SPIRAL_ABYSS_API = `${BBS_API}/game_record/genshin/api/spiralAbyss`;
// const REDEEM_CLAIM_API = `${HK4E_API}/common/apicdkey/api/webExchangeCdkey`;
const REDEEM_CLAIM_BY_LTOKEN_API = `${HK4E_API}/common/apicdkey/api/webExchangeCdkeyHyl`;

export class GenshinClient {
  readonly serverType: GenshinRegion;
  readonly serverLocale: LanguageEnum;
  readonly gameType: GamesEnum;
  readonly key: string;
  readonly cookie: string;
  readonly cookies: {
    [key: string]: string;
  };

  constructor(key: string, cookie: string) {
    this.key = key;
    this.serverType = GenshinRegion.ASIA;
    this.serverLocale = LanguageEnum.KOREAN;
    this.gameType = GamesEnum.GENSHIN_IMPACT;
    this.cookie = cookie;
    this.cookies = parse(cookie);
  }

  static async saveCookie(key: string, cookie: string) {
    const encryptedCookie = await encode(cookie);
    await Cookie.put(key, encryptedCookie);
  }

  static async loadCookie(key: string) {
    const encryptedCookie = await Cookie.get<string>(key);
    if (!encryptedCookie) throw new CustomError(Message.MISSING_COOKIE_ERROR);

    return await decode(encryptedCookie);
  }

  static async deleteCookie(key: string) {
    await Cookie.delete(key);
  }

  static async fromKey(key: string) {
    const cookie = await GenshinClient.loadCookie(key);
    return new GenshinClient(key, cookie);
  }

  private async _getHttpHeaders() {
    return {
      ds: await getDS(),
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'sec-ch-ua': '"Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.46',
      'x-rpc-app_version': '1.5.0',
      'x-rpc-client_type': '5',
      'x-rpc-language': this.serverLocale,
      origin: DEFAULT_REFERER,
      referer: DEFAULT_REFERER,
      cookie: this.cookie,
    };
  }

  private async _request<T>(method: 'get' | 'post', url: string, data?: any): Promise<T> {
    const headers = await this._getHttpHeaders();
    const fetchConfig: RequestInit & { headers: Record<string, string> } = {
      method,
      headers,
    };

    if (method === 'post') {
      fetchConfig.body = JSON.stringify(data);
      fetchConfig.headers['content-type'] = 'application/json';
    }

    const query = method === 'get' && data ? `?${qsStringify(data)}` : '';
    const fetchUrl = `${url}${query}`;
    const resp = await fetch(fetchUrl, fetchConfig);

    const res: HTTPResponse = await resp.json();
    if (res.retcode !== 0 || !res.data) {
      throw {
        code: res.retcode,
        message: res.message,
      };
    }
    return res.data as T;
  }

  //#region basic APIS

  async getGameRoles() {
    return await this._request<IGamesList>('get', GAME_ROLE_API, {
      game_biz: this.gameType,
      region: this.serverType,
    });
  }

  async getCards() {
    return await this._request<IGameRecordCardList>('get', GAME_RECORD_CARD_API, {
      uid: this.cookies.ltuid ?? this.cookies.ltuid_v2, // requires hoyolab uid (not game role id)
      game_biz: this.gameType,
    });
  }

  async getRedeem(uid: string, code: string) {
    return await this._request<IRedeemCode['data']>('get', REDEEM_CLAIM_BY_LTOKEN_API, {
      region: this.serverType,
      lang: this.serverLocale.split('-')[0],
      game_biz: this.gameType,
      cdkey: code.replace(/\uFFFD/g, '').trim(),
      uid,
      t: Date.now(),
    });
  }

  async getGeneralRecord(uid: string) {
    return await this._request<IGenshinRecord>('get', GENSHIN_RECORD_INDEX_API, {
      server: this.serverType,
      lang: this.serverLocale,
      role_id: uid,
    });
  }

  async getSpiralabyssRecord(uid: string) {
    return await this._request<IGenshinSpiralAbyss>('get', GENSHIN_RECORD_SPIRAL_ABYSS_API, {
      server: this.serverType,
      role_id: uid,
      schedule_type: SpiralAbyssScheduleEnum.CURRENT,
    });
  }

  async updateGameRecordSwitch(value: boolean, switchId: number, gameId: number) {
    return await this._request<{}>('post', GAME_RECORD_DATA_SWITCH_API, {
      is_public: value,
      switch_id: switchId,
      game_id: gameId,
    });
  }

  async getDailynote(uid: string) {
    return await this._request<IGenshinDailyNote>('get', GENSHIN_RECORD_DAILY_NOTE_API, {
      server: this.serverType,
      role_id: uid,
    });
  }

  //#endregion

  //#region advanced API chain

  async fetchRealtimeRecord() {
    const { list: cards } = await this.getCards();

    // select the first account
    const card = cards.find((w) => w.game_id === GameId.GenshinImpact);
    if (!card) throw new CustomError(Message.CANNOT_FIND_CARD_ERROR);

    // 실시간 메모 기능이 꺼있을 경우 우선 활성화
    // dailyNote의 switch_id = 3
    // 원신의 game_id = 2
    // @ts-expect-error wrong switch_id type
    const dataSwitch = card.data_switches.find((w) => w.switch_id === 3);
    if (!dataSwitch?.is_public) {
      await this.updateGameRecordSwitch(true, 3, card.game_id);
      console.log('실시간 노트 활성화');
    }

    return await this.getDailynote(card.game_role_id);
  }

  async fetchUid() {
    const { list } = await this.getGameRoles();
    // select the first account
    return list[0].game_uid;
  }

  //#endregion
}
