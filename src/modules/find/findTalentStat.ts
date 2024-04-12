import { SkillType, tsEmbed } from '../../embeds';
import { CloudflareKV, InteractionHandler, TalentStat } from '../../interface';
import { Message } from '../messages';

declare const DB: CloudflareKV;

export const findTalentStat: InteractionHandler<string, [SkillType]> = async (args, type) => {
  const data = await DB.get<TalentStat>('talentstat', { type: 'json' });
  if (!data) return { content: Message.COMMON_ERROR };

  const results = data[args];
  const embeds = tsEmbed(results, type);
  return { embeds: embeds, flags: 64 };
};
