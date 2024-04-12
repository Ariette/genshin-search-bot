import { APIChatInputApplicationCommandInteraction, APIInteractionResponseCallbackData } from 'discord-api-types/v10';

export interface CloudflareKV {
  put: (
    key: string,
    value: string | ReadableStream | ArrayBuffer,
    metadata?: {
      metadata: {
        [key: string]: object;
      };
    },
  ) => Promise<void>;
  get: <T extends string | object | ArrayBuffer | ReadableStream>(
    key: string,
    option?: {
      type?: 'text' | 'json' | 'arrayBuffer' | 'stream';
      cacheTtl?: number;
    },
  ) => Promise<T | null>;
  getWithMetadata: <T extends string | object | ArrayBuffer | ReadableStream>(
    key: string,
  ) => Promise<{
    value: T;
    metadata: {
      [key: string]: object;
    };
  }>;
  delete: (key: string) => Promise<void>;
  list: (options?: { prefix?: string; limit?: number; cursor?: string }) => Promise<{
    keys: {
      name: string;
      expiration: number;
      metadata: {
        [key: string]: object;
      };
    }[];
    list_complete: boolean;
    cursor: string;
  }>;
}

export type InteractionHandler<
  T = APIChatInputApplicationCommandInteraction,
  U extends any[] = never[],
  V = APIInteractionResponseCallbackData,
> = (body: T, ...args: U) => Promise<V>;

interface Skill {
  name: string;
  desc: string;
}

interface SkillStat {
  label: string;
  params: number[];
}

export interface Character {
  title?: string;
  name: string;
  desc: string;
  rarity: number;
  weapontype: string;
  material: {
    level: string;
    talent: string;
    boss: string;
  };
  icon: string;
  substat: string;
  element: string;
  constellation: string;
  affiliation: string;
  cv: {
    cn: string;
    jp: string;
    en: string;
    ko: string;
  };
  birthday: string;
  days?: string;
  names: string;
  substats: string;
  raritys: string;
  weapontypes: string;
}

export interface Talent {
  character: string;
  element: string;
  normal: Skill;
  elemental: Skill;
  burst: Skill;
  passive1: Skill;
  passive2: Skill;
  passive3: Skill;
  characters: string;
}

export interface TalentStat {
  element: string;
  normal: SkillStat[];
  elemental: SkillStat[];
  burst: SkillStat[];
}

export interface Constellation {
  icon: string;
  character: string;
  element: string;
  value: {
    name: string;
    desc: string;
    icon: string;
  }[];
  characters: string;
}

export interface Stat {
  characters: string;
  character: string;
  element: string;
  substat: string;
  base: number[];
  curve: string[];
  upgrade: number[][];
}

export interface Weapon {
  name: string;
  desc: string;
  weapontype: string;
  rarity: number;
  icon: string;
  baseAtk: string;
  substat?: {
    name: string;
    value: string;
  };
  material: string[];
  skill?: {
    name: string;
    effect: string;
  };
  substats: string;
  days: string;
  raritys: string;
  names: string;
  weapontypes: string;
}

export interface Material {
  name: string;
  desc: string;
  effect?: string;
  rarity: number;
  icon?: string;
  source?: string[];
  characters?: string[];
  weapons?: string[];
  days?: string;
  names: string;
  map?: string;
}

export interface Food {
  name: string;
  desc: string;
  rarity: number;
  icon: string;
  effect?: string;
  ingredients: {
    name: string;
    count: number;
  }[];
  characters?: string[];
  special?: string;
  materials?: string[];
  names: string;
}

export interface Curve {
  [level: string]: {
    GROW_CURVE_HP_S4: number;
    GROW_CURVE_ATTACK_S4: number;
    GROW_CURVE_HP_S5: number;
    GROW_CURVE_ATTACK_S5: number;
  };
}
