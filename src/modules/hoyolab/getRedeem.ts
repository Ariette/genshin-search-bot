import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { getClient } from '../client/cache';
import { getOptionValue } from '../utils/getOptionValue';

export const getRedeem = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;
  const client = getClient(key); // use cached client first

  const result = await client.getRedeem(value);
  return { content: result.message };
};
