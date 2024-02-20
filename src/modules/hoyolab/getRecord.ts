import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { dnEmbed, giEmbed, saEmbed } from '../../embeds';
import { CloudflareKV } from '../../interface';
import { getClient } from '../client';
import { ErrorMessage } from '../messages';
import { CustomError } from '../utils/common';
import { getOptionValue } from '../utils/getOptionValue';

declare const Cookie: CloudflareKV;

export const getRecord = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!);

  const encryptedCookie = await Cookie.get<string>(key);
  if (!encryptedCookie) throw new CustomError(ErrorMessage.MISSING_COOKIE_ERROR);

  const client = getClient(key); // use cached client first
  if (!client.cookie) await client.setCookie(encryptedCookie);

  if (value === 'general') {
    const data = await client.getGeneralRecord();
    const embeds = giEmbed(data);
    return { embeds: embeds };
  } else if (value === 'spiralabyss') {
    const data = await client.getSpiralabyssRecord();
    if (data.floors.length === 0) {
      return { content: '이번 시즌에 나선 비경에 도전하지 않았습니다.' };
    }
    const embed = saEmbed(data);
    return { embeds: [embed] };
  } else {
    const data = await client.getRealtimeRecord();
    const embed = dnEmbed(data);
    return { embeds: [embed] };
  }
};
