import { APIEmbed } from 'discord-api-types/v10';
import { hexElement } from './common';
import { Constellation } from '../interface';

export const csEmbed = (cs: Constellation) => {
  const embed: APIEmbed = {
    color: hexElement(cs.element),
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(cs.character),
    title: cs.character,
    fields: [],
  };
  cs.value.forEach((v, i) => {
    embed.fields.push({ name: i + 1 + '⭐️' + v.name, value: v.desc });
  });

  return embed;
};
