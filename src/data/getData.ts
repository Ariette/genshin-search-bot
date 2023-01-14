import curves from '../data/curve.json';
import { getAvatarList, getMaterialList, getWeaponList } from './client';
import { formatCharacter, formatMaterial, formatWeapon } from './format';
import { generateIndex, transformData } from './utils';

const output = {
  characters: [],
  weapons: [],
  foods: [],
  materials: [],
  artifacts: [],
  talents: [],
  constellations: [],
  stats: [],
  curve: {
    20: curves.characters['20'],
    40: curves.characters['40'],
    50: curves.characters['50'],
    60: curves.characters['60'],
    70: curves.characters['70'],
    80: curves.characters['80'],
    90: curves.characters['90'],
  },
  talentstats: {},
};

(async () => {
  const materials = await getMaterialList();

  // Character
  const characters = await getAvatarList();
  for (const charaId in characters) {
    const { character, talent, talentstat, constellation, stat } = await formatCharacter(characters[charaId].id);
    for (const mat of character.material) {
      // material -> character 백링크를 만들어줌
      if (!materials[mat].characters) materials[mat].characters = [];
      if (!character.name.includes('여행자')) materials[mat].characters.push(character.name);
    }

    // 봇에서 필요한 형식으로 내용을 덮어씀
    if (character.name.includes('여행자')) {
      character.material = {
        level: '풍차 국화',
        talent: '모든 종류',
        boss: '모든 종류',
      } as any;
    } else {
      character.material = {
        level: materials[character.material[0]].name,
        talent: materials[character.material[6]].name.match(/「(.+)」/)[1],
        boss: materials[character.material[13]].name,
      } as any;
    }

    output.characters.push({
      name: character.name,
      index: generateIndex(['name', 'rarity', 'substat', 'weapontype'], character),
      content: character,
    });
    output.talents.push({
      name: transformData('character', talent.character),
      content: talent,
    });
    output.constellations.push({
      name: transformData('character', constellation.character),
      content: constellation,
    });
    output.stats.push({
      name: transformData('character', stat.character),
      content: stat,
    });
    output.talentstats[character.name] = talentstat;
  }

  // Weapon
  const weapons = await getWeaponList();
  for (const weaponId in weapons) {
    const data = await formatWeapon(weapons[weaponId]);
    for (const mat of data.material) {
      // material -> weapon 백링크를 만들어줌
      if (!materials[mat].weapons) materials[mat].weapons = [];
      materials[mat].weapons.push(data.name);
    }

    // 봇에서 필요한 형식으로 내용을 덮어씀
    data.material = {
      level: materials[data.material[0]].name,
      talent: materials[data.material[6]].name.match(/「(.+)」/)[1],
      boss: materials[data.material[13]].name,
    } as any;
  }
})();

/*
weapon의 materials 처리 부분에서 실수함
genshin-db에서 가져오는 건 이름으로 가져오고, ambr에서 가져오는 건 id로 가져옴
이 부분 처리해주기
*/
