import { APIEmbed, APIMessage } from 'discord-api-types/v10';
import { foodEmbed } from '../../embeds';
import { Food } from '../../interface';
import { findQuery } from './common';
import { Message } from '../messages';

export const findFood = async (args: string): Promise<Partial<APIMessage>> => {
  const results = await findQuery<Food>('food', args);
  if (results.length < 1) {
    return { content: Message.MISSING_ITEM_ERROR };
  } else if (results.length < 4) {
    const embeds: APIEmbed[] = [];
    for (const result of results) {
      embeds.push(foodEmbed(result));
    }
    return { embeds: embeds };
  } else {
    return { content: `\`검색 결과>>\` ${results.map((w) => w.name).join(', ')}` };
  }
};
