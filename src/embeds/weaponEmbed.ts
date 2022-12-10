import { APIEmbed } from 'discord-api-types/v10';
import { Weapon } from '../interface';

export const wpEmbed = (wp: Weapon) => {
  const stars: string[] = [];
  const rarity = wp.rarity;
  for (let i = 0; i < rarity; i++) {
    stars.push('⭐️');
  }
  const embed: APIEmbed = {
    color: 3442411,
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(wp.name),
    title: wp.name + ' ' + stars.join(''),
    thumbnail: {
      url: 'https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/' + wp.icon + '.png',
    },
    fields: [{ name: '기초 공격력', value: wp.baseAtk, inline: true }],
  };
  if (wp.substat) embed.fields?.push({ name: wp.substat.name, value: wp.substat.value, inline: true });
  if (wp.skill) embed.fields?.push({ name: '무기 효과', value: `《${wp.skill.name}》\n${wp.skill.effect}` });

  embed.fields?.push(
    { name: '파밍 요일', value: wp.days, inline: true },
    { name: '육성 재료', value: wp.material.join(', ') },
  );

  return embed;
};
