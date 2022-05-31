import { hexElement } from './common';
import { APIEmbed } from 'discord-api-types/v10';
import { Character } from '../interface';

export const chrEmbed = (chr: Character) => {
  const stars = [];
  const rarity = chr.rarity;
  for (let i = 0; i < rarity; i++) {
    stars.push('⭐️');
  }
  const embed: APIEmbed = {
    color: hexElement(chr.element),
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(chr.name),
    title: chr.name + ' ' + stars.join(''),
    description: chr.desc,
    thumbnail: {
      url: 'https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/' + chr.icon + '.png',
    },
    fields: [
      { name: 'CV', value: `\`KR\` ${chr.cv.ko} 　\`JP\` ${chr.cv.jp} 　\`EN\` ${chr.cv.en} 　\`CN\` ${chr.cv.cn}` },
      { name: '속성', value: chr.element, inline: true },
      { name: '운명의 자리', value: chr.constellation, inline: true },
      { name: '소속', value: chr.affiliation, inline: true },
      { name: '생일', value: chr.birthday, inline: true },
      { name: '무기', value: chr.weapontype, inline: true },
      { name: '돌파 스탯', value: chr.substat, inline: true },
      { name: '특산물', value: chr.material.level, inline: true },
      { name: '특성 재료', value: `「${chr.material.talent}」, ${chr.material.boss}`, inline: true },
    ],
  };
  if (chr.days) embed.fields.push({ name: '파밍 요일', value: chr.days, inline: true }); // 여행자를 위한 예외
  if (chr.title) embed.author = { name: chr.title }; // 여행자를 위한 예외

  return embed;
};
