import { APIMessage } from 'discord-api-types/v10';
import { chrstEmbed } from '../../embeds';
import { CloudflareKV, Curve, Stat } from '../../interface';
import { findQuery } from './common';

declare const DB: CloudflareKV;

export const findCharacterStat = async (args: string): Promise<Partial<APIMessage>> => {
  const curve = await DB.get<Curve>('curve', { type: 'json' });
  if (!curve) return { content: '에러 발생!' };
  const results = await findQuery<Stat>('stat', args);
  const embed = chrstEmbed(results[0], curve);
  const buttons = [
    { type: 2, style: 1, custom_id: 'character', label: '캐릭터' },
    { type: 2, style: 1, custom_id: 'talent', label: '특성' },
    { type: 2, style: 1, custom_id: 'constellation', label: '별자리' },
  ];
  return { embeds: [embed], components: [{ type: 1, components: buttons }] };
};
