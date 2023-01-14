import gs from './genshin-db';
import { FoodMeta } from '../client';

const specials = gs.foods('SPECIALTY', {
  matchCategories: true,
  matchNames: false,
}) as string[];

const specialDishMap = Object.fromEntries(
  specials
    .map((name) => gs.foods(name))
    .map((food) => [
      food.basedish,
      {
        special: food.name,
        character: food.character,
      },
    ]),
);

export async function formatFood(meta: FoodMeta) {
  const data = gs.foods(meta.name);
  const base = {
    name: meta.name,
    rarity: meta.rank,
  };
  if (!data) {
    // Food는 상대적으로 중요하지 않으니 genshin-db에 없으면 무시함
    // 사실 ambr.top API response에는 없는 정보가 많아서 일일히 다 채울 수 없음
    return;
  }

  const normal = {
    ...base,
    desc: data.normal.description,
    effect: data.normal.effect,
    ingredients: data.ingredients,
    characters: data.character ?? specialDishMap[meta.name]?.character,
    special: specialDishMap[meta.name]?.special,
    materials: data.ingredients.map((w) => w.name),
    icon: `https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_${data.url.fandom.split('/').at(-1)}.png`,
  };

  const suspicious = data.suspicious
    ? {
        ...normal,
        name: '이상한 ' + meta.name,
        desc: data.suspicious.description,
        effect: data.suspicious.effect,
        icon: `https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Suspicious_${data.url.fandom
          .split('/')
          .at(-1)}.png`,
      }
    : undefined;

  const delicious = data.delicious
    ? {
        ...normal,
        name: '맛있는 ' + meta.name,
        desc: data.delicious.description,
        effect: data.delicious.effect,
        icon: `https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Delicious_${data.url.fandom
          .split('/')
          .at(-1)}.png`,
      }
    : undefined;

  return {
    normal,
    suspicious,
    delicious,
  };
}
