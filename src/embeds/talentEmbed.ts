import { APIEmbed } from 'discord-api-types/v10';
import { hexElement } from './common';
import { Talent } from '../interface';

export const tEmbed = (t: Talent) => {
  const embed: APIEmbed = {
    color: hexElement(t.element),
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(t.character),
    title: t.character,
    fields: [
      { name: '일반공격⭐️' + t.normal.name, value: t.normal.desc },
      { name: '원소스킬⭐️' + t.elemental.name, value: t.elemental.desc },
      { name: '원소폭발⭐️' + t.burst.name, value: t.burst.desc },
      { name: '1돌파⭐️' + t.passive1.name, value: t.passive1.desc },
      { name: '4돌파⭐️' + t.passive2.name, value: t.passive2.desc },
    ],
  };
  if (t.passive3) embed.fields.push({ name: '생활⭐️' + t.passive3.name, value: t.passive3.desc });

  return embed;
};
