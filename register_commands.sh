#!/bin/bash

COMMANDS=(
    '{"name":"캐릭터","description":"원신의 캐릭터 정보를 검색합니다.","options":[{"type":1,"name":"프로필","description":"원신의 캐릭터 프로필 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"캐릭터의 이름, 속성, 무기, 부스탯, 등급으로 검색할 수 있습니다.","required":true}]},{"type":1,"name":"특성","description":"원신의 캐릭터 특성 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"캐릭터의 이름으로 검색할 수 있습니다.","required":true}]},{"type":1,"name":"별자리","description":"원신의 캐릭터 별자리 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"캐릭터의 이름으로 검색할 수 있습니다.","required":true}]},{"type":1,"name":"스탯","description":"원신의 캐릭터 스탯 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"캐릭터의 이름으로 검색할 수 있습니다.","required":true}]}]}' \
    '{"name":"무기","description":"원신의 무기 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"무기의 이름, 종류, 부스탯, 등급으로 검색할 수 있습니다.","required":true}]}' \
    '{"name":"아이템","description":"원신의 아이템 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"아이템의 이름, 사용 캐릭터, 사용 무기, 파밍 가능 요일로 검색할 수 있습니다.","required":true}]}' \
    '{"name":"레시피","description":"원신의 레시피 정보를 검색합니다.","options":[{"type":3,"name":"검색어","description":"레시피의 이름, 재료, 특수 요리 제작 캐릭터 이름으로 검색할 수 있습니다.","required":true}]}' \
    '{"name":"파밍","description":"오늘 파밍 가능한 원신 캐릭터, 무기 리스트를 검색합니다.","options":[{"type":3,"name":"요일","description":"원하는 요일을 지정하실 수 있습니다.","choices":[{"name":"월요일","value":"월요일"},{"name":"화요일","value":"화요일"},{"name":"수요일","value":"수요일"},{"name":"목요일","value":"목요일"},{"name":"금요일","value":"금요일"},{"name":"토요일","value":"토요일"},{"name":"일요일","value":"일요일"}]}]}' \
    '{"name":"호요랩","description":"호요랩의 유용한 기능을 이용합니다. 모든 기능을 이용하기 위해서는 쿠키 등록이 필요합니다.","options":[{"type":1,"name":"전적","description":"전적 정보를 검색합니다.","options":[{"type":3,"name":"종류","description":"조회할 전적 종류를 선택하세요.","required":true,"choices":[{"name":"일반","value":"general"},{"name":"실시간","value":"realtime"},{"name":"나선 비경","value":"spiralabyss"}]}]},{"type":1,"name":"리딤","description":"리딤코드를 입력합니다.","options":[{"type":3,"name":"값","description":"리딤코드를 입력하세요.","required":true}]},{"type":1,"name":"쿠키","description":"호요랩 쿠키를 등록/삭제합니다.","options":[{"type":3,"name":"값","description":"호요랩 로그인 쿠키를 입력하세요. 아무 것도 입력하지 않으면 등록된 쿠키를 삭제합니다."}]}]}'
    )

appid='false'
authtype='Bearer'
token='false'
guildid='false'

print_usage() {
  echo "
  Usage: ./register_commands.sh <your_app_id> -t <your_auth_token> [-b] [-g <target_guild_id>]
  
  Args
  <application_id>         Discord Application ID
  
  Flags
  -t <token>               (Required) Your auth token
  -b                       Use bot token instead of client credential token
  -g <guild_id>            Register guild commands
  -h, -?                   Help
  "
}

while getopts 't:bg:?h' flag; do
    case "${flag}" in
        t) token=${OPTARG};;
        b) authtype='Bot';;
        g) guildid=${OPTARG};;
        ?) print_usage
           exit 1 ;;
        h) print_usage
           exit 1 ;;
    esac
done

$appid = $1

if [ $appid = 'false' ]
then
    echo "Error : You should enter your application id"
    exit 1
fi

if [ $token = 'false' ]
then
    echo "Error : You should enter your authorization token"
    exit 1
fi

endpoint="https://discord.com/api/v8/applications/${appid}/commands"

if [ $guildid != 'false' ]
then
    endpoint="https://discord.com/api/v8/applications/${appid}/guilds/${guildid}/commands"
fi

for COMMAND in "${COMMANDS[@]}"; do
    curl -XPOST -H "Content-type: application/json"
            -H "Authorization: ${authtype} ${token}"
            -d "${COMMAND}"
            "${endpoint}"
done