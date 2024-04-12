export const enum Message {
  // error message
  COMMON_ERROR = '에러 발생!',
  WRONG_COOKIE_ERROR = '쿠키 값이 잘못되었습니다. 다시 입력해주세요.',
  CANNOT_FIND_CARD_ERROR = '원신 계정을 찾을 수 없습니다. 올바른 아이디로 로그인 되었는지 확인해주세요.',
  WRONG_RESPONSE_ERROR = '통신 실패! 응답이 올바르지 않습니다.',
  MISSING_COOKIE_ERROR = '먼저 쿠키를 등록해주세요.',
  MISSING_CHARACTER_ERROR = '그런 캐릭터는 몰라!',
  MISSING_WEAPON_ERROR = '그런 무기는 몰라!',
  MISSING_ARTIFACT_ERROR = '그런 성유물은 몰라!',
  MISSING_ITEM_ERROR = '그런 아이템은 몰라!',

  // common message
  FOOTER_TEXT = '데이터는 호요랩 갱신 시점을 기준으로 하며, 실제 인게임 데이터와 오차가 있을 수 있습니다.',
}
