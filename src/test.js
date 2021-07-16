const fs = require('fs');
const pa = require('path');

/* sql.js time test

const initSqlJs = require('sql.js-fts5');
const dataload_sql = fs.readFileSync(pa.join(__dirname, '../sqlite.db'));
initSqlJs().then(SQL => {
  const before = new Date();
  for (let i = 0; i < 1000; i++) {
    const db = new SQL.Database(dataload_sql);
    const sql = "SELECT document FROM Weapon WHERE Weapon MATCH '4성 법구'";
    const result = db.exec(sql);
  }
  const after = new Date();
  console.log(after - before);
})
*/

/* lokijs time test

const loki = require('lokijs');
const dataload_loki = fs.readFileSync(pa.join(__dirname, '../loki_test.json'), 'utf-8');
const query = ['4성', '법구'];
const before = new Date();
for (let i = 0; i < 1000; i++) {
  const db = new loki();
  db.loadJSON(dataload_loki);
  const coll = db.getCollection('Weapon');
  coll.find({
    'index': {'$contains': query}
  });
}
const after = new Date();
console.log(after - before);
*/

/* lokijs value test

const loki = require('lokijs');
const dataload_loki = fs.readFileSync(pa.join(__dirname, '../loki_test.json'), 'utf-8');
const query = ['4성', '법구'];
const db = new loki();
db.loadJSON(dataload_loki);
const coll = db.getCollection('Weapon');
const results = coll.find({
  'index': {'$contains': query}
});
console.log(results);
*/

/* vanilla value test

const dataload_vanilla = fs.readFileSync(pa.join(__dirname, '../vanilla.json'), 'utf-8');
const query = ['4성', '법구'];
const data = JSON.parse(dataload_vanilla);
const results = data.filter(w => query.every(word => w.index.indexOf(word) != -1))
console.log(results);
*/

/* vanilla time test

const dataload_vanilla = fs.readFileSync(pa.join(__dirname, '../vanilla.json'), 'utf-8');
const before = new Date();
for (let i = 0; i < 1000; i++) {
  const query = ['법구', '4성'];
  const data = JSON.parse(dataload_vanilla);
  data.filter(w => query.every(word => w.index.indexOf(word) != -1))
}
const after = new Date();
console.log(after - before);
*/

/* flexsearch time test

const { Document } = require('flexsearch');
const files = fs.readdirSync(pa.join(__dirname, '../data/weapon'));
const data = {};
files.forEach(filename => {
  const key = filename.slice(0, -4);
  data[key] = fs.readFileSync(pa.join(__dirname, '../data/weapon/', filename), 'utf-8');
});
const keys = Object.keys(data);
const before = new Date();
for (let i = 0; i < 1000; i++) {
  const Weapon = new Document({
    tokenize: 'forward',
    document: {
        index: ['index'],
        store: ['content']
    }
  });
  for (const key of keys) {
    Weapon.import(key, data[key]);
  }
  Weapon.search('4성 법구', {enrich: true});
}
const after = new Date();
console.log(after - before);
*/

/* flexsearch value test

const { Document } = require('flexsearch');
const files = fs.readdirSync(pa.join(__dirname, '../data/weapon'));
const data = {};
files.forEach(filename => {
  const key = filename.slice(0, -4);
  data[key] = fs.readFileSync(pa.join(__dirname, '../data/weapon/', filename), 'utf-8');
});
const keys = Object.keys(data);
const Weapon = new Document({
  tokenize: 'forward',
  document: {
      index: ['index'],
      store: ['content']
  }
});
for (const key of keys) {
  Weapon.import(key, data[key]);
}
const result = Weapon.search('4성 법구', {enrich: true});
console.log(result[0].result.map(w => w.doc.content));
*/