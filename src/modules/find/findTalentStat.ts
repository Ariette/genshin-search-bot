import { APIMessage } from 'discord-api-types/v10';
import { tsEmbed } from '../../embeds';
import { CloudflareKV } from '../../interface';

declare const DB: CloudflareKV;

export const findTalentStat = async (args: string, type: string): Promise<Partial<APIMessage>> => {
  const data = await DB.get<object>('talentstat', { type: 'json' });
  const results = data[args];
  const embeds = tsEmbed(results, type);
  return { embeds: embeds, flags: 64 };
};
