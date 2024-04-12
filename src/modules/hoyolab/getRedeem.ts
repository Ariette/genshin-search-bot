import { getOptionValue } from '../utils/getOptionValue';
import { GamesEnum, GenshinClient, GenshinRegion } from '../client';
import { Message } from '../messages';
import { InteractionHandler } from '../../interface';
import {
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  ButtonStyle,
  ComponentType,
  MessageFlags,
  TextInputStyle,
} from 'discord-api-types/v10';
import { CustomIdPrefix } from '../..';

export const getRedeem: InteractionHandler = async (body) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = getOptionValue(body.data.options?.[0]!) as string;
  const client = await GenshinClient.fromKey(key);

  if (value) {
    const uid = await client.fetchUid();
    const result = await client.getRedeem(uid, value);
    return { content: result ?? Message.WRONG_RESPONSE_ERROR, flags: MessageFlags.Ephemeral };
  } else {
    return {
      content: '원하는 게임을 선택하세요',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Secondary,
              disabled: true,
              custom_id: CustomIdPrefix.REDEEM_SELECT_GAME + GamesEnum.HONKAI_IMPACT,
              label: '붕괴 3rd',
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              custom_id: CustomIdPrefix.REDEEM_SELECT_GAME + GamesEnum.GENSHIN_IMPACT,
              label: '원신',
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              custom_id: CustomIdPrefix.REDEEM_SELECT_GAME + GamesEnum.HONKAI_STAR_RAIL,
              label: '붕괴:스타레일',
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              custom_id: CustomIdPrefix.REDEEM_SELECT_GAME + GamesEnum.TEARS_OF_THEMIS,
              label: '미해결사건부',
            },
          ],
        },
      ],
      flags: MessageFlags.Ephemeral,
    };
  }
};

export const selectGame: InteractionHandler<APIMessageComponentInteraction> = async (body) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const gameBiz = body.data.custom_id.slice(CustomIdPrefix.REDEEM_SELECT_GAME.length) as GamesEnum;
  const client = await GenshinClient.fromKey(key);
  const { list } = await client.getGameRegions(gameBiz);
  return {
    content: '서버를 선택하세요.',
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            custom_id: CustomIdPrefix.REDEEM_SELECT_SERVER,
            placeholder: '서버를 선택하세요.',
            max_values: 1,
            min_values: 1,
            options: list.map((item) => ({
              label: item.name,
              value: `${gameBiz}/${item.region}`,
            })),
          },
        ],
      },
    ],
  };
};

export const selectRegion: InteractionHandler<APIMessageComponentInteraction> = async (body) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const value = (body as APIMessageComponentSelectMenuInteraction).data.values[0];
  const [gameBiz, region] = value.split('/') as [GamesEnum, GenshinRegion];
  const client = await GenshinClient.fromKey(key);
  const { list } = await client.getGameRoles(gameBiz, region);
  if (!list.length) {
    return { content: '캐릭터를 찾을 수 없습니다. 다른 서버를 선택해주세요.' };
  }
  return {
    content: '캐릭터를 선택하세요.',
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            custom_id: CustomIdPrefix.REDEEM_SELECT_CHARACTER,
            placeholder: '캐릭터를 선택하세요.',
            max_values: 1,
            min_values: 1,
            options: list.map((item, idx) => ({
              label: `${item.nickname} (Lv.${item.level})`,
              value: `${gameBiz}/${region}/${item.game_uid}`,
            })),
          },
        ],
      },
    ],
  };
};

export const selectCharacter: InteractionHandler<
  APIMessageComponentInteraction,
  never[],
  APIModalInteractionResponseCallbackData
> = async (body) => {
  const value = (body as APIMessageComponentSelectMenuInteraction).data.values[0];
  return {
    title: '리딤 코드를 입력하세요.',
    custom_id: CustomIdPrefix.REDEEM_INPUT,
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.TextInput,
            style: TextInputStyle.Short,
            custom_id: value,
            label: '리딤 코드',
            required: true,
            min_length: 1,
          },
        ],
      },
    ],
  };
};

export const getRedeemAdvanced: InteractionHandler<APIModalSubmitInteraction> = async (body) => {
  const key = `${body.guild_id}/${body.member?.user.id}`;
  const [gameBiz, region, uid] = body.data.components[0].components[0].custom_id.split('/') as [
    GamesEnum,
    GenshinRegion,
    string,
  ];
  const cdKey = body.data.components[0].components[0].value;
  const client = await GenshinClient.fromKey(key);
  const result = await client.getRedeem(uid, cdKey, gameBiz, region);
  return { content: result ?? Message.WRONG_RESPONSE_ERROR, flags: MessageFlags.Ephemeral };
};
