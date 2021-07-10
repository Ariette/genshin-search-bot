const hints = require("./message.json");
const { chrEmbed, wpEmbed, tEmbed, csEmbed, matEmbed, foodEmbed, dayEmbed, tsEmbed } = require('./embed.js');
const loki = require('lokijs');


async function load() {
  const database = new loki();
  const data = await DB.get('data');
  database.loadJSON(data);

  return database;
}

function intersectionWith(comp, ...arrays) {
  if (arrays.length == 0) return arrays
  if (arrays.length == 1) return arrays[0]

  const first = arrays[0];
  const others = arrays.slice(1);
return first.filter(a => others.every(arr => arr.some(b => comp(a, b))));
}

function getStringDay() {
  const day = new Date().getDay();
  switch (day) {
    case 0:
      return "일요일";
    case 1:
      return "월요일";
    case 2:
      return "화요일";
    case 3:
      return "수요일";
    case 4:
      return "목요일";
    case 5:
      return "금요일";
    case 6:
      return "토요일";
  }
}

module.exports = {

  findCharacter: async (args) => {
    const db = await load();

    // Find results
    let results;
    const coll = db.getCollection('Character');
    results = coll.find({
      'names': {'$contains': args}
    });
    if (!results.length) {
      const query = args.split(' ');
      const lists = {
        element: coll.find({'element': {'$containsAny': query}}),
        weapontype: coll.find({'weapontype': {'$containsAny': query}}),
        substats: coll.find({'substats': {'$containsAny': query}}),
        raritys: coll.find({'raritys': {'$containsAny': query}}),
      } 
      results = Object.values(lists).filter(w => w.length > 0);
      results = intersectionWith((a, b) => a['$loki'] == b['$loki'], ...results);
    }

    // Show results
    if (!results.length) {
      return {content: hints.missingCharacter}
    } else if (results.length == 1) {
      const embed = chrEmbed(results[0]);
      const buttons = [
        {type: 2, style: 1, custom_id: 'talent', label: '특성'},
        {type: 2, style: 1, custom_id: 'constellation', label: '별자리'},
        {type: 2, style: 1, custom_id: 'stat', label: '스탯', disabled: true}
      ]
      return {embeds: [embed], components: [{ type: 1, components: buttons }]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findWeapon: async (args) => {
    const db = await load();
    // Find results
    let results;
    const coll = db.getCollection('Weapon');
    results = coll.find({
      'name': {'$contains': args}
    });
    if (!results.length) {
      const query = args.split(' ');
      const lists = {
        raritys: coll.find({'raritys': {'$containsAny': query}}),
        weapontype: coll.find({'weapontype': {'$containsAny': query}}),
        substats: coll.find({'substats': {'$containsAny': query}})
      } 
      results = Object.values(lists).filter(w => w.length > 0);
      results = intersectionWith((a, b) => a['$loki'] == b['$loki'], ...results);
    }

    // Show results
    if (results.length < 1) {
      return {content: hints.missingWeapon};
    } else if (results.length == 1) {
      const embed = wpEmbed(results[0]);
      return {embeds: [embed]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findArtifact: async (args) => {
    return {content: '아직 준비중이에요ㅠ'};
  },

  findTalent: async (args) => {
    const db = await load();
    // Find results
    const coll = db.getCollection('Talent');
    const results = coll.find({
      'characters': {'$contains': args}
    });

    // Show results
    if (results.length < 1) {
      res({content: hints.missingCharacter});
    } else {
      const embeds = [];
      const buttons = [
        {type: 2, style: 2, custom_id: 'normal', label: '평타 계수'},
        {type: 2, style: 2, custom_id: 'elemental', label: '스킬 계수'},
        {type: 2, style: 2, custom_id: 'burst', label: '원소폭발 계수'},
        {type: 2, style: 1, custom_id: 'character', label: '캐릭터'},
        {type: 2, style: 1, custom_id: 'constellation', label: '별자리'},
      ];
      for (const t of results) {
        const embed = tEmbed(t);
        embeds.push(embed);
      }
      return {embeds: embeds, components: [{ type: 1, components: buttons }]};
    }
  },

  findTalentStat: async (args, type) => {
    const db = await load();
    // Find results
    const coll = db.getCollection('Talent');
    const results = coll.find({
      'characters': {'$contains': args}
    });

    // Show results
    const embeds = tsEmbed(results[0], type);
    return {embeds: embeds, flags: 64};
  },

  findConstellation: async (args) => {
    const db = await load();
    // Find results
    const coll = db.getCollection('Constellation');
    const results = coll.find({
      'characters': {'$contains': args}
    });

    // Show results
    if (results.length < 1) {
      res({content: hints.missingCharacter});
    } else {
      const embeds = [];
      const buttons = [
        {type: 2, style: 1, custom_id: 'character', label: '캐릭터'},
        {type: 2, style: 1, custom_id: 'talent', label: '특성'},
        {type: 2, style: 1, custom_id: 'stat', label: '스탯', disabled: true}
      ];
      for (const cs of results) {
        const embed = csEmbed(cs);
        embeds.push(embed);
      }
      return {embeds: embeds, components: [{ type: 1, components: buttons }]};
    }
  },

  findMaterial: async (args) => {
    const db = await load();
    // Find results
    let results;
    const coll = db.getCollection('Material');
    results = coll.find({
      'names': {'$contains': args}
    });
    if (!results.length) {
      results = [].concat(
        coll.find({'characters': {'$contains': args}}), 
        coll.find({'weapons': {'$contains': args}}), 
        coll.find({'days': {'$contains': args}})
      );
    }

    // Show results
    if (results.length < 1) {
      return {content: hints.missingItem};
    } else if (results.length == 1) {
      const embed = matEmbed(results[0]);
      return {embeds: [embed]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findFood: async (args) => {
    const db = await load();
    // Find results
    let results;
    const coll = db.getCollection('Food');
    results = coll.find({
      'name': {'$contains': args}
    });
    if (!results.length) {
      results = [].concat(
        coll.find({'characters': {'$contains': args}}), 
        coll.find({'materials': {'$contains': args}}), 
      );
    }

    // Show results
    if (results.length < 1) {
      return {content: hints.missingItem};
    } else if (results.length == 1) {
      const embed = foodEmbed(results[0]);
      return {embeds: [embed]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findDay: async (args) => {
    const query = args ? args : getStringDay();
    let results;
    if ('일요일'.indexOf(query) != -1) {
      results = {
        character: ['일요일엔 모든 재료를 파밍 가능합니다.'],
        weapon: ['일요일엔 모든 재료를 파밍 가능합니다.']
      }
    } else {
      const db = await load();
      const charaColl = db.getCollection('Character');
      const wepColl = db.getCollection('Weapon');
      results = {
        character: charaColl.find({
          'days': {'$contains': query}
        }),
        weapon: wepColl.find({
          'days': {'$contains': query}
        })
      }
    }
    const embed = dayEmbed(results);
    embed.title = query + '의 파밍 목록!'
    return {embeds: [embed]};
  }
  
}