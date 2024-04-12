import { parse } from 'cookie';
import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { GenshinClient } from '../client';
import { Message } from '../messages';
import { CustomError } from '../utils/common';
import { getOptionValue } from '../utils/getOptionValue';

const requiredKeys = ['ltuid', 'ltoken', 'account_id', 'cookie_token'];
const requiredKeys_v2 = ['ltuid_v2', 'ltoken_v2', 'ltmid_v2', 'cookie_token_v2', 'account_id_v2', 'account_mid_v2'];

export const assignCookie = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;

  // 쿠키 저장
  if (value) {
    // 쿠키로 파싱 되는지 먼저 확인
    const cookies = parse(value);
    if (typeof cookies === 'string') throw new Error();

    try {
      // 호요랩 로그인을 시도해봄
      const rawCookie = cookies[requiredKeys[0]]
        ? requiredKeys.map((key) => `${key}=${cookies[key]}`).join(';')
        : requiredKeys_v2.map((key) => `${key}=${cookies[key]}`).join(';');
      const client = new GenshinClient(key, rawCookie);
      const {
        list: [role],
      } = await client.getGameRoles();

      // 로그인 성공시 쿠키 저장
      await GenshinClient.saveCookie(key, rawCookie);
      return { content: `쿠키 저장 완료! - 로그인 유저 : ${role.nickname}`, flags: 64 };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      console.error(err);
      throw new Error(Message.WRONG_COOKIE_ERROR);
    }
  } else {
    // 쿠키 삭제
    await GenshinClient.deleteCookie(key);
    return { content: `쿠키 삭제 완료!`, flags: 64 };
  }
};
