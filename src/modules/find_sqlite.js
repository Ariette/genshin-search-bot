const initSqlJs = require('sql.js-fts5/dist/worker.sql-wasm');
const hints = require("./message.json");
const { chrEmbed, wpEmbed, tEmbed, csEmbed, matEmbed, foodEmbed, dayEmbed, tsEmbed } = require('./embed.js');


async function load() {
  const SQL = await initSqlJs();
  const data = await DB.get('sqlite');
  const database = new SQL.Database(data);

  return database;
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
    const find = db.exec(`SELECT document FROM Character WHERE Character MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));

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
    const find = db.exec(`SELECT document FROM Weapon WHERE Weapon MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));

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
    const find = db.exec(`SELECT document FROM Talent WHERE Talent MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));


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
    const find = db.exec(`SELECT document FROM Talent WHERE Talent MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));


    // Show results
    const embeds = tsEmbed(results[0], type);
    return {embeds: embeds, flags: 64};
  },

  findConstellation: async (args) => {
    const db = await load();

    // Find results
    const find = db.exec(`SELECT document FROM Constellation WHERE Constellation MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));


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
    const find = db.exec(`SELECT document FROM Material WHERE Material MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));


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
    const find = db.exec(`SELECT document FROM Food WHERE Food MATCH '${args}'`);
    const results = find[0].values.map(w => JSON.parse(w[0]));


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
  
      // Find results
      const findChara = db.exec(`SELECT document FROM Character WHERE Character MATCH '${args}'`);
      const findWeapon = db.exec(`SELECT document FROM Weapon WHERE Weapon MATCH '${args}'`);
      results = {
        character: findChara[0].values.map(w => JSON.parse(w[0])),
        weapon: findWeapon[0].values.map(w => JSON.parse(w[0]))
      }
    }
    const embed = dayEmbed(results);
    embed.title = query + '의 파밍 목록!'
    return {embeds: [embed]};
  }
  
}