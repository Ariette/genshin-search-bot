import { table, TableUserConfig } from 'table';
import { APIEmbed } from 'discord-api-types/v10';
import { hexElement } from './common';
import { TalentStat } from '../interface';

export const tsEmbed = (t: TalentStat, type: 'normal' | 'elemental' | 'burst') => {
  const config: TableUserConfig = {
    drawVerticalLine: () => false,
    drawHorizontalLine: (lineIndex, columnCount) => {
      return lineIndex === 1;
    },
    columnDefault: {
      alignment: 'right',
      width: 7,
    },
    columns: {
      0: {
        alignment: 'left',
        width: 14,
      },
    },
  };
  const table1: (number | string)[][] = [[' ', 'lv.1', 'lv.2', 'lv.3', 'lv.4', 'lv.5']];
  const table2: (number | string)[][] = [[' ', 'lv.6', 'lv.7', 'lv.8', 'lv.9', 'lv.10']];
  const table3: (number | string)[][] = [[' ', 'lv.11', 'lv.12', 'lv.13', 'lv.14', 'lv.15']];
  t[type].forEach(data => {
    table1.push([data.label, ...data.params.slice(0, 5)]);
    table2.push([data.label, ...data.params.slice(5, 10)]);
    table3.push([data.label, ...data.params.slice(10)]);
  });

  const embed1: APIEmbed = {
    color: hexElement(t.element),
    description: '```' + table(table1, config) + '```',
  };
  const embed2: APIEmbed = {
    color: hexElement(t.element),
    description: '```' + table(table2, config) + '```',
  };
  const embed3: APIEmbed = {
    color: hexElement(t.element),
    description: '```' + table(table3, config) + '```',
  };

  return [embed1, embed2, embed3];
};
