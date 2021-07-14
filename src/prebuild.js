const loki = require('lokijs');
const fs = require('fs');
const characters = require('./data/characters.json');
const weapons = require('./data/weapons.json');
const foods = require('./data/foods.json');
const materials = require('./data/materials.json');
const alias = require('./modules/alias.json');

const data = {
    characters: [],
    weapons: [],
    foods: [],
    materials: [],
    artifacts: [],
    talents: [],
    constellations: [],
    stats: []
}

function escapeDesc(desc) {
    if (!desc) return '';

    return desc
    .replace(/<color=#[\w]{8}>([^<]+)<\/color>/g, '`$1`')
    .replace(/<i>\s*([^<]+)\s*<\/i>/g, '*$1*')
    .replace(/\\n/g, '\n');
}

function materialTransform(chara) {
    if (chara.id == 10000005 || chara.id == 10000007) {
        return {
            level: '풍차 국화',
            talent: '모든 종류'
        }
    }
    const level = chara.stat.upgrade[0].costs[1].id;
    const talent = chara.skills.talent.normal.upgrade[1].costs[0].id;
    if (!materials[level]) {
        console.log(level);
    }
    return {
        level: materials[level].name,
        talent: materials[talent].name.match(/「(.+)」/)[1]
    }
}

function statTransform(stat) {
    switch(stat.type) {
      case('원소 마스터리'):
      case('기초 공격력'):
      case('기초 방어력'):
      case('기초 HP'):
        return Math.round(stat.value);

      default:
        return (Math.round(stat.value * 1000) / 10) + '%';
    }
}

function subStatTransform(substat) {
    if (!substat) return;
    switch(substat) {
        case '치명타 확률':
            return ['치명타', '확률', '치확', '치명타확률'];
        case '치명타 피해':
            return ['치명타', '피해', '치피', '치명타피해'];
        case '원소 충전 효율':
            return ['원소', '충전', '효율', '원충', '원소충전효율'];
        case '원소 마스터리':
            return ['원소', '마스터리', '원마', '원소마스터리'];
        case '공격력':
            return ['공격력', '공퍼'];
        case '방어력':
            return ['방어력', '방퍼'];
        case 'HP':
            return ['HP', '체력', '체퍼'];
        default:
            let output = [];
            const base = substat.split(' ');
            if (base[1] === '원소') base.shift();
            if (base[base.length - 2] === '피해') {
                output = output.concat(['피증', base[0] + '피증', base[0][0] + '피증']);
            }
            output = output.concat(base.map(w => w[0]).join(''));
            output = output.concat(base);
            return [...new Set(output)];
    }
}

function dayTransform(days) {
    if (days.length < 1 || days.length > 4) return '-'
    const palette = {
        'Monday': '월요일',
        'Tuesday': '화요일',
        'Wednesday': '수요일',
        'Thursday': '목요일',
        'Friday': '금요일',
        'Saturday': '토요일',
        'Sunday': '일요일'
    };
    return days.map(w => palette[w]).join(', ');
}

function talentTransform(talent) {
    if (!talent) return;

    function parseParam(value, type) {
        switch(type) {
            case('F1'):
            case('I'):
                return Math.round(value);
            
            case('F1P'):
            case('P'):
            default:
                return Math.round(value * 1000) / 10;
        }
    }
    const findLabel = /(.*)\|(.*)/;
    const findParam = /{param(\d+):(\w*)}/;
    const result = [];
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
            params: parameters
        })
    }
    return {
        name: talent.name,
        desc: escapeDesc(talent.desc),
        info: result
    }
}

function nameTransform(name) {
    const names = new Set();
    const regExp = /[ 「」]/g;
    const adds = alias[name];
    if (adds) {
        for (const n of alias[name]) {
            names.add(n);
            names.add(n.replace(regExp, ''));
        }
    }
    names.add(name);
    names.add(name.replace(regExp, ''));

    return [...names].join(' ');
}

