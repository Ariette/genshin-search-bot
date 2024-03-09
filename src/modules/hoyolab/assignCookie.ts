import { parse } from 'cookie';
import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { CloudflareKV } from '../../interface';
import { GenshinClient, GameId } from '../client';
import { clientCache } from '../client/cache';
import { ErrorMessage } from '../messages';
import { CustomError, encode } from '../utils/common';
import { getOptionValue } from '../utils/getOptionValue';

declare const Cookie: CloudflareKV;

export const assignCookie = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;
  const requiredKeys = ['ltuid', 'ltoken', 'account_id', 'cookie_token'];
  const requiredKeys_v2 = ['ltuid_v2', 'ltoken_v2', 'ltmid_v2', 'cookie_token_v2', 'account_id_v2', 'account_mid_v2'];
  if (value) {
    // 쿠키로 파싱 되는지 먼저 확인
    const cookies = parse(value);
    if (typeof cookies === 'string') throw new Error();

    try {
      // 호요랩 로그인을 시도해봄
      const rawCookie = cookies[requiredKeys[0]]
        ? requiredKeys.map((key) => `${key}=${cookies[key]}`).join('; ')
        : requiredKeys_v2.map((key) => `${key}=${cookies[key]}`).join('; ');
      const client = new GenshinClient(rawCookie);
      const { list: cards } = await client.getCards();
      const card = cards.find((w) => w.game_id === GameId.GenshinImpact);

      if (!card) throw new CustomError(ErrorMessage.CANNOT_FIND_CARD_ERROR);

      // 로그인 성공시 쿠키 저장
      const encryptedCookie = await encode(rawCookie);
      await Cookie.put(key, encryptedCookie);

      // 다음 세션을 위해 캐시를 채워둠
      client.setUid(card.game_role_id);
      clientCache.set(key, client);

      return { content: `쿠키 저장 완료! - 로그인 유저 : ${card.nickname}`, flags: 64 };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      console.error(err);
      throw new Error(ErrorMessage.WRONG_COOKIE_ERROR);
    }
  } else {
    await Cookie.delete(key);
    return { content: `쿠키 삭제 완료!`, flags: 64 };
  }
};
