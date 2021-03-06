import { parse } from 'cookie';
import { decode } from './common';


export default class GenshinClient {
  readonly endpoint: string;
  readonly serverType: string;
  readonly serverLocale: string;
  readonly _cache: {
    [key: string]: any
  };
  cookie?: string;
  cookies?: {
    [key: string]: string;
  }

    constructor(cookie?: string) {
        this.endpoint = 'https://bbs-api-os.hoyolab.com/game_record';
        this.serverType = 'os_asia';
        this.serverLocale = 'ko-kr';
        this._cache = {};
        
        if (cookie) {
          this.cookie = cookie;
          this.cookies = parse(cookie);
        }
    }

    async setCookie(encryptedCookie: string) {
      this.cookie = await decode(encryptedCookie);
      this.cookies = parse(this.cookie);
    }

    _qsStringify(query) {
        return Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&');
    }

    async _getDS() {
        const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt';
        const time = Math.floor(Date.now() / 1000);
        const random = Math.random().toString(36).substring(2,8);
        const msgUint8 = new TextEncoder().encode(`salt=${salt}&t=${time}&r=${random}`);;
        const hashBuffer = await crypto.subtle.digest({name: 'MD5'}, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return `${time},${random},${hashHex}`
    }

    async _getHttpHeaders() {
        return {
          DS: await this._getDS(),
          Origin: 'https://webstatic-sea.hoyolab.com',
          Referer: 'https://webstatic-sea.hoyolab.com/',
          Accept: 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'ko,en;q=0.9',
          'x-rpc-language': this.serverLocale,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
          Cookie: this.cookie,
        }
    }

    async request(method, url, data) {
        let query, body
        if (method.toLowerCase() === 'get') {
          query = data
        } else {
          body = data
        }
        const headers = await this._getHttpHeaders();
        const fetchConfig: RequestInit = {
            method,
            headers,
            // credentials: 'include',
        };
        if (body) {
            fetchConfig.body = JSON.stringify(data);
            fetchConfig.headers['content-type'] = 'application/json';
        }
        const fetchUrl = `${url.startsWith('http') ? '' : this.endpoint}${url}${query ? '?' + this._qsStringify(query) : ''}`;
        const resp = await fetch(fetchUrl, fetchConfig);
        try {
          return await resp.clone().json();
        } catch (err) {
          console.log('JSON ?????? ??????\n' + await resp.text());
          throw new Error('?????? ??????! ????????? ???????????? ????????????.');
        }
    }

    async getCard(noCache?: boolean) {
        const temp = this._cache?.getCardResult;
        if (temp && !noCache) {
          return temp;
        }

        const uid = this.cookies.ltuid;
        const data = await this.request('get', '/card/wapi/getGameRecordCard', {
          uid,
        });

        if (data.retcode !== 0 || !data.data) {
          throw {
            code: data.retcode,
            message: data.message,
          }
        }
        this._cache.getCardResult = data.data;
        return data.data;
    }

    async getRedeem(code) {
      const card = await this.getCard();
      const uid = card.list[0].game_role_id;
      const data = await this.request('get', 'https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey', {
        uid,
        region: this.serverType,
        lang: 'ko',
        cdkey: code,
        game_biz: 'hk4e_global',
      });

      if (data.retcode !== 0) {
        throw {
          code: data.retcode,
          message: data.message,
        }
      }
      return data.message;
    }

    async getGeneralRecord(noCache?: boolean) {
      const temp = this._cache?.getGeneralRecord;
      if (temp && !noCache) {
        return temp;
      }

      const card = await this.getCard();
      const uid = card.list[0].game_role_id;
      const data = await this.request('get', '/genshin/api/index', {
        server: this.serverType,
        role_id: uid,
      });

      if (data.retcode !== 0 || !data.data) {
        throw {
          code: data.retcode,
          message: data.message,
        }
      }
      this._cache.getGeneralRecord = data.data;
      return data.data;
    }

    async getSpiralabyssRecord(noCache?: boolean) {
      const temp = this._cache?.getSpiralabyssRecord;
      if (temp && !noCache) {
        return temp;
      }

      const card = await this.getCard();
      const uid = card.list[0].game_role_id;
      const data = await this.request('get', '/genshin/api/spiralAbyss', {
        server: this.serverType,
        role_id: uid,
        schedule_type: 1
      });

      if (data.retcode !== 0 || !data.data) {
        throw {
          code: data.retcode,
          message: data.message,
        }
      }
      this._cache.getSpiralabyssRecord = data.data;
      return data.data;
    }

    async getRealtimeRecord() {
      const card = await this.getCard();

      if (!card.list[0].data_switches[2].is_public) {
        // ????????? ?????? ????????? ????????? ?????? ?????? ?????????
        const resp = await this.request('post', '/card/wapi/changeDataSwitch', {
          is_public: true,
          switch_id: 3,
          game_id: card.list[0].game_id,
        });

        if (resp.retcode !== 0) {
          throw {
            code: resp.retcode,
            message: resp.message,
          }
        }
        // ?????? ??????
        card.list[0].data_switches[2].is_public = true;
        console.log('????????? ?????? ?????????');
      }

      const uid = card.list[0].game_role_id;
      const data = await this.request('get', '/genshin/api/dailyNote', {
        server: this.serverType,
        role_id: uid,
      });

      if (data.retcode !== 0 || !data.data) {
        throw {
          code: data.retcode,
          message: data.message,
        }
      }
      return data.data;
    }
}