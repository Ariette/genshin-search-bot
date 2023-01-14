import gs from './genshin-db';
import { getWeapon, propTypes, WeaponMeta, weaponTypes, Weapon, getMaterialList } from '../client';
import { escapeDesc } from '../utils';

function formatEffect(effect: string, values: string[][]) {
  const findValue = /{(\d+)}/;
  const result: string[] = [];
  for (const value of values) {
    if (!value?.length) continue;

    let i: any;
    while ((i = findValue.exec(effect)) !== null) {
      const val = value[i[1]];
      effect = effect.replace(findValue, `\`${val}\``);
    }
    result.push(effect);
  }
  return result;
}

// ambr.top 에서 가져온 무기 효과 처리
function formatAffix(affix: Weapon['affix'][string]['upgrade']) {
  const template = {
    r1: affix['0']?.split('>'),
    r2: affix['1']?.split('>'),
    r3: affix['2']?.split('>'),
    r4: affix['3']?.split('>'),
    r5: affix['4']?.split('>'),
  };
  const container = [];
  template.r1.forEach((str, idx) => {
    if (str.indexOf('</color') != -1) {
      const out = Object.values(template)
        .filter((w) => w)
        .map((r) => r[idx])
        .join('/');
      container.push(out.replace(/<\/color/g, '') + '</color');
    } else {
      container.push(str);
    }
  });

  return escapeDesc(container.join('>'));
}

function calculateSubStat(baseStat: number, rank: number, statType: string) {
  switch (statType) {
    case 'HP':
    case '공격력':
      if (baseStat === 38) return '46.9%';
      if (baseStat === 39) return '35.2%';
      if (baseStat === 40) return '23.5%';
      if (baseStat === 41) return '55.1%';
      if (baseStat === 42) return '41.3%';
      if (baseStat === 44 && rank === 4) return '34.5%';
      if (baseStat === 45) return '13.8%';
      if (baseStat === 44) return '66.2%';
      if (baseStat === 46) return '49.6%';
      if (baseStat === 48) return '33.1%';
      if (baseStat === 49) return '16.5%';
    case '방어력':
    case '물리 피해 보너스':
      if (baseStat === 38) return '58.6%';
      if (baseStat === 39) return '43.9%';
      if (baseStat === 40) return '29.3%';
      if (baseStat === 41) return '69.0%';
      if (baseStat === 42) return '51.7%';
      if (baseStat === 44 && rank === 4) return '43.1%';
      if (baseStat === 45) return '17.2%';
      if (baseStat === 44) return '82.6%';
      if (baseStat === 46) return '62.0%';
      if (baseStat === 48) return '41.3%';
      if (baseStat === 49) return '20.7%';
    case '원소 충전 효율':
      if (baseStat === 38) return '52.1%';
      if (baseStat === 39) return '39.0%';
      if (baseStat === 40) return '26.0%';
      if (baseStat === 41) return '61.3%';
      if (baseStat === 42) return '45.9%';
      if (baseStat === 44 && rank === 4) return '38.3%';
      if (baseStat === 45) return '15.3%';
      if (baseStat === 44) return '73.5%';
      if (baseStat === 46) return '55.1%';
      if (baseStat === 48) return '36.8%';
      if (baseStat === 49) return '18.4%';
    case '치명타 확률':
      if (baseStat === 38) return '31.2%';
      if (baseStat === 39) return '23.4%';
      if (baseStat === 40) return '15.6%';
      if (baseStat === 41) return '36.8%';
      if (baseStat === 42) return '27.6%';
      if (baseStat === 44 && rank === 4) return '23.0%';
      if (baseStat === 45) return '9.2%';
      if (baseStat === 44) return '44.1%';
      if (baseStat === 46) return '33.1%';
      if (baseStat === 48) return '22.1%';
      if (baseStat === 49) return '11.0%';
    case '치명타 피해':
      if (baseStat === 38) return '62.5%';
      if (baseStat === 39) return '46.9%';
      if (baseStat === 40) return '31.2%';
      if (baseStat === 41) return '73.5%';
      if (baseStat === 42) return '55.1%';
      if (baseStat === 44 && rank === 4) return '45.9%';
      if (baseStat === 45) return '18.4%';
      if (baseStat === 44) return '88.2%';
      if (baseStat === 46) return '66.2%';
      if (baseStat === 48) return '44.1%';
      if (baseStat === 49) return '22.1%';
    case '원소 마스터리':
      if (baseStat === 38) return 187;
      if (baseStat === 39) return 141;
      if (baseStat === 40) return 94;
      if (baseStat === 41) return 221;
      if (baseStat === 42) return 165;
      if (baseStat === 44 && rank === 4) return 138;
      if (baseStat === 45) return 55;
      if (baseStat === 44) return 265;
      if (baseStat === 46) return 199;
      if (baseStat === 48) return 132;
      if (baseStat === 49) return 66;
  }
  return '???';
}

function calculateBaseStat(baseStat: number, rank: number) {
  switch (rank) {
    case 1:
      return 185;
    case 2:
      return 243;
    case 3:
      if (baseStat === 38) return 354;
      if (baseStat === 39) return 401;
      if (baseStat === 40) return 448;
    case 4:
      if (baseStat === 39) return 440;
      if (baseStat === 41) return 454;
      if (baseStat === 42) return 510;
      if (baseStat === 44) return 565;
      if (baseStat === 45) return 620;
    case 5:
      if (baseStat === 44) return 542;
      if (baseStat === 46) return 608;
      if (baseStat === 48) return 674;
      if (baseStat === 49) return 741;
  }
  return '???';
}

export async function formatWeapon(meta: WeaponMeta) {
  const data = gs.weapons(meta.name);
  const base = {
    name: meta.name,
    weapontype: weaponTypes[meta.type],
    rarity: meta.rank,
  };
  const materials = await getMaterialList();

  if (!data) {
    // genshin-db에 데이터가 없으면 ambr.top에서 가져옴
    const res = await getWeapon(meta.id);
    const baseStat = Math.round(res.upgrade.prop[0].initValue);
    const subStat = Math.round(res.upgrade.prop[1].initValue);
    const affix = res.affix ? Object.values(res.affix)[0] : null;
    return {
      ...base,
      desc: escapeDesc(res.description),
      icon: `https://api.ambr.top/assets/UI/${meta.icon}.png`,
      baseAtk: `${baseStat} ~ ${calculateBaseStat(baseStat, meta.rank)}`,
      substat:
        res.upgrade.prop.length > 1
          ? `${subStat} ~ ${calculateSubStat(baseStat, meta.rank, propTypes[res.upgrade.prop[1].propType])}`
          : undefined,
      material: Object.keys(res.ascension).map((id) => materials[id].name),
      skill: affix
        ? {
            name: affix.name,
            effect: formatAffix(affix.upgrade),
          }
        : undefined,
    };
  }

  return {
    ...base,
    desc: data.description,
    icon: data.images.icon || `https://api.ambr.top/assets/UI/${meta.icon}.png`,
    baseAtk: `${data.baseatk} ~ ${calculateBaseStat(data.baseatk, meta.rank)}`,
    substat: data.substat
      ? {
          name: data.substat,
          value: `${data.subvalue} ~ ${calculateSubStat(data.baseatk, meta.rank, data.substat)}`,
        }
      : undefined,
    material: [
      ...new Set(
        Object.values(data.costs)
          .flat()
          .map((w) => w.name),
      ),
    ],
    skill: data.effect
      ? {
          name: data.effectname,
          effect: formatEffect(data.effect, [data.r1, data.r2, data.r3, data.r4, data.r5]),
        }
      : undefined,
  };
}
