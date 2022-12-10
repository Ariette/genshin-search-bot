import { APIButtonComponent, APIMessage } from 'discord-api-types/v10';
import { missingWeapon } from '../../config/message.json';
import { wpEmbed } from '../../embeds';
import { Weapon } from '../../interface';
import { findQuery } from './common';

export const findWeapon = async (args: string): Promise<Partial<APIMessage>> => {
  const results = await findQuery<Weapon>('weapon', args);
  if (results.length < 1) {
    return { content: missingWeapon };
  } else if (results.length == 1) {
    const embed = wpEmbed(results[0]);
    return { embeds: [embed] };
  } else if (results.length < 6) {
    const embed = {
      title: args + ' 검색 결과',
      footer: {
        text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.',
      },
    };
    const buttons: APIButtonComponent[] = [];
    for (const result of results) {
      buttons.push({ type: 2, style: 2, custom_id: '_w' + result.name, label: result.name });
    }
    return { embeds: [embed], components: [{ type: 1, components: buttons }] };
  } else {
    return { content: `\`검색 결과>>\` ${results.map((w) => w.name).join(', ')}` };
  }
};
