import {
  CloudflareKV,
  Character,
  Talent,
  TalentStat,
  Constellation,
  Stat,
  Weapon,
  Material,
  Food,
} from '../../interface';

declare var DB: CloudflareKV;

export function getStringDay() {
  const day = new Date().getDay();
  switch (day) {
    case 0:
      return '일요일';
    case 1:
      return '월요일';
    case 2:
      return '화요일';
    case 3:
      return '수요일';
    case 4:
      return '목요일';
    case 5:
      return '금요일';
    case 6:
      return '토요일';
  }
}

type DataWrapper<T> = {
  name?: string;
  index?: string;
  content: T;
};

export async function findQuery<
  T extends Character | Talent | TalentStat | Constellation | Stat | Weapon | Material | Food,
>(key: string, args: string) {
  const db = await DB.get<DataWrapper<T>[]>(key, { type: 'json' });
  const query = args.split(' ').filter(w => w);
  let result: DataWrapper<T>[];
  result = db.filter(w => query.every(word => w.name?.indexOf(word) != -1));
  if (!result.length) result = db.filter(w => query.every(word => w.index?.indexOf(word) != -1));

  return result.map(w => w.content);
}
