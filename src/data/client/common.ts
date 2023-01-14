import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';

const endpoint = 'https://api.ambr.top/v2/kr';
export const $ = axios.create({
  baseURL: endpoint,
  adapter: cacheAdapterEnhancer(axios.defaults.adapter),
});

export const weaponTypes = {
  WEAPON_NONE: '알 수 없는 무기',
  WEAPON_CROSSBOW: '석궁',
  WEAPON_STAFF: '지팡이',
  WEAPON_DOUBLE_DAGGER: '쌍단검',
  WEAPON_KATANA: '태도',
  WEAPON_SHURIKEN: '수리검',
  WEAPON_STICK: '봉',
  WEAPON_SPEAR: '장병기',
  WEAPON_SHIELD_SMALL: '방패',
  WEAPON_CATALYST: '법구',
  WEAPON_CLAYMORE: '양손검',
  WEAPON_BOW: '활',
  WEAPON_POLE: '장병기',
  WEAPON_SWORD: '한손검',
};
export type WeaponType = keyof typeof weaponTypes;

export const elementTypes = {
  Ice: '얼음',
  Wind: '바람',
  Electric: '번개',
  Water: '물',
  Fire: '불',
  Rock: '바위',
  Grass: '풀',
};
export type ElementType = keyof typeof elementTypes;

export const propTypes = {
  FIGHT_PROP_BASE_HP: '기초 HP',
  FIGHT_PROP_HP: 'HP',
  FIGHT_PROP_HP_PERCENT: 'HP',
  FIGHT_PROP_BASE_ATTACK: '기초 공격력',
  FIGHT_PROP_ATTACK: '공격력',
  FIGHT_PROP_ATTACK_PERCENT: '공격력',
  FIGHT_PROP_BASE_DEFENSE: '기초 방어력',
  FIGHT_PROP_DEFENSE: '방어력',
  FIGHT_PROP_DEFENSE_PERCENT: '방어력',
  FIGHT_PROP_BASE_SPEED: '이동속도',
  FIGHT_PROP_SPEED_PERCENT: '이동속도',
  FIGHT_PROP_CRITICAL: '치명타 확률',
  FIGHT_PROP_ANTI_CRITICAL: '치명타 내성',
  FIGHT_PROP_CRITICAL_HURT: '치명타 피해',
  FIGHT_PROP_ELEMENT_MASTERY: '원소 마스터리',
  FIGHT_PROP_CHARGE_EFFICIENCY: '원소 충전 효율',
  FIGHT_PROP_ADD_HURT: '피해 증가',
  FIGHT_PROP_SUB_HURT: '받는 피해 감면',
  FIGHT_PROP_HEAL_ADD: '치유 보너스',
  FIGHT_PROP_HEALED_ADD: '받는 치유 보너스',
  FIGHT_PROP_FIRE_ADD_HURT: '불 원소 피해 보너스',
  FIGHT_PROP_FIRE_SUB_HURT: '불 원소 내성',
  FIGHT_PROP_WATER_ADD_HURT: '물 원소 피해 보너스',
  FIGHT_PROP_WATER_SUB_HURT: '물 원소 내성',
  FIGHT_PROP_GRASS_ADD_HURT: '풀 원소 피해 보너스',
  FIGHT_PROP_GRASS_SUB_HURT: '풀 원소 내성',
  FIGHT_PROP_ELEC_ADD_HURT: '번개 원소 피해 보너스',
  FIGHT_PROP_ELEC_SUB_HURT: '번개 원소 내성',
  FIGHT_PROP_ICE_ADD_HURT: '얼음 원소 피해 보너스',
  FIGHT_PROP_ICE_SUB_HURT: '얼음 원소 내성',
  FIGHT_PROP_WIND_ADD_HURT: '바람 원소 피해 보너스',
  FIGHT_PROP_WIND_SUB_HURT: '바람 원소 내성',
  FIGHT_PROP_PHYSICAL_ADD_HURT: '물리 피해 보너스',
  FIGHT_PROP_PHYSICAL_SUB_HURT: '물리 내성',
  FIGHT_PROP_ROCK_ADD_HURT: '바위 원소 피해 보너스',
  FIGHT_PROP_ROCK_SUB_HURT: '바위 원소 내성',
  FIGHT_PROP_EFFECT_HIT: '효과 명중',
  FIGHT_PROP_EFFECT_RESIST: '효과 내성',
  FIGHT_PROP_FREEZE_SHORTEN: '빙결 시간 감소',
  FIGHT_PROP_TORPOR_SHORTEN: '마비 시간 감소',
  FIGHT_PROP_DIZZY_SHORTEN: '기절 시간 감소',
  FIGHT_PROP_MAX_HP: 'HP 최대치',
  FIGHT_PROP_CUR_ATTACK: '공격력',
  FIGHT_PROP_CUR_DEFENSE: '방어력',
  FIGHT_PROP_CUR_SPEED: '이동속도',
  FIGHT_PROP_CUR_HP: 'HP',
  FIGHT_PROP_SKILL_CD_MINUS_RATIO: '재사용 대기시간 감소',
  FIGHT_PROP_SHIELD_COST_MINUS_RATIO: '보호막 강화',
  FIGHT_PROP_ATTACK_PERCENT_A: '공격력 백분율',
  FIGHT_PROP_DEFENSE_PERCENT_A: '방어력 백분율',
  FIGHT_PROP_HP_PERCENT_A: 'HP 백분율',
};
export type PropType = keyof typeof propTypes;

