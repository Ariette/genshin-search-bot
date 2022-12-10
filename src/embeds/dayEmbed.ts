import { APIEmbed } from 'discord-api-types/v10';

export const dayEmbed = (results) => {
  const characters = {};
  const weapons = {};
  results.character.forEach((chr) => {
    if (!characters[chr.material.talent]) characters[chr.material.talent] = [];
    characters[chr.material.talent].push(chr.name);
  });
  results.weapon.forEach((wp) => {
    if (!weapons[wp.weapontype]) weapons[wp.weapontype] = [];
    weapons[wp.weapontype].push(wp.name);
  });
  const embed: APIEmbed = {
    fields: [],
  };
  Object.keys(characters).forEach((key) => {
    embed.fields?.push({ name: ':arrow_right: ' + key, value: characters[key].join(', ') });
  });
  Object.keys(weapons).forEach((key) => {
    embed.fields?.push({ name: ':arrow_right: ' + key, value: weapons[key].join(', ') });
  });

  return embed;
};
