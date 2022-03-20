import { CloudflareKV } from "../../interface";
import GenshinClient from "./GenshinClient";

declare const Cookie: CloudflareKV;

export const getRedeem = async (body) => {
    const key = `${body.guild_id}/${body.member.user.id}`
    const value = body.data.options[0]?.options[0]?.value;
    const encryptedCookie = await Cookie.get<string>(key);
    if (!encryptedCookie)
      throw new Error('먼저 쿠키를 등록해주세요!');
    const client = new GenshinClient();
    await client.setCookie(encryptedCookie);
    const message = await client.getRedeem(value);
    return {content: message}
}