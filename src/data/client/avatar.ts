import { $, ElementType, WeaponType, Prop, Promote } from './common';

type Birthday = [number, number];

interface AvatarMeta {
  id: string | number;
  rank: number;
  name: string;
  element: ElementType;
  weaponType: WeaponType;
  icon: string;
  birthday: Birthday;
  release?: number;
  route: string;
  beta?: boolean;
}

interface Talent {
  type: number;
  name: string;
  description: string;
  icon: string;
  promote: {
    [level: string]: {
      level: number;
      costItems: null | {
        [id: number]: number;
      };
      coinCost: null | number;
      description: string[];
      params: number[];
    };
  };
}

export type Avatar = AvatarMeta & {
  fetter: {
    title: string;
    detail: string;
    constellation: string;
    native: string;
    cv?: { EN: string; CHS: string; JP: string; KR: string };
  };
  upgrade: {
    prop: Prop[];
    promote: Promote[];
  };
  other: {
    nameCard: {
      id: number;
      name: string;
      description: string;
      icon: string;
    };
    specialFood: {
      id: number;
      name: string;
      rank: number;
      effectIcon: string;
      icon: string;
    };
  };
  ascension: {
    [key: string]: number;
  };
  talent: {
    [key: string]: Talent;
  };
  constellation: {
    [key: string]: {
      name: string;
      description: string;
      icon: string;
    };
  };
};

export async function getAvatarList(): Promise<{
  [id: string]: AvatarMeta;
}> {
  const { data } = await $.get('/avatar');
  return data.data.items;
}

export async function getAvatar(id: string | number): Promise<Avatar> {
  const { data } = await $.get(`/avatar/${id}`);
  return data.data;
}