export const materialTypes = {
  forgingOre: '단조용 광석',
  cookingIngredient: '식자재',
  material: '소재',
  localSpecialtyMondstadt: '몬드 지역 특산물',
  localSpecialtyLiyue: '리월 지역 특산물',
  localSpecialtyInazuma: '이나즈마 지역 특산물',
  localSpecialtySumeru: '수메르 지역 특산물',
  potion: '포션',
  characterLevelUpMaterial: '캐릭터 육성 소재',
  weaponAscensionMaterial: '무기 돌파 소재',
  questItem: '임무 아이템',
  talentLevelUpMaterial: '특성 육성 소재',
  talentLevelUpMaterials: '특성 육성 소재',
  adventureItem: '모험 아이템',
  consumable: '소모품',
  gadget: '간편 아이템',
  systemAccess: '시스템 개방',
  increasesFriendship: '호감도 성장',
  specialCurrency: '희귀 화폐',
  commonCurrency: '통용 화폐',
  superiorVoucher: '고급 교환 쿠폰',
  commonVoucher: '일반 교환 쿠폰',
  limitedWishingItem: '한정 기원 아이템',
  wishingItem: '기원 아이템',
  cityStatesSigil: '칠국의 인장',
  characterEXPMaterial: '캐릭터 경험치 소재',
  weaponEnhancementMaterial: '무기 강화 소재',
  challengeResultItem: '도전 결산 아이템',
};
export type MaterialType = keyof typeof materialTypes;
const curveTypes = [
  'GROW_CURVE_ATTACK_S4',
  'GROW_CURVE_ATTACK_S5',
  'GROW_CURVE_HP_S4',
  'GROW_CURVE_HP_S5',
  'GROW_CURVE_ATTACK_101',
  'GROW_CURVE_ATTACK_102',
  'GROW_CURVE_ATTACK_103',
  'GROW_CURVE_ATTACK_104',
  'GROW_CURVE_ATTACK_105',
  'GROW_CURVE_CRITICAL_101',
  'GROW_CURVE_ATTACK_201',
  'GROW_CURVE_ATTACK_202',
  'GROW_CURVE_ATTACK_203',
  'GROW_CURVE_ATTACK_204',
  'GROW_CURVE_ATTACK_205',
  'GROW_CURVE_CRITICAL_201',
  'GROW_CURVE_ATTACK_301',
  'GROW_CURVE_ATTACK_302',
  'GROW_CURVE_ATTACK_303',
  'GROW_CURVE_ATTACK_304',
  'GROW_CURVE_ATTACK_305',
  'GROW_CURVE_CRITICAL_301',
] as const;
type CurveType = typeof curveTypes[number];

export const foodTypes = {
  recoveryHpAdd: 'UI_Buff_Item_Recovery_HpAdd',
  recoveryRevive: 'UI_Buff_Item_Recovery_Revive',
  recoveryHpAddAll: 'UI_Buff_Item_Recovery_HpAddAll',
  otherSPReduceConsume: 'UI_Buff_Item_Other_SPReduceConsume',
  atkCritRate: 'UI_Buff_Item_Atk_CritRate',
  defAdd: 'UI_Buff_Item_Def_Add',
  otherSPAdd: 'UI_Buff_Item_Other_SPAdd',
  atkAdd: 'UI_Buff_Item_Atk_Add',
  climateHeat: 'UI_Buff_Item_Climate_Heat',
  noEffect: null,
};
export type FoodType = keyof typeof foodTypes;

export interface Prop {
  propType: PropType;
  initValue: number;
  type: CurveType;
}

export interface Promote {
  unlockMaxLevel: number;
  promoteLevel: number;
  costItems?: {
    [id: string]: number;
  };
  addProps?: {
    [prop in PropType]?: number;
  };
  requiredPlayerLevel?: number;
  coinCost?: number;
}
