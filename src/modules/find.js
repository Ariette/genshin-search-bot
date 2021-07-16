const hints = require("./message.json");
const { chrEmbed, wpEmbed, tEmbed, csEmbed, matEmbed, foodEmbed, dayEmbed, tsEmbed, chrstEmbed } = require('./embed.js');

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

async function findQuery(key, args) {
  const text = await DB.get(key);
  const db = JSON.parse(text);
  const query = args.split(' ');
  let result;
  result = db.filter(w => query.every(word => w.name?.indexOf(word) != -1));
  if (!result.length) result = db.filter(w => query.every(word => w.index?.indexOf(word) != -1));

  return result.map(w => w.content);
}

module.exports = {

  findCharacter: async (args) => {
    const results = await findQuery('character', args);
    if (!results.length) {
      return {content: hints.missingCharacter}
    } else if (results.length == 1) {
      const embed = chrEmbed(results[0]);
      const buttons = [
        {type: 2, style: 1, custom_id: 'talent', label: '특성'},
        {type: 2, style: 1, custom_id: 'constellation', label: '별자리'},
        {type: 2, style: 1, custom_id: 'stat', label: '스탯'}
      ]
      return {embeds: [embed], components: [{ type: 1, components: buttons }]};
    } else if (results.length < 6) {
      const embed = {
        title: args + ' 검색 결과',
        footer: {
          text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.'
        }
      }
      const buttons = []
      for (const result of results) {
        buttons.push({type: 2, style: 2, custom_id: '_c' + result.name, label: result.name});
      }
      return {embeds: [embed], components: [{type: 1, components: buttons}]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findWeapon: async (args) => {
    const results = await findQuery('weapon', args);
    if (results.length < 1) {
      return {content: hints.missingWeapon};
    } else if (results.length == 1) {
      const embed = wpEmbed(results[0]);
      return {embeds: [embed]};
    } else if (results.length < 6) {
      const embed = {
        title: args + ' 검색 결과',
        footer: {
          text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.'
        }
      }
      const buttons = []
      for (const result of results) {
        buttons.push({type: 2, style: 2, custom_id: '_w' + result.name, label: result.name});
      }
      return {embeds: [embed], components: [{type: 1, components: buttons}]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findArtifact: async (args) => {
    return {content: '아직 준비중이에요ㅠ'};
  },

  findTalent: async (args) => {
    const results = await findQuery('talent', args);
    if (results.length < 1) {
      return {content: hints.missingCharacter};
    } else if (results.length == 1) {
      const embeds = tEmbed(results[0]);
      const buttons = [
        {type: 2, style: 2, custom_id: 'normal', label: '평타 계수'},
        {type: 2, style: 2, custom_id: 'elemental', label: '스킬 계수'},
        {type: 2, style: 2, custom_id: 'burst', label: '원소폭발 계수'},
        {type: 2, style: 1, custom_id: 'character', label: '캐릭터'},
        {type: 2, style: 1, custom_id: 'constellation', label: '별자리'},
      ];
      return {embeds: embeds, components: [{ type: 1, components: buttons }]};
    } else if (results.length < 6) {
      const embed = {
        title: args + ' 검색 결과',
        footer: {
          text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.'
        }
      }
      const buttons = []
      for (const result of results) {
        buttons.push({type: 2, style: 2, custom_id: '_t' + result.character, label: result.character});
      }
      return {embeds: [embed], components: [{type: 1, components: buttons}]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.character).join(', ')}`};
    }
  },

  findConstellation: async (args) => {
    const results = await findQuery('constellation', args);
    if (results.length < 1) {
      res({content: hints.missingCharacter});
    } else if (results.length == 1) {
      const embed = csEmbed(results[0]);
      const buttons = [
        {type: 2, style: 1, custom_id: 'character', label: '캐릭터'},
        {type: 2, style: 1, custom_id: 'talent', label: '특성'},
        {type: 2, style: 1, custom_id: 'stat', label: '스탯'}
      ];
      return {embeds: [embed], components: [{ type: 1, components: buttons }]};
    } else if (results.length < 6) {
      const embed = {
        title: args + ' 검색 결과',
        footer: {
          text: '아래 버튼을 누르시면 해당 캐릭터의 정보를 바로 보실 수 있습니다.'
        }
      }
      const buttons = []
      for (const result of results) {
        buttons.push({type: 2, style: 2, custom_id: '_s' + result.character, label: result.character});
      }
      return {embeds: [embed], components: [{type: 1, components: buttons}]};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.character).join(', ')}`};
    }
  },

  findCharacterStat: async (args) => {
    const curve = await DB.get('curve');
    const results = await findQuery('stat', args);
    const embed = chrstEmbed(results[0], JSON.parse(curve));
    const buttons = [
      {type: 2, style: 1, custom_id: 'character', label: '캐릭터'},
      {type: 2, style: 1, custom_id: 'talent', label: '특성'},
      {type: 2, style: 1, custom_id: 'constellation', label: '별자리'}
    ]
    return {embeds: [embed], components: [{type: 1, components: buttons}]}
  },

  findTalentStat: async (args, type) => {
    const data = await DB.get('talentstat');
    const results = JSON.parse(data)[args];
    const embeds = tsEmbed(results, type);
    return {embeds: embeds, flags: 64};
  },

  findMaterial: async (args) => {
    const results = await findQuery('material', args);
    if (results.length < 1) {
      return {content: hints.missingItem};
    } else if (results.length < 4) {
      const embeds = [];
      for (const result of results) {
        embeds.push(matEmbed(result));
      }
      return {embeds: embeds};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findFood: async (args) => {
    const results = await findQuery('food', args);
    if (results.length < 1) {
      return {content: hints.missingItem};
    } else if (results.length < 4) {
      const embeds = [];
      for (const result of results) {
        embeds.push(foodEmbed(result));
      }
      return {embeds: embeds};
    } else {
      return {content: `\`검색 결과>>\` ${results.map(w => w.name).join(', ')}`};
    }
  },

  findDay: async (args) => {
    const query = args ? args : getStringDay();
    let embed;
    if ('일요일'.indexOf(query) != -1) {
      embed = { description: '일요일엔 모든 재료를 파밍 가능합니다.' }
    } else {
      const results = {
        character: await findQuery('character', query),
        weapon: await findQuery('weapon', query)
      }
      embed = dayEmbed(results);
    }
    embed.title = query + '의 파밍 목록!';
    embed.color = 3444715;
    return {embeds: [embed]};
  }
  
}