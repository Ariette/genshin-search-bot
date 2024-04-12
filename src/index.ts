import { isChatInputApplicationCommandInteraction } from 'discord-api-types/utils/v10';
import {
  APIInteraction,
  APIInteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import {
  findCharacter,
  findCharacterStat,
  findConstellation,
  findDay,
  findFood,
  findMaterial,
  findTalent,
  findTalentStat,
  findWeapon,
} from './modules/find';
import {
  assignCookie,
  getRecord,
  getRedeem,
  getRedeemAdvanced,
  selectCharacter,
  selectGame,
  selectRegion,
} from './modules/hoyolab';
import { getOptionValue } from './modules/utils/getOptionValue';
import { verifyKey } from './modules/utils/verifyKey';

declare const DISCORD_PUBLIC_KEY: string;

export const enum CustomIdPrefix {
  REDEEM_SELECT_GAME = '_redeem_game_',
  REDEEM_SELECT_SERVER = '_redeem_server_',
  REDEEM_SELECT_CHARACTER = '_redeem_character_',
  REDEEM_INPUT = '_redeem_input_',
  CHARACTER_LIST = '_c',
  WEAPON_LIST = '_w',
  TALENT_LIST = '_t',
  CONSTELLATION_LIST = '_s',
}

addEventListener('fetch', (event: any) => {
  event.respondWith(handleRequest(event.request));
});

function response(data: APIInteractionResponse, headers?: HeadersInit) {
  const header = {
    'content-type': 'application/json;charset=UTF-8',
  };
  return new Response(JSON.stringify(data), { headers: Object.assign(header, headers), status: 200 });
}

async function handleRequest(request: Request) {
  const { headers } = request;
  const rawBody = await request.text();

  // Verify Discord Request Signature Before Start Logic
  const signature = headers.get('X-Signature-Ed25519');
  const timestamp = headers.get('X-Signature-Timestamp');
  if (signature && timestamp) {
    const isVerified = await verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isVerified) {
      return new Response('Invalid Request', { status: 401 });
    }
  }

  // Now Start Logic
  if (headers.get('content-type')?.includes('json')) {
    const body: APIInteraction = JSON.parse(rawBody);

    // type 1 : Discord Webhook Validation
    if (body.type === InteractionType.Ping) {
      return response({ type: 1 });
    }
    // type 2 : Discord Slash Command Interaction
    else if (body.type === InteractionType.ApplicationCommand) {
      // The bot only uses ChatInput command
      if (!isChatInputApplicationCommandInteraction(body)) {
        return new Response('Bad Request', { status: 400 });
      }
      try {
        const { name, options } = body.data;
        const option = options?.[0]!;
        const query = getOptionValue(option) as string;

        switch (name) {
          case '캐릭터': {
            if (option.name === '프로필') {
              const data = await findCharacter(query);
              return response({ type: 4, data });
            } else if (option.name === '특성') {
              const data = await findTalent(query);
              return response({ type: 4, data });
            } else if (option.name === '별자리') {
              const data = await findConstellation(query);
              return response({ type: 4, data });
            } else {
              const data = await findCharacterStat(query);
              return response({ type: 4, data });
            }
          }
          case '무기': {
            const data = await findWeapon(query);
            return response({ type: 4, data });
          }
          case '아이템': {
            const data = await findMaterial(query);
            return response({ type: 4, data });
          }
          case '레시피': {
            const data = await findFood(query);
            return response({ type: 4, data });
          }
          case '파밍': {
            const data = await findDay(query);
            return response({ type: 4, data });
          }
          case '호요랩': {
            if (option.name === '쿠키') {
              const data = await assignCookie(body);
              return response({ type: 4, data });
            } else if (option.name === '리딤') {
              const data = await getRedeem(body);
              return response({ type: 4, data });
            } else {
              const data = await getRecord(body);
              return response({ type: 4, data });
            }
          }
          default:
            return new Response('Bad Request', { status: 400 });
        }
      } catch (err) {
        console.log(err);
        return response({ type: 4, data: { content: '에러 발생! - ' + err.message, flags: 64 } });
      }
    }
    // type 3 : Discord Component Based Interaction
    else if (body.type === InteractionType.MessageComponent) {
      try {
        const query = body.message.embeds[0]?.title?.replace(/⭐️+/g, '') ?? '';
        switch (body.data.custom_id) {
          case 'character': {
            const data = await findCharacter(query);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
          case 'talent': {
            const data = await findTalent(query);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
          case 'constellation': {
            const data = await findConstellation(query);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
          case 'stat': {
            const data = await findCharacterStat(query);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
          case 'normal': {
            const data = await findTalentStat(query, 'normal');
            return response({ type: InteractionResponseType.ChannelMessageWithSource, data });
          }
          case 'elemental': {
            const data = await findTalentStat(query, 'elemental');
            return response({ type: InteractionResponseType.ChannelMessageWithSource, data });
          }
          case 'burst': {
            const data = await findTalentStat(query, 'burst');
            return response({ type: InteractionResponseType.ChannelMessageWithSource, data });
          }
          case CustomIdPrefix.REDEEM_SELECT_SERVER: {
            const data = await selectRegion(body);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
          case CustomIdPrefix.REDEEM_SELECT_CHARACTER: {
            const data = await selectCharacter(body);
            return response({ type: InteractionResponseType.Modal, data });
          }
          default:
            // 캐릭터 목록의 경우
            if (body.data.custom_id.indexOf(CustomIdPrefix.CHARACTER_LIST) == 0) {
              const data = await findCharacter(body.data.custom_id.slice(2));
              return response({ type: InteractionResponseType.UpdateMessage, data });
            }
            // 무기 목록의 경우
            else if (body.data.custom_id.indexOf(CustomIdPrefix.WEAPON_LIST) == 0) {
              const data = await findWeapon(body.data.custom_id.slice(2));
              return response({ type: InteractionResponseType.UpdateMessage, data });
            }
            // 특성 목록의 경우
            else if (body.data.custom_id.indexOf(CustomIdPrefix.TALENT_LIST) == 0) {
              const data = await findTalent(body.data.custom_id.slice(2));
              return response({ type: InteractionResponseType.UpdateMessage, data });
            }
            // 별자리 목록의 경우
            else if (body.data.custom_id.indexOf(CustomIdPrefix.CONSTELLATION_LIST) == 0) {
              const data = await findConstellation(body.data.custom_id.slice(2));
              return response({ type: InteractionResponseType.UpdateMessage, data });
            }
            // 리딤코드 게임 선택
            else if (body.data.custom_id.indexOf(CustomIdPrefix.REDEEM_SELECT_GAME) == 0) {
              const data = await selectGame(body);
              return response({ type: InteractionResponseType.UpdateMessage, data });
            }
            return new Response('Bad Request', { status: 400 });
        }
      } catch (err) {
        console.log(err);
        return response({ type: 4, data: { content: '에러 발생! - ' + err.message, flags: 64 } });
      }
    }
    // type 4 : Modal Submit
    else if (body.type === InteractionType.ModalSubmit) {
      try {
        switch (body.data.custom_id) {
          case CustomIdPrefix.REDEEM_INPUT: {
            const data = await getRedeemAdvanced(body);
            return response({ type: InteractionResponseType.UpdateMessage, data });
          }
        }
      } catch (err) {
        console.log(err);
        return response({
          type: InteractionResponseType.UpdateMessage,
          data: { content: '에러 발생! - ' + err.message, components: [], flags: MessageFlags.Ephemeral },
        });
      }
    }
  }
  // Maybe for browsers...
  return new Response('Forbidden', { status: 403 });
}
