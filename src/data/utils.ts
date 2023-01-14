import { Avatar } from './client';
import alias from '../config/alias.json';

export function escapeDesc(desc: string) {
  if (!desc) return '';

  return desc
    .replace(/<color=#[\w]{8}>([^<]+)<\/color>/g, '`$1`')
    .replace(/<i>\s*([^<]+)\s*<\/i>/g, '*$1*')
    .replace(/\\n/g, '\n');
}

function nameTransform(name: string) {
  const names = new Set();
  const regExp = /[ 「」]/g;
  const adds = alias[name];
  if (adds) {
    for (const n of alias[name]) {
      names.add(n.replace(regExp, ''));
    }
  }
  names.add(name.replace(regExp, ''));

  return [...names].join('|');
}

function subStatTransform(substat: string) {
  if (!substat) return;
  switch (substat) {
    case '치명타 확률':
      return '치확|치명타확률';
    case '치명타 피해':
      return '치피|치명타피해';
    case '원소 충전 효율':
      return '원충|원소충전효율';
    case '원소 마스터리':
      return '원마|원소마스터리';
    case '공격력':
      return '공격력|공퍼';
    case '방어력':
      return '방어력|방퍼';
    case 'HP':
      return 'HP|체력|체퍼';
    default:
      let output = [];
      output.push(substat.replace(/[ 「」]/g, ''));

      const base = substat.split(' ');
      if (base[1] === '원소') base.shift();
      if (base[base.length - 2] === '피해') {
        output = output.concat([base[0] + '피증', base[0][0] + '피증']);
      }
      output = output.concat(base.map((w) => w[0]).join(''));
      return [...new Set(output)].join('|');
  }
}

export function transformData(type: string, data: string) {
  switch (type) {
    case 'weapontype':
    case 'name':
    case 'character':
      return nameTransform(data);
    case 'rarity':
      return data + '성';
    case 'substat':
      return subStatTransform(data);
    default:
      return data;
  }
}

export function generateIndex(indexes: string[], data: any) {
  return indexes
    .map((idx) => transformData(idx, data[idx]))
    .filter((w) => w)
    .join('|');
}
