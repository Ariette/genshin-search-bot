import { isChatInputApplicationCommandInteraction } from 'discord-api-types/utils/v10';
import { APIInteraction, APIInteractionResponse, InteractionType } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
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
import { assignCookie, getRecord, getRedeem } from './modules/hoyolab';
import { getOptionValue } from './modules/utils/getOptionValue';

declare const DISCORD_PUBLIC_KEY: string;

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
    const isVerified = verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isVerified) return new Response('Invalid Request', { status: 401 });
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
      // The bot only uses components inside embeds
      if (body.message.embeds?.length < 1) {
        return new Response('Bad Request', { status: 400 });
      }
      try {
        const query = body.message.embeds[0].title?.replace(/⭐️+/g, '')!;
        switch (body.data.custom_id) {
          case 'character': {
            const data = await findCharacter(query);
            return response({ type: 7, data });
          }
          case 'talent': {
            const data = await findTalent(query);
            return response({ type: 7, data });
          }
          case 'constellation': {
            const data = await findConstellation(query);
            return response({ type: 7, data });
          }
          case 'stat': {
            const data = await findCharacterStat(query);
            return response({ type: 7, data });
          }
          case 'normal': {
            const data = await findTalentStat(query, 'normal');
            return response({ type: 4, data });
          }
          case 'elemental': {
            const data = await findTalentStat(query, 'elemental');
            return response({ type: 4, data });
          }
          case 'burst': {
            const data = await findTalentStat(query, 'burst');
            return response({ type: 4, data });
          }
          default:
            // 캐릭터 목록의 경우
            if (body.data.custom_id.indexOf('_c') == 0) {
              const data = await findCharacter(body.data.custom_id.slice(2));
              return response({ type: 7, data });
            }
            // 무기 목록의 경우
            else if (body.data.custom_id.indexOf('_w') == 0) {
              const data = await findWeapon(body.data.custom_id.slice(2));
              return response({ type: 7, data });
            }
            // 특성 목록의 경우
            else if (body.data.custom_id.indexOf('_t') == 0) {
              const data = await findTalent(body.data.custom_id.slice(2));
              return response({ type: 7, data });
            }
            // 별자리 목록의 경우
            else if (body.data.custom_id.indexOf('_s') == 0) {
              const data = await findConstellation(body.data.custom_id.slice(2));
              return response({ type: 7, data });
            }
            return new Response('Bad Request', { status: 400 });
        }
      } catch (err) {
        console.log(err);
        return response({ type: 4, data: { content: '에러 발생! - ' + err.message, flags: 64 } });
      }
    }
  }
  // Maybe for browsers...
  return new Response('Forbidden', { status: 403 });
}
