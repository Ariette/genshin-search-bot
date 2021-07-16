const { verifyKey } = require('discord-interactions');
const { findCharacter, findWeapon, findTalent, findTalentStat, findConstellation, findMaterial, findFood, findDay, findCharacterStat } = require("./modules/find.js");

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

function response(data, headers) {
  const header = {
    "content-type": 'application/json;charset=UTF-8'
  };
  return new Response(JSON.stringify(data), { headers: Object.assign(header, headers), status: 200});
}

/**
 * @param {Request} request
 */
async function handleRequest(request) {
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
  if (headers.get('content-type')?.indexOf('application') != -1) {
    const body = JSON.parse(rawBody);
    
    // type 1 : Discord Webhook Validation
    if (body.type === 1) {
      return response({ type: 1 });
    } 
    // type 2 : Discord Slash Command Interaction
    else if (body.type === 2) {
      let query;
      if (body.data.options) {
        if (body.data.options[0].value) query = body.data.options[0].value;
        else query = body.data.options[0].options[0].value;
      } else {
        query = null;
      }
      switch (body.data.name) {
        case '캐릭터': {
          const options = body.data.options[0];
          if (options.name === '프로필') {
            try {
              const data = await findCharacter(query);
              return response({ type: 4, data: data });
            } catch (err) {
              console.log(err.message);
              return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
            }
          } else if (options.name === '특성') {
            try {
              const data = await findTalent(query);
              return response({ type: 4, data: data });
            } catch (err) {
              console.log(err.message);
              return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
            }
          } else if (options.name === '별자리') {
            try {
              const data = await findConstellation(query);
              return response({ type: 4, data: data });
            } catch (err) {
              console.log(err.message);
              return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
            }
          } else {
            try {
              const data = await findCharacterStat(query);
              return response({ type: 4, data: data });
            } catch (err) {
              console.log(err.message);
              return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
            }
          }
        }
        case '무기': {
          try {
            const data = await findWeapon(query);
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case '아이템': {
          try {
            const data = await findMaterial(query);
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case '레시피': {
          try {
            const data = await findFood(query);
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case '파밍': {
          try {
            const data = await findDay(query);
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        default:
          return new Response('Bad Request', { status: 400 });
      }
    }
    // type 3 : Discord Component Based Interaction
    else if (body.type === 3 ) {
      const query = body.message.embeds?.[0]?.title.split(' ')[0]
      switch (body.data.custom_id) {
        case 'character': {
          try {
            const data = await findCharacter(query);
            return response({ type: 7, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'talent': {
          try {
            const data = await findTalent(query);
            return response({ type: 7, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'constellation': {
          try {
            const data = await findConstellation(query);
            return response({ type: 7, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'stat': {
          try {
            const data = await findCharacterStat(query);
            return response({ type: 7, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'normal': {
          try {
            const data = await findTalentStat(query, 'normal');
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'elemental': {
          try {
            const data = await findTalentStat(query, 'elemental');
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        case 'burst': {
          try {
            const data = await findTalentStat(query, 'burst');
            return response({ type: 4, data: data });
          } catch (err) {
            console.log(err.message);
            return response({ type: 4, data: {content: '에러 발생!', flags: 64} });
          }
        }
        default:
          // 캐릭터 목록의 경우
          if (body.data.custom_id.indexOf('_c') == 0) {
            try {
              const data = await findCharacter(body.data.custom_id.slice(2));
              return response({ type: 7, data: data})
            } catch (err) {
              console.log(err.message);
              return response({ type: 7, data: {content: '에러 발생!', flags: 64} });
            }
          }
          // 무기 목록의 경우
          else if (body.data.custom_id.indexOf('_w') == 0) {
            try {
              const data = await findWeapon(body.data.custom_id.slice(2));
              return response({ type: 7, data: data})
            } catch (err) {
              console.log(err.message);
              return response({ type: 7, data: {content: '에러 발생!', flags: 64} });
            }
          }
          // 특성 목록의 경우
          else if (body.data.custom_id.indexOf('_t') == 0) {
            try {
              const data = await findTalent(body.data.custom_id.slice(2));
              return response({ type: 7, data: data})
            } catch (err) {
              console.log(err.message);
              return response({ type: 7, data: {content: '에러 발생!', flags: 64} });
            }
          }
          // 별자리 목록의 경우
          else if (body.data.custom_id.indexOf('_s') == 0) {
            try {
              const data = await findConstellation(body.data.custom_id.slice(2));
              return response({ type: 7, data: data})
            } catch (err) {
              console.log(err.message);
              return response({ type: 7, data: {content: '에러 발생!', flags: 64} });
            }
          }
          return new Response('Bad Request', { status: 400 });
      }
    }
  }
  // Maybe for browsers...
  return new Response('Forbidden', { status: 403 });
}