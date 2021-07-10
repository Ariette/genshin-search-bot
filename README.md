## Genshin Search Bot
Cloudflare Workers에서 동작하는 원신 정보 검색 디스코드 봇  
DB 구성에 필요한 데이터는 [Ariette/genshin-data-parse](https://github.com/Ariette/genshin-data-parse)를 참고하세요.

## How to
 + 레포지토리를 클론하고 다음의 순서로 Deploy하세요.
 + `npm install`
 + wrangler.toml에 필요한 변수들을 채워넣으세요. 필요한 경우 `wrangler put secret` 명령을 이용해 보안을 유지하세요.
   + `DISCORD_APPLICATION_ID` : 디스코드 애플리케이션 ID
   + `DISCORD_PUBLIC_KEY` : 디스코드 애플리케이션 Public Key
   + (선택) `DISCORD_CLIENT_CREDENTIAL` : 디스코드 애플리케이션 인증 정보. 커맨드 등록할 때만 필요하고, 봇 인증 정보로 대체할 수 있습니다.
   + (선택) `DISCORD_BOT_TOKEN` : 디스코드 봇 인증 정보. 커맨드 등록할 때만 필요하고, 애플리케이션 인증 정보로 대체할 수 있습니다.
   + 그 외에 `account_id`와 kv_namespaces의 `id`를 본인의 것으로 교체하세요.
 + `npm run database`로 데이터베이스를 빌드하고 KV에 올려둡니다.
 + `npm run deploy`로 publish 해줍니다.
 + Discord Develtoper Portal에서 앱의 엔드포인트를 본인의 워커 주소로 설정하고 사용하시면 됩니다.

## 커맨드 등록
커맨드 등록은 `command.js`를 참고(`npm run command` 이용)하실 수 있지만, 그냥 Postman이나 다른 REST API Testing 툴을 이용해서 GUI로 작업하시는 게 훨씬 직관적이고 편합니다.