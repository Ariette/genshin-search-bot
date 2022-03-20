import { hoyolabFooter } from '../config/message.json';
import { APIEmbed } from 'discord-api-types/v10';
import { GeneralInfo } from '../interface';

export const giEmbed = (gi: GeneralInfo) => {
  const explorations = gi.world_explorations.map((w) => {
    const strs = [`탐사도 : ${w.exploration_percentage / 10}%`];
    if (w.offerings.length > 0) {
      for (const offer of w.offerings) {
        strs.push(`${offer.name} : Lv.${offer.level}`);
      }
    }
    if (w.type === 'Reputation') {
      strs.push(`평판 등급 : Lv.${w.level}`);
    }
    return {
      name: w.name + ' 탐사도',
      value: strs.join('\n'),
      inline: true,
    };
  });
  const embed: APIEmbed = {
    color: 3444715,
    title: '유저 데이터 일람',
    thumbnail: {
      url: gi.avatars[0].image,
    },
    fields: [
      {
        name: '활동 일수',
        value: gi.stats.active_day_number.toString(),
        inline: true,
      },
      {
        name: '업적 달성 개수',
        value: gi.stats.achievement_number.toString(),
        inline: true,
      },
      {
        name: '획득 캐릭터 수',
        value: gi.stats.avatar_number.toString(),
        inline: true,
      },
      {
        name: '워프포인트 개방',
        value: gi.stats.way_point_number.toString(),
        inline: true,
      },
      {
        name: '바람 신의 눈동자',
        value: gi.stats.anemoculus_number.toString(),
        inline: true,
      },
      {
        name: '바위 신의 눈동자',
        value: gi.stats.geoculus_number.toString(),
        inline: true,
      },
      {
        name: '번개 신의 눈동자',
        value: gi.stats.electroculus_number.toString(),
        inline: true,
      },
      {
        name: '비경 개방',
        value: gi.stats.domain_number.toString(),
        inline: true,
      },
      {
        name: '나선 비경',
        value: gi.stats.spiral_abyss,
        inline: true,
      },
      {
        name: '화려한 보물상자',
        value: gi.stats.luxurious_chest_number.toString(),
        inline: true,
      },
      {
        name: '진귀한 보물상자',
        value: gi.stats.precious_chest_number.toString(),
        inline: true,
      },
      {
        name: '정교한 보물상자',
        value: gi.stats.exquisite_chest_number.toString(),
        inline: true,
      },
      {
        name: '평범한 보물상자',
        value: gi.stats.common_chest_number.toString(),
        inline: true,
      },
      {
        name: '신묘한 보물상자',
        value: gi.stats.magic_chest_number.toString(),
        inline: true,
      },
    ],
    footer: {
      text: hoyolabFooter,
    },
  };

  const embed2 = {
    color: 3444715,
    title: '월드 탐사',
    thumbnail: {
      url:
        gi.homes?.[0]?.comfort_level_icon ??
        'https://upload-os-bbs.mihoyo.com/game_record/genshin/home/UI_Homeworld_Comfort_1.png',
    },
    fields: [
      ...explorations.reverse(),
      {
        name: '속세의 주전자',
        value:
          gi.homes?.length > 0
            ? `신뢰 등급 : Lv.${gi.homes[0].level}\n` +
              `선계 선력 : ${gi.homes[0].comfort_num} - ${gi.homes[0].comfort_level_name}\n` +
              `획득한 장식 수 : ${gi.homes[0].item_num} 개\n` +
              `방문자 수 : ${gi.homes[0].visit_num} 명`
            : '속세의 주전자 정보가 없습니다.',
      },
    ],
    footer: {
      text: hoyolabFooter,
    },
  };

  return [embed, embed2];
};
