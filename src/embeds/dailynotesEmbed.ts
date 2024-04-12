import { APIEmbed } from 'discord-api-types/v10';
import type { IGenshinDailyNote } from 'hoyoapi';
import { Message } from '../modules/messages';

export const dnEmbed = (dn: IGenshinDailyNote) => {
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
      {
        name: '변환기',
        value: dn.transformer.obtained ? stringifyRecoveryTime(dn.transformer.recovery_time) : '미획득',
        inline: true,
      },
    ],
    footer: {
      text: Message.FOOTER_TEXT,
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
  const day = date.getUTCDate() - 1;
  const hour = date.getUTCHours();
  const min = date.getUTCMinutes();

  const strs: string[] = [];
  if (day > 0) strs.push(day + '일');
  if (hour > 0) strs.push(hour + '시간');
  if (min > 0) strs.push(min + '분');

  return strs.length > 0 ? '까지 ' + strs.join(' ') : '까지 1분 미만';
};

const stringifyRecoveryTime = (data: IGenshinDailyNote['transformer']['recovery_time']) => {
  const { Day, Hour, Minute, reached } = data;
  if (reached) return '변환 가능';

  const strs: string[] = [];
  if (Day > 0) strs.push(Day + '일');
  if (Hour > 0) strs.push(Hour + '시간');
  if (Minute > 0) strs.push(Minute + '분');

  return strs.length > 0 ? '앞으로 ' + strs.join(' ') : '앞으로 1분 미만';
};
