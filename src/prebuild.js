const fs = require('fs/promises');
const characters = require('./data/characters.json');
const weapons = require('./data/weapons.json');
const foods = require('./data/foods.json');
const materials = require('./data/materials.json');
const curves = require('./data/curve.json');
const alias = require('./config/alias.json');

const data = {
  characters: [],
  weapons: [],
  foods: [],
  materials: [],
  artifacts: [],
  talents: [],
  constellations: [],
  stats: [],
  curves: [],
  talentstats: {},
};

function escapeDesc(desc) {
  if (!desc) return '';

  return desc
    .replace(/<color=#[\w]{8}>([^<]+)<\/color>/g, '`$1`')
    .replace(/<i>\s*([^<]+)\s*<\/i>/g, '*$1*')
    .replace(/\\n/g, '\n');
}

function effectTransform(desc) {
  const template = {
    r1: desc.r1?.split('>'),
    r2: desc.r2?.split('>'),
    r3: desc.r3?.split('>'),
    r4: desc.r4?.split('>'),
    r5: desc.r5?.split('>'),
  };
  const container = [];
  template.r1.forEach((str, idx) => {
    if (str.indexOf('</color') != -1) {
      const out = Object.values(template)
        .filter((w) => w)
        .map((r) => r[idx])
        .join('/');
      container.push(out.replace(/<\/color/g, '') + '</color');
    } else {
      container.push(str);
    }
  });

  return escapeDesc(container.join('>'));
}

function materialTransform(chara) {
  if (chara.id == 10000005 || chara.id == 10000007) {
    return {
      level: '풍차 국화',
      talent: '모든 종류',
      boss: '모든 종류',
    };
  }
  const level = chara.stat.upgrade[0].costs[1].id;
  const talent = chara.skills.talent.normal.upgrade[1].costs[0].id;
  const boss = chara.skills.talent.normal.upgrade[9].costs[2].id;
  if (!materials[level]) {
    console.log(level);
  }
  return {
    level: materials[level].name,
    talent: materials[talent].name.match(/「(.+)」/)[1],
    boss: materials[boss].name,
  };
}

function statTransform(stat) {
  switch (stat.type) {
    case '원소 마스터리':
    case '기초 공격력':
    case '기초 방어력':
    case '기초 HP':
      return Math.round(stat.value);

    default:
      return Math.round(stat.value * 1000) / 10 + '%';
  }
}

function subStatTransform(substat) {
  if (!substat) return;
  switch (substat) {
    case '치명타 확률':
      return '치확|치명타확률';
    case '치명타 피해':
      return '치피|치명타피해';
    case '원소 충전 효율':
      return '원충|원소충전효율';
    case '원소 마스터리':
      return '원마|원소마스터리';
    case '공격력':
      return '공격력|공퍼';
    case '방어력':
      return '방어력|방퍼';
    case 'HP':
      return 'HP|체력|체퍼';
    default:
      let output = [];
      output.push(substat.replace(/[ 「」]/g, ''));

      const base = substat.split(' ');
      if (base[1] === '원소') base.shift();
      if (base[base.length - 2] === '피해') {
        output = output.concat([base[0] + '피증', base[0][0] + '피증']);
      }
      output = output.concat(base.map((w) => w[0]).join(''));
      return [...new Set(output)].join('|');
  }
}

function dayTransform(days) {
  if (days.length < 1 || days.length > 4) return '-';
  const palette = {
    Monday: '월요일',
    Tuesday: '화요일',
    Wednesday: '수요일',
    Thursday: '목요일',
    Friday: '금요일',
    Saturday: '토요일',
    Sunday: '일요일',
  };
  return days.map((w) => palette[w]).join(', ');
}

function talentTransform(talent) {
  if (!talent) return undefined;
  return {
    name: talent.name,
    desc: escapeDesc(talent.desc),
  };
}

function talentstatTransform(talent) {
  if (!talent) return;

  function parseParam(value, type) {
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
  const findLabel = /(.*)\|(.*)/;
  const findParam = /{param(\d+):(\w*)}/;
  const result = [];
  if (talent.info) {
    for (const label of talent.info) {
      const slice = label.match(findLabel);
      if (!slice) continue;

      const parameters = [];
      for (const upgrade of talent.upgrade) {
        let param = slice[2] ?? '';
        let i;
        while ((i = findParam.exec(param ?? '')) !== null) {
          const value = parseParam(upgrade.params[Number(i[1]) - 1], i[2]);
          param = param.replace(findParam, value);
        }
        parameters.push(param);
      }
      result.push({
        label: slice[1],
        params: parameters,
      });
    }
  }

  return result.length ? result : undefined;
}

function nameTransform(name) {
  const names = new Set();
  const regExp = /[ 「」]/g;
  const adds = alias[name];
  if (adds) {
    for (const n of alias[name]) {
      names.add(n.replace(regExp, ''));
    }
  }
  names.add(name.replace(regExp, ''));

  return [...names].join('|');
}

const Characters = Object.values(characters);
for (const Character of Characters) {
  const character = {
    title: Character.title,
    name: Character.name,
    desc: Character.desc,
    rarity: Character.rarity,
    weapontype: Character.weapontype,
    material: materialTransform(Character),
    icon: Character.icon,
    substat: Character.stat.upgrade[1].props[3].type,
    element: Character.element,
    constellation: Character.constellation,
    affiliation: Character.affiliation,
    cv: Character.cv,
    birthday: Character.birthday || '-',
    days: dayTransform(Character.day),
    names: nameTransform(Character.name),
    substats: subStatTransform(Character.stat.upgrade[1].props[3].type),
    raritys: Character.rarity + '성',
    weapontypes: nameTransform(Character.weapontype),
  };
  if (Character.id === 10000005) character.names += '|아이테르|남행자|(바위)|(바람)|(번개)';
  if (Character.id === 10000007) character.names += '|루미네|(바위)|(바람)|(번개)';
  if (Character.id === 4) character.names += '|남행자|바람남행자';
  if (Character.id === 6) character.names += '|남행자|바위남행자';
  if (Character.id === 7) character.names += '|남행자|번개남행자';
  if (Character.id === 14) character.names += '|여행자|바람행자|바람여행자';
  if (Character.id === 16) character.names += '|여행자|바위행자|바위여행자';
  if (Character.id === 17) character.names += '|여행자|번개행자|번개여행자';

  // 특성/별자리 정보가 없는 여행자 기본 정보를 제외
  if (Character.name != '여행자') {
    const talent = {
      character: Character.name,
      element: Character.element,
      normal: talentTransform(Character.skills.talent.normal),
      elemental: talentTransform(Character.skills.talent.elemental),
      burst: talentTransform(Character.skills.talent.burst),
      passive1: talentTransform(Character.skills.passive[0]),
      passive2: talentTransform(Character.skills.passive[1]),
      passive3: talentTransform(Character.skills.passive[2]),
      characters: character.names,
    };
    const talentstat = {
      element: Character.element,
      normal: talentstatTransform(Character.skills.talent.normal),
      elemental: talentstatTransform(Character.skills.talent.elemental),
      burst: talentstatTransform(Character.skills.talent.burst),
    };
    const constellation = {
      icon: Character.icon,
      character: Character.name,
      element: Character.element,
      value: Character.skills.constellation?.map((w) => {
        return {
          name: w.name,
          desc: escapeDesc(w.desc),
          icon: w.icon,
        };
      }),
      characters: character.names,
    };
    data.talents.push(talent);
    data.constellations.push(constellation);
    data.talentstats[Character.name] = talentstat;
  }
  const stat = {
    characters: character.names,
    character: Character.name,
    element: Character.element,
    substat: Character.stat.upgrade[1].props[3].type,
    base: [Character.stat.baseHp, Character.stat.baseDef, Character.stat.baseAtk],
    curve: Character.stat.curve.map((w) => w.curve),
    upgrade: Character.stat.upgrade.map((w) => {
      return w.props.map((prop) => {
        return ['원소 마스터리', '기초 HP', '기초 공격력', '기초 방어력'].includes(prop.type)
          ? prop.value
          : Math.round(prop.value * 1000) / 10 + '%';
      });
    }),
  };

  // 중복을 막기 위해 fakeId로 추가한 객체를 제외
  if (Character.id > 20) data.characters.push(character);
  data.stats.push(stat);
}

const Weapons = Object.values(weapons);
for (const Weapon of Weapons) {
  const lvlMap = {
    0: '20',
    1: '40',
    2: '50',
    3: '60',
    4: '70',
    5: '80',
    6: '90',
  };
  const maxasc = Weapon.promote.length;
  const weapon = {
    name: Weapon.name,
    desc: escapeDesc(Weapon.desc),
    weapontype: Weapon.type,
    rarity: Weapon.rarity,
    icon: Weapon.icon,
    baseAtk:
      statTransform(Weapon.stat[0]) +
      ' ~ ' +
      statTransform({
        type: Weapon.stat[0].type,
        value:
          Weapon.stat[0].value * curves.weapons[lvlMap[maxasc]][Weapon.stat[0].curve] +
          Weapon.promote[maxasc - 1].props[0].value,
      }),
    substat: Weapon.stat[1]
      ? {
          name: Weapon.stat[1].type,
          value:
            statTransform(Weapon.stat[1]) +
            ' ~ ' +
            statTransform({
              type: Weapon.stat[1].type,
              value: Weapon.stat[1].value * curves.weapons[lvlMap[maxasc]][Weapon.stat[1].curve],
            }),
        }
      : undefined,
    material: Weapon.material.slice(0, 3).map((w) => materials[w].name),
    skill: Weapon.skill
      ? {
          name: Weapon.skill.name,
          effect: effectTransform(Weapon.skill.desc),
        }
      : undefined,
    substats: subStatTransform(Weapon.stat[1]?.type),
    days: dayTransform(Weapon.day),
    raritys: Weapon.rarity + '성',
    names: nameTransform(Weapon.name),
    weapontypes: nameTransform(Weapon.type),
  };
  data.weapons.push(weapon);
}

const Materials = Object.values(materials);
for (const Material of Materials) {
  if (!Material.name) {
    console.log(Material);
  }
  const material = {
    name: Material.name,
    desc: escapeDesc(Material.desc),
    effect: escapeDesc(Material.effect),
    rarity: Material.rarity,
    icon: Material.icon,
    source: Material.domain ? Material.source.concat(Material.domain) : Material.source,
    characters: Material.character?.map((w) => characters[w].name),
    weapons: Material.weapon?.map((w) => weapons[w].name),
    days: Material.day ? dayTransform(Material.day) : undefined,
    names: nameTransform(Material.name),
    map: Material.source.some((w) => w.indexOf(' 채집') != -1) ? Material.name : undefined,
  };
  data.materials.push(material);
}

const Foods = Object.values(foods);
for (const Food of Foods) {
  const food = {
    name: Food.name,
    desc: escapeDesc(Food.desc),
    rarity: Food.rarity,
    icon: Food.icon,
    effect: escapeDesc(Food.effect.join('\n')),
    ingredients: Food.ingredients.map((w) => {
      return {
        name: materials[w.id].name,
        count: w.count,
      };
    }),
    characters: characters[Food.special?.character]?.name,
    special: materials[Food.special?.id]?.name,
    materials: Food.material.map((w) => materials[w].name),
    names: nameTransform(Food.name),
  };
  data.foods.push(food);
}

const output = {
  character: data.characters.map((w) => {
    return {
      name: w.names,
      index: [w.element, w.weapontypes, w.raritys, w.substats, w.days].filter((w) => w).join('|'),
      content: Object.assign(w, { names: undefined, raritys: undefined, substats: undefined, weapontypes: undefined }),
    };
  }),
  weapon: data.weapons.map((w) => {
    return {
      name: w.names,
      index: [w.weapontypes, w.raritys, w.substats, w.days].filter((w) => w).join('|'),
      content: Object.assign(w, { names: undefined, raritys: undefined, substats: undefined, weapontypes: undefined }),
    };
  }),
  material: data.materials.map((w) => {
    return {
      name: w.names,
      index: [w.characters, w.weapons, w.days].filter((w) => w).join('|'),
      content: Object.assign(w, { names: undefined }),
    };
  }),
  food: data.foods.map((w) => {
    return {
      name: w.names,
      index: [w.characters, w.materials].filter((w) => w).join('|'),
      content: Object.assign(w, { names: undefined, materials: undefined }),
    };
  }),
  talent: data.talents.map((w) => {
    return {
      name: w.characters,
      content: Object.assign(w, { characters: undefined }),
    };
  }),
  talentstat: data.talentstats,
  constellation: data.constellations.map((w) => {
    return {
      name: w.characters,
      content: Object.assign(w, { characters: undefined }),
    };
  }),
  stat: data.stats.map((w) => {
    return {
      name: w.characters,
      content: Object.assign(w, { characters: undefined }),
    };
  }),
  curve: {
    20: curves.characters['20'],
    40: curves.characters['40'],
    50: curves.characters['50'],
    60: curves.characters['60'],
    70: curves.characters['70'],
    80: curves.characters['80'],
    90: curves.characters['90'],
  },
};

if (process.env.NODE_ENV === 'development') {
  fs.mkdir('./kv/DB')
    .catch((e) => {
      if (e.code === 'EEXIST') return;
      throw e;
    })
    .finally(() => {
      const keys = Object.keys(output);
      const promises = [];
      for (const key of keys) {
        promises.push(fs.writeFile('./kv/DB/' + key, JSON.stringify(output[key]), 'utf8'));
      }
      Promise.all(promises).then((w) => {
        console.log('Prebuild Done.');
      });
    });
} else {
  fs.mkdir('./data')
    .catch((e) => {
      if (e.code === 'EEXIST') return;
      throw e;
    })
    .finally(() => {
      const keys = Object.keys(output);
      const promises = [];
      for (const key of keys) {
        promises.push(fs.writeFile('./data/' + key + '.json', JSON.stringify(output[key]), 'utf8'));
      }
      Promise.all(promises).then((w) => {
        console.log('Prebuild Done.');
      });
    });
}
