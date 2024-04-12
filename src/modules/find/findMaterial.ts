import { APIEmbed } from 'discord-api-types/v10';
import { matEmbed } from '../../embeds';
import { InteractionHandler, Material } from '../../interface';
import { findQuery } from './common';
import { Message } from '../messages';

export const findMaterial: InteractionHandler<string> = async (args) => {
  const results = await findQuery<Material>('material', args);
  if (results.length < 1) {
    return { content: Message.MISSING_ITEM_ERROR };
  } else if (results.length < 4) {
    const embeds: APIEmbed[] = [];
    for (const result of results) {
      embeds.push(matEmbed(result));
    }
    return { embeds: embeds };
  } else {
    return { content: `\`검색 결과>>\` ${results.map((w) => w.name).join(', ')}` };
  }
};
