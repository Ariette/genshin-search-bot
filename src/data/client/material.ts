import { $, MaterialType } from './common';

export interface MaterialMeta {
  id: number;
  name: string;
  type: MaterialType;
  recipe: boolean;
  mapMark: boolean;
  icon: string;
  rank: number;
  route: string;
  beta?: boolean;
  characters?: string[]; // 데이터 상호 레퍼런스를 위한 Hack
  weapons?: string[]; // 데이터 상호 레퍼런스를 위한 Hack
}

export interface Material {
  name: string;
  description: string;
  type: string;
  recipe: boolean;
  mapMark: boolean;
  source: {
    name: string;
    type: string;
    days?: string[];
  }[];
  icon: string;
  rank: number;
  route: string;
  beta?: boolean;
}

export async function getMaterialList(): Promise<{
  [id: string]: MaterialMeta;
}> {
  const { data } = await $.get('/material');
  return data.data.items;
}

export async function getMaterial(id: string | number): Promise<Material> {
  const { data } = await $.get(`/material/${id}`);
  return data.data;
}
