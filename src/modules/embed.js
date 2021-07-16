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
                { name: '기초 공격력', value: wp.baseAtk, inline: true }
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
                { name: "패시브1 :arrow_right: " + t.passive1.name, value: t.passive1.desc },
                { name: "패시브2 :arrow_right: " + t.passive2.name, value: t.passive2.desc },
            ]
        };
        if (t.passive3) embed.fields.push({ name: "패시브3 :arrow_right: " + t.passive3.name, value: t.passive3.desc })

        return embed;
    },

    csEmbed: (cs) => {
        const embed = {
            color: hexElement(cs.element),
            title: cs.character + ' 운명의 자리',
            fields: []
        };
        cs.value.forEach((v, i) => {
            embed.fields.push({ name: (i+1) + "⭐️" + v.name, value: v.desc });
        });

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

    chrstEmbed: (st, curve) => {
        function r(statNum, i, up) {
            if (!i) return Math.round(st.base[statNum]);
            if (!up) return Math.round(st.base[statNum] * curve[lvlMap[i]][st.curve[statNum]]);
            return Math.round(st.base[statNum] * curve[lvlMap[i]][st.curve[statNum]] + up[statNum]);
        }
        const lvlMap = {
            "0": '20',
            "1": '40',
            "2": '50',
            "3": '60',
            "4": '70',
            "5": '80',
            "6": '90'
        };
        const config = {
            drawVerticalLine: () => false,
            drawHorizontalLine: (lineIndex, columnCount) => {
                return lineIndex === 1;
            },
            columnDefault: {
                alignment: 'right'
            },
            columns: {
                0: {
                    alignment: 'left',
                    width: 4
                }
            },
          }
        const stats = [['레벨', '기초 HP', '기초 방어력', '기초 공격력', st.substat]];
        stats.push([1, r(0), r(1), r(2), 0]);
        st.upgrade.forEach((up, i) => {
            if (i === 0) {
                stats.push([lvlMap[i], r(0, '0'), r(1, '0'), r(2, '0'), 0]);
                stats.push([lvlMap[i] + '+', r(0, '0', up), r(1, '0', up), r(2, '0', up), 0]);
            } else {
                stats.push([lvlMap[i], r(0, i, st.upgrade[i-1]), r(1, i, st.upgrade[i-1]), r(2, i, st.upgrade[i-1]), st.upgrade[i-1][3] || 0]);
                stats.push([lvlMap[i] + '+', r(0, i, up), r(1, i, up), r(2, i, up), up[3]]);
            }
        });
        stats.push([90, r(0, 6, st.upgrade[5]), r(1, 6, st.upgrade[5]), r(2, 6, st.upgrade[5]), st.upgrade[5][3]]);
        const embed = {
            color: hexElement(st.element),
            title: st.character + ' 스탯',
            description: '```' + table(stats, config) + '```',
            footer: {
                text: '* 위 스탯은 캐릭터 기본 스탯(치확 5%, 치피 50%, 원충 100%)이 제외된 수치입니다.'
            }
        }

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
            ]
        };
        if (mat.icon) embed.thumbnail = {
            url: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_' + mat.icon +'.png'
        }
        if (mat.effect) embed.fields.push({name: '효과', value: mat.effect});
        if (mat.source?.length) embed.fields.push({name: '획득 방법', value: mat.source.join('  \n'), inline: true});
        if (mat.days) embed.fields.push({name: '파밍 요일', value: mat.days, inline: true});
        if (mat.weapons) embed.fields.push({name: '사용 무기', value: mat.weapons.join(', ')});
        if (mat.characters) embed.fields.push({name: '사용 캐릭터', value: mat.characters.join(', ')});

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
        if (food.icon) embed.thumbnail = {
            url: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_' + food.icon +'.png'
        }
        if (food.effect) embed.fields.push({name: '효과', value: food.effect});
        embed.fields.push({name: '재료', value: food.ingredients.map(w => w.name + 'x' + w.count).join(', '), inline: true});
        if (food.characters) embed.fields.push({name: '특수 요리', value: food.special + ' - ' + food.characters, inline: true});

        return embed;
    },

    dayEmbed: (results) => {
        const characters = {};
        const weapons = {};
        results.character.forEach(chr => {
            if (!characters[chr.material.talent]) characters[chr.material.talent] = [];
            characters[chr.material.talent].push(chr.name);
        });
        results.weapon.forEach(wp => {
            if (!weapons[wp.weapontype]) weapons[wp.weapontype] = [];
            weapons[wp.weapontype].push(wp.name);
        })
        const embed = {
            fields: [
            ]
        };
        Object.keys(characters).forEach(key => {
            embed.fields.push({name: key, value: characters[key].join(', ')});
        })
        Object.keys(weapons).forEach(key => {
            embed.fields.push({name: key, value: weapons[key].join(', ')});
        })

        return embed;
    }
}