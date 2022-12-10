import { APIEmbed } from 'discord-api-types/v10';
import { Material } from '../interface';

export const matEmbed = (mat: Material) => {
  const stars: string[] = [];
  const rarity = mat.rarity;
  for (let i = 0; i < rarity; i++) {
    stars.push('⭐️');
  }
  const embed: APIEmbed = {
    color: 3444715,
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(mat.name),
    title: mat.name + ' ' + stars.join(''),
    description: mat.desc,
    fields: [],
  };
  if (mat.icon)
    embed.thumbnail = {
      url: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_' + mat.icon + '.png',
    };
  if (mat.effect) embed.fields?.push({ name: '효과', value: mat.effect });
  if (mat.source?.length) embed.fields?.push({ name: '획득 방법', value: mat.source.join('  \n'), inline: true });
  if (mat.days) embed.fields?.push({ name: '파밍 요일', value: mat.days, inline: true });
  if (mat.map)
    embed.fields?.push({
      name: '지도 보기',
      value: '[게임닷](https://genshin.gamedot.org/?mid=genshinmaps&type=wiki&id=' + encodeURIComponent(mat.map) + ')',
      inline: true,
    });
  if (mat.weapons) embed.fields?.push({ name: '사용 무기', value: mat.weapons.join(', ') });
  if (mat.characters) embed.fields?.push({ name: '사용 캐릭터', value: mat.characters.join(', ') });

  return embed;
};
