## Genshin Search Bot

Cloudflare Workers에서 동작하는 한국어 원신 정보 검색 디스코드 봇  
DB 구성에 사용된 데이터는 [Ariette/genshin-data-parse](https://github.com/Ariette/genshin-data-parse)를 참고하세요.

### How to Deploy

레포지토리를 클론하고 다음의 순서로 Deploy하세요.

- `npm install`
- `npx wrangler secret put DISCORD_PUBLIC_KEY`를 입력하고 본인의 디스코드 Public key를 입력하세요.
- `wrangler.toml` 파일의 `kv_namespaces` 부분을 본인의 것으로 교체하세요.
- `npm run deploy`
- Discord Developer Portal에서 앱의 엔드포인트를 본인의 워커 주소로 설정하세요.
- `./register_commands.sh`를 이용해 커맨드를 등록하세요.

```
 Usage: ./register_commands.sh <your_app_id> -t <your_auth_token> [-b] [-g <target_guild_id>]

 Args
 <application_id>         Discord Application ID

 Flags
 -t <token>               (Required) Your auth token
 -b                       Use bot token instead of client credential token
 -g <guild_id>            Register guild commands
 -h, -?                   Help
```

### To Do

- [ ] 성유물 검색 기능
- [ ] 레손실 알림 기능
- [ ] 자동 출석 체크 기능
- [ ] 특성 레벨업/돌파 재료 계산기
- [ ] 성유물 점수 계산기
- [x] 타입스크립트 도입
