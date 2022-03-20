import { APIMessage } from 'discord-api-types/v10';
import { missingCharacter } from '../../config/message.json';
import { csEmbed } from '../../embeds';
import { Constellation } from '../../interface';
import { findQuery } from './common';

export const findConstellation = async (args: string): Promise<Partial<APIMessage>> => {
  const results = await findQuery<Constellation>('constellation', args);
  if (results.length < 1) {
    return { content: missingCharacter };
  } else if (results.length == 1) {
    const embed = csEmbed(results[0]);
    const buttons = [
      { type: 2, style: 1, custom_id: 'character', label: '캐릭터' },
      { type: 2, style: 1, custom_id: 'talent', label: '특성' },
      { type: 2, style: 1, custom_id: 'stat', label: '스탯' },
    ];
    return { embeds: [embed], components: [{ type: 1, components: buttons }] };
  } else if (results.length < 6) {
    const embed = {
      title: args + ' 검색 결과',
      footer: {
        text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.',
      },
    };
    const buttons = [];
    for (const result of results) {
      buttons.push({ type: 2, style: 2, custom_id: '_s' + result.character, label: result.character });
    }
    return { embeds: [embed], components: [{ type: 1, components: buttons }] };
  } else {
    return { content: `\`검색 결과>>\` ${results.map(w => w.character).join(', ')}` };
  }
};
