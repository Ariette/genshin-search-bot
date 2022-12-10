import { APIMessage } from 'discord-api-types/v10';
import { SkillType, tsEmbed } from '../../embeds';
import { CloudflareKV, TalentStat } from '../../interface';

declare const DB: CloudflareKV;

export const findTalentStat = async (args: string, type: SkillType): Promise<Partial<APIMessage>> => {
  const data = await DB.get<TalentStat>('talentstat', { type: 'json' });
  if (!data) return { content: '에러 발생!' };

  const results = data[args];
  const embeds = tsEmbed(results, type);
  return { embeds: embeds, flags: 64 };
};
