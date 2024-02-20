import { parse } from 'cookie';
import type {
  HTTPResponse,
  IGameRecordCard,
  IGenshinDailyNote,
  IGenshinRecord,
  IGenshinSpiralAbyss,
  IRedeemCode,
} from 'hoyoapi';
import { ErrorMessage } from '../messages';
import { CustomError, decode } from '../utils/common';
import { GameId, GamesEnum, GenshinRegion, LanguageEnum, SpiralAbyssScheduleEnum } from './enums';

interface IGameRecordCardList {
  list: IGameRecordCard[];
}

const BBS_API = 'https://bbs-api-os.hoyolab.com';
// const ACCOUNT_API = 'https://api-account-os.hoyolab.com';
const HK4E_API = 'https://sg-hk4e-api.hoyolab.com';
// const PUBLIC_API = 'https://sg-public-api.hoyolab.com';

const DEFAULT_REFERER = 'https://act.hoyolab.com';
const GAME_RECORD_CARD_API = `${BBS_API}/game_record/card/wapi/getGameRecordCard`;
const GAME_RECORD_DATA_SWITCH_API = `${BBS_API}/game_record/card/wapi/changeDataSwitch`;
const GENSHIN_RECORD_DAILY_NOTE_API = `${BBS_API}/game_record/genshin/api/dailyNote`;
const GENSHIN_RECORD_INDEX_API = `${BBS_API}/game_record/genshin/api/index`;
const GENSHIN_RECORD_SPIRAL_ABYSS_API = `${BBS_API}/game_record/genshin/api/spiralAbyss`;
const REDEEM_CLAIM_API = `${HK4E_API}/common/apicdkey/api/webExchangeCdkey`;

export class GenshinClient {
  readonly serverType: GenshinRegion;
  readonly serverLocale: LanguageEnum;
  readonly gameType: GamesEnum;
  readonly _cache: Map<string, any>;
  cookie?: string;
  cookies?: {
    [key: string]: string;
  };
  uid?: string;

  constructor(cookie?: string) {
    this.serverType = GenshinRegion.ASIA;
    this.serverLocale = LanguageEnum.KOREAN;
    this.gameType = GamesEnum.GENSHIN_IMPACT;
    this._cache = new Map();

    if (cookie) {
      this.cookie = cookie;
      this.cookies = parse(cookie);
    }
  }

  async setCookie(encryptedCookie: string) {
    this.cookie = await decode(encryptedCookie);
    this.cookies = parse(this.cookie);
  }

  async setUid(uid: string) {
    this.uid = uid;
  }

  async fetchUid() {
    const { list: cards } = await this.getCards();
    const card = cards.find((w) => w.game_id === GameId.GenshinImpact);

    if (!card) throw new CustomError(ErrorMessage.CANNOT_FIND_CARD_ERROR);

    this.uid = card.game_role_id;
    return this.uid;
  }

  _qsStringify(query: Record<string, string>) {
    return Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
  }

