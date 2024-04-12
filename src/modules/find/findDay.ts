import { APIEmbed } from 'discord-api-types/v10';
import { dayEmbed } from '../../embeds';
import { Character, InteractionHandler, Weapon } from '../../interface';
import { findQuery, getStringDay } from './common';

export const findDay: InteractionHandler<string> = async (args) => {
  const query = args ? args : getStringDay();
  let embed: APIEmbed;
  if ('일요일'.indexOf(query) != -1) {
    embed = { description: '일요일엔 모든 재료를 파밍 가능합니다.' };
  } else {
    const results = {
      character: await findQuery<Character>('character', query),
      weapon: await findQuery<Weapon>('weapon', query),
    };
    embed = dayEmbed(results);
  }
  embed.title = query + '의 파밍 목록!';
  embed.color = 3444715;
  return { embeds: [embed] };
};
