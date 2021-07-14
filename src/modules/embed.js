const { table } = require('table');

function hexElement(element) {
  switch (element) {
      case "불":
          return 15158332;
      case "얼음":
          return 8388607;
      case "바위":
          return 15844367;
      case "물":
          return 3447003;
      case "바람":
          return 9633663;
      case "번개":
          return 10181046;
      case "풀":
          return 2067276;
      default:
          return 16056161;
  }
}

module.exports = {
    chrEmbed: (chr) => {
        const stars = [];
        const rarity = chr.rarity;
        for (let i = 0; i < rarity; i++) {
            stars.push("⭐️");
        };
        const embed = {
            color: hexElement(chr.element),
            title: chr.name + ' ' + stars.join(''),
            description: chr.desc,
            thumbnail: {
                url: 'https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/' + chr.icon + '.png'
            },
            fields: [
                { name: 'CV', value:`\`KR\` ${chr.cv.ko} 　\`JP\` ${chr.cv.jp} 　\`EN\` ${chr.cv.en} 　\`CN\` ${chr.cv.cn}`},
                { name: '속성', value: chr.element, inline: true },
                { name: '운명의 자리', value: chr.constellation, inline: true },
                { name: '소속', value: chr.affiliation, inline: true },
                { name: '생일', value: chr.birthday, inline: true },
                { name: '무기', value: chr.weapontype, inline: true },
                { name: '돌파 스탯', value: chr.substat, inline: true },
                { name: '특산물', value: chr.material.level, inline: true },
                { name: '특성 재료', value: '「' + chr.material.talent + '」', inline: true }
            ]
        };
        if (chr.days) embed.fields.push({name: '파밍 요일', value: chr.days, inline: true}); // 여행자를 위한 예외
        if (chr.title) embed.author = {name: chr.title}; // 여행자를 위한 예외

        return embed;
    },

    wpEmbed: (wp) => {
        const stars = [];
        const rarity = wp.rarity;
        for (let i = 0; i < rarity; i++) {
            stars.push("⭐️");
        };
        const embed = {
            color: 3442411,
            title: wp.name + ' ' + stars.join(''),
            thumbnail: {
                url: 'https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/' + wp.icon + '.png'
            },
            fields: [
                { name: '기초 공격력', value: Math.round(wp.baseAtk), inline: true }
            ]
        };
        if (wp.substat) embed.fields.push({ name: wp.substat.name, value: wp.substat.value, inline: true });
        if (wp.skill) embed.fields.push({ name: '무기 효과', value: `《${wp.skill.name}》\n${wp.skill.effect}` });

        embed.fields.push(
            {name: '파밍 요일', value: wp.days, inline: true},
            {name: '육성 재료', value: wp.material.join(', ')}
        );

        return embed;
    },

    tEmbed: (t) => {
        const embed = {
            color: hexElement(t.element),
            title: t.character,
            fields: [
                { name: "일반공격 :arrow_right: " + t.normal.name, value: t.normal.desc },
                { name: "원소스킬 :arrow_right: " + t.elemental.name, value: t.elemental.desc },
                { name: "원소폭발 :arrow_right: " + t.burst.name, value: t.burst.desc },
            ]
        };

        return embed;
    },

    tsEmbed: (t, type) => {
        const config = {
            drawVerticalLine: () => false,
            drawHorizontalLine: (lineIndex, columnCount) => {
                return lineIndex === 1;
            },
            columnDefault: {
                alignment: 'right',
                width: 7
            },
            columns: {
                0: {
                    alignment: 'left',
                    width: 14
                }
            },
          }
        const table1 = [[' ', 'lv.1', 'lv.2', 'lv.3', 'lv.4', 'lv.5']];
        const table2 = [[' ', 'lv.6', 'lv.7', 'lv.8', 'lv.9', 'lv.10']];
        const table3 = [[' ', 'lv.11', 'lv.12', 'lv.13', 'lv.14', 'lv.15']];
        t[type].info.forEach(data => {
            table1.push([data.label, ...data.params.slice(0, 5)]);
            table2.push([data.label, ...data.params.slice(5, 10)]);
            table3.push([data.label, ...data.params.slice(10)]);
        });

        const embed1 = {
            color: hexElement(t.element),
            description: '```' + table(table1, config) + '```'
        }
        const embed2 = {
            color: hexElement(t.element),
            description: '```' + table(table2, config) + '```'
        }
        const embed3 = {
            color: hexElement(t.element),
            description: '```' + table(table3, config) + '```'
        }
    
        return [embed1, embed2, embed3];
    },

    csEmbed: (cs) => {
        const embed = {
            color: hexElement(cs.element),
            title: cs.character,
            fields: []
        };
        cs.value.forEach((v, i) => {
            embed.fields.push({ name: (i+1) + "⭐️" + v.name, value: v.desc });
        });

        return embed;
    },

    matEmbed: (mat) => {
        const stars = [];
        const rarity = mat.rarity;
        for (let i = 0; i < rarity; i++) {
            stars.push("⭐️");
        };
        const embed = {
            color: 3444715,
            title: mat.name + ' ' + stars.join(''),
            description: mat.desc,
            fields: [
                {name: '획득 방법', value: mat.source && mat.source.length ? mat.source.join('  \n') : '-'}
            ]
        };
        if (mat.effect) embed.fields.push({name: '효과', value: mat.effect});
        if (mat.weapons) embed.fields.push({name: '사용 무기', value: mat.weapons.join(', '), inline: true});
        if (mat.characters) embed.fields.push({name: '사용 캐릭터', value: mat.characters.join(', '), inline: true});
        if (mat.days) embed.fields.push({name: '파밍 요일', value: mat.days, inline: true});

        return embed;
    },

    foodEmbed: (food) => {
        const stars = [];
        const rarity = food.rarity;
        for (let i = 0; i < rarity; i++) {
            stars.push("⭐️");
        }
        const embed = {
            color: 3444715,
            title: food.name + ' ' + stars.join(''),
            description: food.desc,
            fields: []
        };
        if (food.effect) embed.fields.push({name: '효과', value: food.effect});
        embed.fields.push({name: '재료', value: food.ingredients.map(w => w.name + 'x' + w.count).join(', '), inline: true});
        if (food.characters) embed.fields.push({name: '특수 요리', value: food.characters, inline: true});

        return embed;
    },

    dayEmbed: (results) => {
        const embed = {
            title: null,
            color: 3444715,
            fields: [
                {name: '캐릭터', value: results.character.map(w => w.name).join(', ')},
                {name: '무기', value: results.weapon.map(w => w.name).join(', ')}
            ]
        };

        return embed;
    }
}