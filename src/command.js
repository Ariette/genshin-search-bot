const Discord = require('./modules/api.js');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
function handleRequest(request) {
  const commands = [{
    name: '캐릭터',
    description: '원신의 캐릭터 정보를 검색합니다.',
    options: [{
      type: 1,
      name: '프로필',
      description: '원신의 캐릭터 프로필 정보를 검색합니다.',
      options: [{
        type: 3,
        name: '검색어',
        description: '캐릭터의 이름, 속성, 무기, 부스탯, 등급으로 검색할 수 있습니다.',
        required: true
      }]
    }, {
      type: 1,
      name: '특성',
      description: '원신의 캐릭터 특성 정보를 검색합니다.',
      options: [{
        type: 3,
        name: '검색어',
        description: '캐릭터의 이름으로 검색할 수 있습니다.',
        required: true
      }]
    }, {
      type: 1,
      name: '별자리',
      description: '원신의 캐릭터 별자리 정보를 검색합니다.',
      options: [{
        type: 3,
        name: '검색어',
        description: '캐릭터의 이름으로 검색할 수 있습니다.',
        required: true
      }]
    }, {
      type: 1,
      name: '스탯',
      description: '원신의 캐릭터 스탯 정보를 검색합니다.',
      options: [{
        type: 3,
        name: '검색어',
        description: '캐릭터의 이름으로 검색할 수 있습니다.',
        required: true
      }]
    }]
  }, {
    name: '무기',
    description: '원신의 무기 정보를 검색합니다.',
    options: [{
        type: 3,
        name: '검색어',
        description: '무기의 이름, 종류, 부스탯, 등급으로 검색할 수 있습니다.',
        required: true
    }]
  }, {
    name: '아이템',
    description: '원신의 아이템 정보를 검색합니다.',
    options: [{
        type: 3,
        name: '검색어',
        description: '아이템의 이름, 사용 캐릭터, 사용 무기, 파밍 가능 요일로 검색할 수 있습니다.',
        required: true
    }]
  }, {
    name: '레시피',
    description: '원신의 레시피 정보를 검색합니다.',
    options: [{
        type: 3,
        name: '검색어',
        description: '레시피의 이름, 재료, 특수 요리 제작 캐릭터 이름으로 검색할 수 있습니다.',
        required: true
    }]
  }, {
    name: '파밍',
    description: '오늘 파밍 가능한 원신 캐릭터, 무기 리스트를 검색합니다.',
    options: [{
        type: 3,
        name: '요일',
        description: '원하는 요일을 지정하실 수 있습니다.'
    }]
  }];
  for (const command of commands) {
    Discord(`applications/${DISCORD_APPLICATION_ID}/guilds/561445185314095114/commands`, command).then(response => {
        console.log('/' + command.name + ' 명령어 등록 완료');
      }).catch(err => {
        console.error(err);
      })
  }

  return new Response('Invalid Request', { status: 403 });
}