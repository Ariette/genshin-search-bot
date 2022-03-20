import { APIEmbed } from 'discord-api-types/v10';
import { table, TableUserConfig } from 'table';
import { hexElement } from './common';
import { Curve, Stat } from '../interface';

export const chrstEmbed = (st: Stat, curve: Curve) => {
  function r(statNum: number, i?: string | number, up?: number[]) {
    if (!i) return Math.round(st.base[statNum]);
    if (!up) return Math.round(st.base[statNum] * curve[lvlMap[i]][st.curve[statNum]]);
    return Math.round(st.base[statNum] * curve[lvlMap[i]][st.curve[statNum]] + up[statNum]);
  }
  const lvlMap = {
    '0': '20',
    '1': '40',
    '2': '50',
    '3': '60',
    '4': '70',
    '5': '80',
    '6': '90',
  };
  const config: TableUserConfig = {
    drawVerticalLine: () => false,
    drawHorizontalLine: (lineIndex, columnCount) => {
      return lineIndex === 1;
    },
    columnDefault: {
      alignment: 'right',
    },
    columns: {
      0: {
        alignment: 'left',
        width: 4,
      },
      4: {
        width: 18,
      },
    },
  };
  const stats: (string | number)[][] = [['레벨', '기초 HP', '기초 방어력', '기초 공격력', st.substat]];
  stats.push([1, r(0), r(1), r(2), 0]);
  st.upgrade.forEach((up, i) => {
    if (i === 0) {
      stats.push([lvlMap[i], r(0, '0'), r(1, '0'), r(2, '0'), 0]);
      stats.push([lvlMap[i] + '+', r(0, '0', up), r(1, '0', up), r(2, '0', up), 0]);
    } else {
      stats.push([
        lvlMap[i],
        r(0, i, st.upgrade[i - 1]),
        r(1, i, st.upgrade[i - 1]),
        r(2, i, st.upgrade[i - 1]),
        st.upgrade[i - 1][3] || 0,
      ]);
      stats.push([lvlMap[i] + '+', r(0, i, up), r(1, i, up), r(2, i, up), up[3]]);
    }
  });
  stats.push([90, r(0, 6, st.upgrade[5]), r(1, 6, st.upgrade[5]), r(2, 6, st.upgrade[5]), st.upgrade[5][3]]);
  const embed: APIEmbed = {
    color: hexElement(st.element),
    url: 'https://genshin.gamedot.org/?mid=wiki&view=' + encodeURIComponent(st.character),
    title: st.character,
    description: '```' + table(stats, config) + '```',
    footer: {
      text: '* 위 스탯은 캐릭터 기본 스탯(치확 5%, 치피 50%, 원충 100%)이 제외된 수치입니다.',
    },
  };

  return embed;
};
