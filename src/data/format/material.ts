import gs from './genshin-db';
import { getMaterial, MaterialMeta } from '../client';
import { escapeDesc } from '../utils';

function formatDays(day: string) {
  switch (day) {
    case 'monday':
      return '월요일';
    case 'tuesday':
      return '화요일';
    case 'wednesday':
      return '수요일';
    case 'thursday':
      return '목요일';
    case 'friday':
      return '금요일';
    case 'saturday':
      return '토요일';
    case 'sunday':
    default:
      return '일요일';
  }
}

export async function formatMaterial(meta: MaterialMeta) {
  const data = gs.materials(meta.name);
  const base = {
    name: meta.name,
    rarity: meta.rank,
    characters: null, // TODO
    weapons: null, // TODO
  };

  if (!data) {
    const res = await getMaterial(meta.id);
    return {
      ...base,
      desc: escapeDesc(res.description),
      icon: `https://api.ambr.top/assets/UI/${meta.icon}.png`,
      source: res.source.map((w) => w.name),
      days: res.source
        .find((w) => w.days)
        ?.days.map((w) => formatDays(w))
        ?.join(', '),
      map: res.source.some((w) => w.name.indexOf(' 채집') != -1) ? meta.name : undefined,
    };
  }

  return {
    ...base,
    desc: data.description,
    icon: data.images?.fandom || `https://api.ambr.top/assets/UI/${meta.icon}.png`,
    source: data.dropdomain ? [...data.source, data.dropdomain] : data.source,
    days: data.daysofweek?.join(', '),
    map: data.source.some((w) => w.indexOf(' 채집') != -1) ? meta.name : undefined,
  };
}
