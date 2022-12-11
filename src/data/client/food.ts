import { $ } from './common';

export interface FoodMeta {
  id: number;
  name: string;
  type: 'food';
  recipe: boolean;
  mapMark: boolean;
  icon: string;
  rank: number;
  route: string;
  effectIcon: string;
  beta?: boolean;
}

export async function getFoodList(): Promise<{
  [id: number]: FoodMeta;
}> {
  const { data } = await $.get('/food');
  return data.data.items;
}
