import { hoyolabFooter } from '../config/message.json';
import { APIEmbed } from 'discord-api-types/v10';
import { DailyNote } from '../interface';

export const dnEmbed = (dn: DailyNote) => {
  console.log(dn);
  const ongoingExpedition = dn.expeditions.filter((w) => w.status === 'Ongoing');
  const expeditionLeftTime =
    ongoingExpedition.length > 0 ? Math.max(...ongoingExpedition.map((w) => parseInt(w.remained_time))) : 0;

  const embed: APIEmbed = {
    color: 3444715,
    title: '데일리 노트',
    thumbnail: {
      url: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d0/Icon_Emoji_002_Paimon_Ship_out%21.png',
    },
    fields: [
      {
        name: '레진',
        value: `${dn.current_resin}/${dn.max_resin}, 충전 완료${
          dn.resin_recovery_time != '0' ? convertSecToHour(dn.resin_recovery_time) : ''
        }`,
      },
      {
        name: '탐사 파견',
        value: `${dn.current_expedition_num}/${dn.max_expedition_num} 파견중, 탐사 완료${
          expeditionLeftTime > 0 ? `${convertSecToHour(expeditionLeftTime)}` : ''
        }`,
      },
      {
        name: '선계 주화',
        value: `${dn.current_home_coin}/${dn.max_home_coin}, 충전 완료${
          dn.home_coin_recovery_time != '0' ? convertSecToHour(dn.home_coin_recovery_time) : ''
        }`,
      },
      {
        name: '일일 임무',
        value: dn.is_extra_task_reward_received ? '완료' : `${dn.finished_task_num}/${dn.total_task_num} 완료`,
        inline: true,
      },
      {
        name: '주간 보스',
        value: `${dn.resin_discount_num_limit - dn.remain_resin_discount_num}/${dn.resin_discount_num_limit} 완료`,
        inline: true,
      },
    ],
    footer: {
      text: hoyolabFooter,
    },
  };

  return embed;
};

const convertSecToHour = (sec) => {
  let time = sec;
  if (typeof sec === 'string') {
    time = parseInt(sec);
  }
  const date = new Date(0);
  date.setSeconds(time);
  const hour = date.getUTCHours();
  const min = date.getUTCMinutes();

  return hour > 0 ? `까지 ${hour}시간 ${min}분` : `까지 ${min}분`;
};