import { APIButtonComponent } from 'discord-api-types/v10';
import { tEmbed } from '../../embeds';
import { InteractionHandler, Talent } from '../../interface';
import { findQuery } from './common';
import { Message } from '../messages';

export const findTalent: InteractionHandler<string> = async (args) => {
  const results = await findQuery<Talent>('talent', args);
  if (results.length < 1) {
    return { content: Message.MISSING_CHARACTER_ERROR };
  } else if (results.length == 1) {
    const embed = tEmbed(results[0]);
    const buttons = [
      { type: 2, style: 2, custom_id: 'normal', label: '평타 계수' },
      { type: 2, style: 2, custom_id: 'elemental', label: '스킬 계수' },
      { type: 2, style: 2, custom_id: 'burst', label: '원소폭발 계수' },
      { type: 2, style: 1, custom_id: 'character', label: '캐릭터' },
      { type: 2, style: 1, custom_id: 'constellation', label: '별자리' },
    ];
    return { embeds: [embed], components: [{ type: 1, components: buttons }] };
  } else if (results.length < 6) {
    const embed = {
      title: args + ' 검색 결과',
      footer: {
        text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.',
      },
    };
    const buttons: APIButtonComponent[] = [];
    for (const result of results) {
      buttons.push({ type: 2, style: 2, custom_id: '_t' + result.character, label: result.character });
    }
    return { embeds: [embed], components: [{ type: 1, components: buttons }] };
  } else {
    return { content: `\`검색 결과>>\` ${results.map((w) => w.character).join(', ')}` };
  }
};
