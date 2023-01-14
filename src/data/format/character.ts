import gs from './genshin-db';
import { weaponTypes, propTypes, PropType, elementTypes } from '../client/common';
import { getAvatar, Avatar } from '../client';
import { escapeDesc } from '../utils';

function getSubstat(data: Avatar) {
  const promoteProps = data.upgrade?.promote?.[1]?.addProps;
  if (!promoteProps) return 'Unknown';

  const substat = (Object.keys(promoteProps) as PropType[]).at(-1);
  return substat ? propTypes[substat] : 'Unknown';
}

function parseParam(value: number, type: string) {
  switch (type) {
    case 'F1':
    case 'I':
      return Math.round(value);

    case 'F1P':
    case 'P':
    default:
      return Math.round(value * 1000) / 10;
  }
}

function formatTalentStat(talent?: Avatar['talent'][number]['promote']) {
  if (!talent) return;

  const findLabel = /(.*)\|(.*)/;
  const findParam = /{param(\d+):(\w*)}/;
  const result: {
    label: string;
    params: string[];
  }[] = [];

  const description = talent['1'].description;
  for (const label of description) {
    if (!label) continue;

    const slice = label.match(findLabel);
    if (!slice) continue;

    const parameters: string[] = [];
    for (const level in talent) {
      const upgrade = talent[level];
      let param = slice[2] ?? '';
      let i: any;
      while ((i = findParam.exec(param ?? '')) !== null) {
        const value = parseParam(upgrade.params[Number(i[1]) - 1], i[2]);
        param = param.replace(findParam, value.toString());
      }
      parameters.push(param);
    }
    result.push({
      label: slice[1],
      params: parameters,
    });
  }

  return result.length ? result : undefined;
}

export async function formatCharacter(avatarId: string | number) {
  const ambr = await getAvatar(avatarId);

  const chr = gs.characters(ambr.name);
  const cons = gs.constellations(ambr.name);

  const element = elementTypes[ambr.element];
  const icon = chr?.images.icon || `https://api.ambr.top/assets/UI/${ambr.icon}.png`;
  const substat = getSubstat(ambr);

  const character = {
    title: ambr.fetter.title,
    name: ambr.name,
    desc: ambr.fetter.detail,
    rarity: ambr.rank,
    weapontype: weaponTypes[ambr.weaponType],
    material: Object.keys(ambr.ascension), // TODO : 한글 이름으로 바꾸기
    icon,
    substat,
    element,
    constellation: ambr.fetter.constellation,
    affiliation: ambr.fetter.native,
    cv: {
      cn: ambr.fetter.cv?.CHS,
      jp: ambr.fetter.cv?.JP,
      en: ambr.fetter.cv?.EN,
      ko: ambr.fetter.cv?.KR,
    },
    birthday: ambr.birthday[0] !== 0 ? `${ambr.birthday[0]}월 ${ambr.birthday[1]}일` : '-',
    days: null, // TODO
  };
  const talent = {
    character: ambr.name,
    element,
    values: Object.values(ambr.talent).map((w, i) => ({
      type: i === 0 ? '일반 공격' : w.type === 0 ? '원소 스킬' : w.type === 1 ? '원소 폭발' : '패시브',
      name: w.name,
      desc: escapeDesc(w.description),
    })),
  };
  const filteredTalents = Object.values(ambr.talent).filter((w) => w.type !== 2 && w.promote['2']);
  const talentstat = {
    element,
    normal: formatTalentStat(filteredTalents[0].promote),
    elemental: formatTalentStat(filteredTalents[1].promote),
    burst: formatTalentStat(filteredTalents[2].promote),
  };
  const constellation = {
    icon,
    character: ambr.name,
    element,
    value: Object.values(ambr.constellation).map((w, i) => {
      return {
        name: w.name,
        icon: cons?.images[`c${i + 1}`] || `https://api.ambr.top/assets/UI/${w.icon}.png`,
        desc: escapeDesc(w.description),
      };
    }),
  };
  const stat = {
    character: ambr.name,
    element,
    substat,
    base: ambr.upgrade.prop.map((w) => w.initValue),
    curve: ambr.upgrade.prop.map((w) => w.type),
    upgrade: ambr.upgrade.promote.slice(1).map((w) => {
      return Object.entries(w).map(([prop, value]) => {
        return [
          'FIGHT_PROP_ELEMENT_MASTERY',
          'FIGHT_PROP_BASE_HP',
          'FIGHT_PROP_BASE_ATTACK',
          'FIGHT_PROP_BASE_DEFENSE',
        ].includes(prop)
          ? value
          : Math.round(value * 1000) / 10 + '%';
      });
    }),
  };

  return {
    character,
    talent,
    talentstat,
    constellation,
    stat,
  };
}
