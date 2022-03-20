import GenshinClient from "./GenshinClient";
import { dnEmbed, giEmbed, saEmbed } from "../../embeds";
import { CloudflareKV } from "../../interface";

declare const Cookie: CloudflareKV;

export const getRecord = async (body) => {
    const key = `${body.guild_id}/${body.member.user.id}`
    const value = body.data.options[0]?.options[0]?.value;
    const encryptedCookie = await Cookie.get<string>(key);
    if (!encryptedCookie)
      throw new Error('먼저 쿠키를 등록해주세요!');
    const client = new GenshinClient();
    await client.setCookie(encryptedCookie);
    if (value === 'general') {
      const data = await client.getGeneralRecord();
      const embeds = giEmbed(data);
      return {embeds: embeds}
    } else if (value === 'spiralabyss') {
      const data = await client.getSpiralabyssRecord();
      if (data.floors.length === 0) {
        return {content: "이번 시즌에 나선 비경에 도전하지 않았습니다."}
      }
      const embed = saEmbed(data);
      return {embeds: [embed]}
    } else {
      const data = await client.getRealtimeRecord();
      const embed = dnEmbed(data);
      return {embeds: [embed]}
    }
}