  async _getDS() {
    const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt';
    const time = Math.floor(Date.now() / 1000);
    const random = Math.random().toString(36).substring(2, 8);
    const msgUint8 = new TextEncoder().encode(`salt=${salt}&t=${time}&r=${random}`);
    const hashBuffer = await crypto.subtle.digest({ name: 'MD5' }, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return `${time},${random},${hashHex}`;
  }

  async _getHttpHeaders() {
    return {
      DS: await this._getDS(),
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
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
      'x-rpc-language': 'en-us',
      Origin: DEFAULT_REFERER,
      Referer: DEFAULT_REFERER,
      Cookie: this.cookie!,
    };
  }

  async request<T>(method: 'get' | 'post', url: string, data?: any): Promise<T> {
    const headers = await this._getHttpHeaders();
    const fetchConfig: RequestInit & { headers: Record<string, string> } = {
      method,
      headers,
    };

    if (method === 'post') {
      fetchConfig.body = JSON.stringify(data);
      fetchConfig.headers['content-type'] = 'application/json';
    }

    const query = method === 'get' && data ? `?${this._qsStringify(data)}` : '';
    const fetchUrl = `${url}${query}`;
    const resp = await fetch(fetchUrl, fetchConfig);

    try {
      return await resp.clone().json();
    } catch (err) {
      console.log('JSON 파싱 실패\n' + (await resp.text()));
      throw new CustomError(ErrorMessage.JSON_PARSE_ERROR);
    }
  }

  async getCards(noCache?: boolean): Promise<IGameRecordCardList> {
    const temp = this._cache.get('getCardResult');
    if (temp && !noCache) {
      return temp;
    }

    if (!this.cookies) {
      throw new CustomError(ErrorMessage.MISSING_COOKIE_ERROR);
    }

    const uid = this.cookies.ltuid ?? this.cookies.ltuid_v2;
    const data = await this.request<HTTPResponse>('get', GAME_RECORD_CARD_API, {
      uid,
    });

    if (data.retcode !== 0 || !data.data) {
      throw {
        code: data.retcode,
        message: data.message,
      };
    }
    this._cache.set('getCardResult', data.data);
    return data.data as IGameRecordCardList;
  }

  async getRedeem(code: string) {
    const uid = this.uid ?? (await this.fetchUid());
    const data = await this.request<IRedeemCode>('get', REDEEM_CLAIM_API, {
      region: this.serverType,
      lang: this.serverLocale.split('-')[0],
      sLangKey: this.serverLocale,
      game_biz: this.gameType,
      cdkey: code.replace(/\uFFFD/g, '').trim(),
      uid,
    });

    if (data.retcode !== 0) {
      throw {
        code: data.retcode,
        message: data.message,
      };
    }
    return data;
  }

  async getGeneralRecord(noCache?: boolean): Promise<IGenshinRecord> {
    const temp = this._cache.get('getGeneralRecord');
    if (temp && !noCache) {
      return temp;
    }

    const uid = this.uid ?? (await this.fetchUid());
    const data = await this.request<HTTPResponse>('get', GENSHIN_RECORD_INDEX_API, {
      server: this.serverType,
      lang: this.serverLocale,
      role_id: uid,
    });

    if (data.retcode !== 0 || !data.data) {
      throw {
        code: data.retcode,
        message: data.message,
      };
    }
    this._cache.set('getGeneralRecord', data.data);
    return data.data as IGenshinRecord;
  }

  async getSpiralabyssRecord(noCache?: boolean): Promise<IGenshinSpiralAbyss> {
    const temp = this._cache.get('getSpiralabyssRecord');
    if (temp && !noCache) {
      return temp;
    }

    const uid = this.uid ?? (await this.fetchUid());
    const data = await this.request<HTTPResponse>('get', GENSHIN_RECORD_SPIRAL_ABYSS_API, {
      server: this.serverType,
      role_id: uid,
      schedule_type: SpiralAbyssScheduleEnum.CURRENT,
    });

    if (data.retcode !== 0 || !data.data) {
      throw {
        code: data.retcode,
        message: data.message,
      };
    }
    this._cache.set('getSpiralabyssRecord', data.data);
    return data.data as IGenshinSpiralAbyss;
  }

  async getRealtimeRecord(): Promise<IGenshinDailyNote> {
    const { list: cards } = await this.getCards();
    const card = cards.find((w) => w.game_id === GameId.GenshinImpact);

    if (!card) throw new CustomError(ErrorMessage.CANNOT_FIND_CARD_ERROR);

    // dailyNote switch id = 3
    // @ts-expect-error wrong switch_id type
    const dataSwitch = card.data_switches.find((w) => w.switch_id === 3)!;
    if (!dataSwitch?.is_public) {
      // 실시간 메모 기능이 꺼있을 경우 우선 활성화
      const resp = await this.request<HTTPResponse>('post', GAME_RECORD_DATA_SWITCH_API, {
        is_public: true,
        switch_id: 3,
        game_id: card.game_id,
      });

      if (resp.retcode !== 0) {
        throw {
          code: resp.retcode,
          message: resp.message,
        };
      }
      // 캐시 갱신
      dataSwitch.is_public = true;
      console.log('실시간 노트 활성화');
    }

    const uid = card.game_role_id;
    const data = await this.request<HTTPResponse>('get', GENSHIN_RECORD_DAILY_NOTE_API, {
      server: this.serverType,
      role_id: uid,
    });

    if (data.retcode !== 0 || !data.data) {
      throw {
        code: data.retcode,
        message: data.message,
      };
    }
    return data.data as IGenshinDailyNote;
  }
}
