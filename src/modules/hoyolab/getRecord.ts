import { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import { dnEmbed, giEmbed, saEmbed } from '../../embeds';
import { getOptionValue } from '../utils/getOptionValue';
import { GenshinClient } from '../client';

export const getRecord = async (body: APIChatInputApplicationCommandInteraction) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!);
  const client = await GenshinClient.fromKey(key);
  const uid = await client.fetchUid();

  switch (value) {
    case 'general': {
      const data = await client.getGeneralRecord(uid);
      const embeds = giEmbed(data);
      return { embeds: embeds };
    }
    case 'spiralabyss': {
      const data = await client.getSpiralabyssRecord(uid);
      if (data.floors.length === 0) {
        return { content: '이번 시즌에 나선 비경에 도전하지 않았습니다.' };
      }
      const embed = saEmbed(data);
      return { embeds: [embed] };
    }
    default: {
      try {
        const data = await client.getDailynote(uid);
        const embed = dnEmbed(data);
        return { embeds: [embed] };
      } catch (err) {
        await client.updateGameRecordSwitch(true, 3, 2);
        const data = await client.getDailynote(uid);
        const embed = dnEmbed(data);
        return { embeds: [embed] };
      }
    }
  }
};
