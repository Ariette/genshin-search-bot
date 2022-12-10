import { APIEmbed, APIMessage } from 'discord-api-types/v10';
import { missingItem } from '../../config/message.json';
import { matEmbed } from '../../embeds';
import { Material } from '../../interface';
import { findQuery } from './common';

export const findMaterial = async (args: string): Promise<Partial<APIMessage>> => {
  const results = await findQuery<Material>('material', args);
  if (results.length < 1) {
    return { content: missingItem };
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
