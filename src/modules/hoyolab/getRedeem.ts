import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { CloudflareKV } from '../../interface';
import { getClient } from '../client/cache';
import { ErrorMessage } from '../messages';
import { CustomError } from '../utils/common';
import { getOptionValue } from '../utils/getOptionValue';

declare const Cookie: CloudflareKV;

export const getRedeem = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;

  const encryptedCookie = await Cookie.get<string>(key);
  if (!encryptedCookie) throw new CustomError(ErrorMessage.MISSING_COOKIE_ERROR);

  const client = getClient(key); // use cached client first
  if (!client.cookie) await client.setCookie(encryptedCookie);

  const result = await client.getRedeem(value);
  return { content: result.message };
};
