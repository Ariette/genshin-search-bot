import { hoyolabFooter } from '../config/message.json';
import { APIEmbed } from 'discord-api-types/v10';
import type { IGenshinSpiralAbyss } from 'hoyoapi';

export const saEmbed = (sa: IGenshinSpiralAbyss) => {
  const floors = sa.floors.map((w) => {
    const levels = w.levels.map((l) => {
      return `${l.index}번 방(${l.star}/${l.max_star})`;
    });
    return {
      name: `:arrow_right: ${w.index}층`,
      value: `${levels.join(', ')}`,
    };
  });
  const embed: APIEmbed = {
    color: 3444715,
    title: '나선 비경 전적',
    fields: [
      {
        name: '최고 기록',
        value: sa.max_floor,
        inline: true,
      },
      {
        name: '전투 횟수',
        value: sa.total_battle_times.toString(),
        inline: true,
      },
      {
        name: '획득 별 수',
        value: '⭐️' + sa.total_star,
        inline: true,
      },
      ...floors,
    ],
    footer: {
      text: hoyolabFooter,
    },
  };

  return embed;
};
