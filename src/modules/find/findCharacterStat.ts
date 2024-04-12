import { chrstEmbed } from '../../embeds';
import { CloudflareKV, Curve, InteractionHandler, Stat } from '../../interface';
import { findQuery } from './common';
import { Message } from '../messages';

declare const DB: CloudflareKV;

export const findCharacterStat: InteractionHandler<string> = async (args) => {
  const curve = await DB.get<Curve>('curve', { type: 'json' });
  if (!curve) return { content: Message.COMMON_ERROR };
  const results = await findQuery<Stat>('stat', args);
  const embed = chrstEmbed(results[0], curve);
  const buttons = [
    { type: 2, style: 1, custom_id: 'character', label: '캐릭터' },
    { type: 2, style: 1, custom_id: 'talent', label: '특성' },
    { type: 2, style: 1, custom_id: 'constellation', label: '별자리' },
  ];
  return { embeds: [embed], components: [{ type: 1, components: buttons }] };
};