const Characters = Object.values(characters);
for (const Character of Characters) {
    if (Character.id === 10000002) continue; // Skip Ayaka
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
        raritys: Character.rarity + '성'
    };
    if (Character.id === 10000005) character.names += ' 아이테르 남행자';
    if (Character.id === 10000007) character.names += ' 루미네';
    if (Character.id === 4) character.names += ' 남행자 바람 바람남행자';
    if (Character.id === 6) character.names += ' 남행자 바위 바위남행자';
    if (Character.id === 14) character.names += ' 여행자 바람 행자 바람행자 바람여행자';
    if (Character.id === 16) character.names += ' 여행자 바위 행자 바위행자 바위여행자';

    // 특성/별자리 정보가 없는 여행자 기본 정보를 제외
    if (Character.name != '여행자') {
        const talent = {
            icon: Character.icon,
            character: Character.name,
            element: Character.element,
            normal: talentTransform(Character.skills.talent.normal),
            elemental: talentTransform(Character.skills.talent.elemental),
            burst: talentTransform(Character.skills.talent.burst),
            characters: character.names
        };
        const constellation = {
            icon: Character.icon,
            character: Character.name,
            element: Character.element,
            value: Character.skills.constellation?.map(w => {
                return {
                    name: w.name,
                    desc: escapeDesc(w.desc)
                }
            }),
            characters: character.names
        };
        data.talents.push(talent);
        data.constellations.push(constellation);
    }
    const stat = {
        characters: character.names,
        curve: Character.stat.curve,
        upgrade: Character.stat.upgrade.map(w => w.props)
    }

    // 중복을 막기 위해 fakeId로 추가한 객체를 제외
    if (Character.id > 20) data.characters.push(character);
    data.stats.push(stat);
}

const Weapons = Object.values(weapons);
for (const Weapon of Weapons) {
    const weapon = {
        name: Weapon.name,
        desc: escapeDesc(Weapon.desc),
        weapontype: Weapon.type,
        rarity: Weapon.rarity,
        icon: Weapon.icon,
        baseAtk: statTransform(Weapon.stat[0]),
        substat: Weapon.stat[1] ? {
            name: Weapon.stat[1].type,
            value: statTransform(Weapon.stat[1])
        } : undefined,
        material: Weapon.material.slice(0, 3).map(w => materials[w].name),
        skill: Weapon.skill ? {
            name: Weapon.skill.name,
            effect: escapeDesc(Weapon.skill.desc.r1)
        } : undefined,
        substats: subStatTransform(Weapon.stat[1]?.type),
        days: dayTransform(Weapon.day),
        raritys: Weapon.rarity + '성',
        names: nameTransform(Weapon.name)
    }
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
        icon: Material.icon,
        rarity: Material.rarity,
        source: Material.domain ? Material.source.concat(Material.domain) : Material.source,
        characters: Material.character?.map(w => characters[w].name),
        weapons: Material.weapon?.map(w => weapons[w].name),
        days: Material.day ? dayTransform(Material.day) : undefined,
        names: nameTransform(Material.name)
    }
    data.materials.push(material);
}

const Foods = Object.values(foods);
for (const Food of Foods) {
    const food = {
        name: Food.name,
        desc: escapeDesc(Food.desc),
        rarity: Food.rarity,
        effect: escapeDesc(Food.effect.join('\n')),
        ingredients: Food.ingredients.map(w => {
            return {
                name: materials[w.id].name,
                count: w.count
            }
        }),
        characters: characters[Food.special?.character]?.name,
        special: materials[Food.special?.id]?.name,
        materials: Food.material.map(w => materials[w].name),
        names: nameTransform(Food.name)
    }
    data.foods.push(food);
}

const db = new loki();
const collChara = db.addCollection('Character', {
    disableMeta: true
});
const collWep = db.addCollection('Weapon', {
    disableMeta: true
});
const collMat = db.addCollection('Material', {
    disableMeta: true
});
const collFood = db.addCollection('Food', {
    disableMeta: true
});
const collTalent = db.addCollection('Talent', {
    disableMeta: true
});
const collCons = db.addCollection('Constellation', {
    disableMeta: true
})
collChara.insert(data.characters);
collWep.insert(data.weapons);
collMat.insert(data.materials);
collFood.insert(data.foods);
collTalent.insert(data.talents);
collCons.insert(data.constellations);

fs.writeFile('./loki.json', db.serialize(), 'utf8', err => {
    if (err) console.error(err);
    console.log('Prebuild Done.');
})