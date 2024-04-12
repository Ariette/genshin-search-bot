import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { getOptionValue } from '../utils/getOptionValue';
import { GenshinClient } from '../client';
import { Message } from '../messages';

export const getRedeem = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;
  const client = await GenshinClient.fromKey(key);

  const uid = await client.fetchUid();
  const result = await client.getRedeem(uid, value);
  return { content: result ?? Message.WRONG_RESPONSE_ERROR };
};
