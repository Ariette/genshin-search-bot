import { parse } from 'cookie';
import GenshinClient from './GenshinClient';
import { encode } from './common';
import { CloudflareKV } from '../../interface';

declare const Cookie: CloudflareKV;

export const assignCookie = async (body) => {
    const key = `${body.guild_id}/${body.member.user.id}`
    const value = body.data.options[0]?.options[0]?.value;
    const requiredKeys = ['ltuid', 'ltoken', 'account_id', 'cookie_token'];
    if (value) {
        // 쿠키로 파싱 되는지 먼저 확인
        const cookies = parse(value);
        if (typeof cookies === 'string') throw new Error('쿠키 형식이 잘못되었습니다.');
        if (requiredKeys.some(key => !cookies[key])) throw new Error('쿠키 형식이 잘못되었습니다. 다시 입력해주세요.');
        
        try {
          // 호요랩 로그인을 시도해봄
          const rawCookie = requiredKeys.map(key => `${key}=${cookies[key]}`).join('; ');
          const client = new GenshinClient(rawCookie);
          const data = await client.getCard();

          // 로그인 성공시 쿠키 저장
          const encryptedCookie = await encode(rawCookie);
          await Cookie.put(key, encryptedCookie);
          return {content: `쿠키 저장 완료! - 로그인 유저 : ${data.list[0].nickname}`, flags: 64}
        } catch (err) {
          throw new Error('쿠키 값이 잘못되었습니다. 다시 입력해주세요.');
        }
    } else {
        await Cookie.delete(key);
        return {content: `쿠키 삭제 완료!`, flags: 64}
    }
}