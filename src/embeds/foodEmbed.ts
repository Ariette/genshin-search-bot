import { APIEmbed } from 'discord-api-types/v10';
import { Food } from '../interface';

export const foodEmbed = (food: Food) => {
  const stars: string[] = [];
  const rarity = food.rarity;
  for (let i = 0; i < rarity; i++) {
    stars.push('⭐️');
  }
  const embed: APIEmbed = {
    color: 3444715,
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(food.name),
    title: food.name + ' ' + stars.join(''),
    description: food.desc,
    fields: [],
  };
  if (food.icon)
    embed.thumbnail = {
      url: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_' + food.icon + '.png',
    };
  if (food.effect) embed.fields?.push({ name: '효과', value: food.effect });
  embed.fields?.push({
    name: '재료',
    value: food.ingredients.map((w) => w.name + 'x' + w.count).join(', '),
    inline: true,
  });
  if (food.characters)
    embed.fields?.push({ name: '특수 요리', value: food.special + ' - ' + food.characters, inline: true });

  return embed;
};
