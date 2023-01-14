import { $, WeaponType, Prop, Promote } from './common';

export interface WeaponMeta {
  id: number;
  rank: number;
  type: WeaponType;
  name: string;
  icon: string;
  route: string;
  beta?: boolean;
}

export type Weapon = WeaponMeta & {
  type: string;
  description: string;
  storyId: number;
  affix?: {
    [id: string]: {
      name: string;
      upgrade: {
        [level: string]: string;
      };
    };
  };
  upgrade: {
    awakenCost: number[];
    prop: Prop[];
    promote: Promote[];
  };
  ascension: {
    [key: string]: number;
  };
  beta: true;
};

export async function getWeaponList(): Promise<{
  [id: string]: WeaponMeta;
}> {
  const { data } = await $.get('/weapon');
  return data.data.items;
}

export async function getWeapon(id: string | number): Promise<Weapon> {
  const { data } = await $.get(`/weapon/${id}`);
  return data.data;
}
