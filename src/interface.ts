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
  value?: {
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
  ingredients?: {
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

namespace Hoyolab {
  export interface AvatarInfo {
    avatar_id: number;
    value: number;
  }

  export interface FloorRecords {
    index: number;
    settle_time: string;
    star: number;
    max_star: number;
    levels: Records[];
  }

  interface CharacterInfo {
    id: number;
    value: number;
  }

  interface Battle {
    index: number;
    timestamp: string;
    avatars: CharacterInfo[];
  }

  interface Records {
    index: number;
    star: number;
    max_star: number;
    battles: Battle[];
  }
}

export interface GeneralInfo {
  role: any;
  avatars: {
    id: number;
    image: string;
    name: string;
    element: string;
    fetter: number;
    level: number;
    rarity: number;
    actived_constellation_num: number;
    card_image: string;
    is_chosen: boolean;
  }[];
  stats: {
    active_day_number: number;
    achievement_number: number;
    win_rate: number;
    anemoculus_number: number;
    geoculus_number: number;
    avatar_number: number;
    way_point_number: number;
    domain_number: number;
    spiral_abyss: string;
    precious_chest_number: number;
    luxurious_chest_number: number;
    exquisite_chest_number: number;
    common_chest_number: number;
    electroculus_number: number;
    magic_chest_number: number;
  };
  city_explorations: any[];
  world_explorations: {
    level: number;
    exploration_percentage: number;
    icon: string;
    name: string;
    type: string;
    offerings: {
      name: string;
      level: number;
    }[];
    id: number;
  }[];
  homes: {
    level: number;
    visit_num: number;
    comfort_num: number;
    item_num: number;
    name: string;
    icon: string;
    comfort_level_name: string;
    comfort_level_icon: string;
  }[];
}

export interface DailyNote {
  current_resin: number;
  max_resin: number;
  resin_recovery_time: string;
  finished_task_num: number;
  total_task_num: number;
  is_extra_task_reward_received: boolean;
  remain_resin_discount_num: number;
  resin_discount_num_limit: number;
  current_expedition_num: number;
  max_expedition_num: number;
  expeditions: {
    avatar_side_icon: string;
    status: string;
    remained_time: string;
  }[];
  current_home_coin: number;
  max_home_coin: number;
  home_coin_recovery_time: string;
  calendar_url: string;
  transformer: {
    obtained: boolean;
    recovery_time: {
      Day: number;
      Hour: number;
      Minute: number;
      Second: number;
      reached: false;
    };
    wiki: string;
  };
}

export interface SpiralAbyss {
  schedule_id: number;
  start_time: string;
  end_time: string;
  total_battle_times: number;
  total_win_times: number;
  max_floor: string;
  reveal_rank: Hoyolab.AvatarInfo[];
  defeat_rank: Hoyolab.AvatarInfo[];
  damage_rank: Hoyolab.AvatarInfo[];
  take_damage_rank: Hoyolab.AvatarInfo[];
  normal_skill_rank: Hoyolab.AvatarInfo[];
  energy_skill_rank: Hoyolab.AvatarInfo[];
  floors: Hoyolab.FloorRecords[];
  total_star: number;
}
