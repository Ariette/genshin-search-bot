const gs = require('genshin-db');

gs.setOptions({
  queryLanguages: ['Korean'],
  resultLanguage: 'Korean',
});

const result = gs.materials('사과');
console.log(result);
