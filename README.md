## Genshin Search Bot
Cloudflare Workers에서 동작하는 원신 정보 검색 디스코드 봇  
DB 구성에 사용된 데이터는 [Ariette/genshin-data-parse](https://github.com/Ariette/genshin-data-parse)를 참고하세요.

## How to
레포지토리를 클론하고 다음의 순서로 Deploy하세요.
 + `npm install`
 + `wrangler secret put DISCORD_PUBLIC_KEY` 로 디스코드 애플리케이션 Public Key를 입력하세요. 디스코드 인터랙션 엔드포인트 등록에 필요합니다.
 + `wrangler.toml` 파일의 `kv_namespaces` 부분을 본인의 것으로 교체하세요.
 + `npm run deploy`로 publish 해줍니다.
 + Discord Develtoper Portal에서 앱의 엔드포인트를 본인의 워커 주소로 설정하고 사용하시면 됩니다.

## 커맨드 등록
해당 봇은 슬래시 커맨드를 사용하며, 커맨드 등록은 수동으로 하셔야합니다.  
Postman이나 Thunder Client 같은 API Testing Tool을 이용해주세요.

```javascript
// deploy 전 등록이 필요한 커맨드 일람
[{
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
        description: '원하는 요일을 지정하실 수 있습니다.',
        choices: [{
          name: "월요일",
          value: "월요일"
        }, {
          name: "화요일",
          value: "화요일"
        }, {
          name: "수요일",
          value: "수요일"
        }, {
          name: "목요일",
          value: "목요일"
        }, {
          name: "금요일",
          value: "금요일"
        }, {
          name: "토요일",
          value: "토요일"
        }, {
          name: "일요일",
          value: "일요일"
        }]
    }]
  }]
```