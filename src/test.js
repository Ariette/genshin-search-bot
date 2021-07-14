const fs = require('fs');
const pa = require('path');

/*
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

/*
initSqlJs().then(function(SQL){
  // Load the db
  const db = new SQL.Database();
  let sql = [`CREATE VIRTUAL TABLE Weapon USING FTS5(weapontype, raritys, names, substats, document UNINDEXED);`];
  const lokidb = new loki();
  lokidb.loadJSON(dataload_loki);
  const coll = lokidb.getCollection('Weapon');
  coll.data.forEach(w => {
    sql.push(`INSERT INTO Weapon VALUES ('${w.weapontype}', '${w.raritys}', '${w.names}', '${w.substats}', '${JSON.stringify(w).replace(/'/g, "''")}');`);
  });
  db.run(sql.join(''));
  const data = db.export();
  const buffer = new Buffer(data);
  fs.writeFileSync(pa.join(__dirname, '../sqlite.db'), buffer);
});
*/
function intersectionWith(comp, ...arrays) {
  if (arrays.length == 0) return arrays
  if (arrays.length == 1) return arrays[0]

  const first = arrays[0];
  const others = arrays.slice(1);
return first.filter(a => others.every(arr => arr.some(b => comp(a, b))));
}
/*
const loki = require('lokijs');
const dataload_loki = fs.readFileSync(pa.join(__dirname, '../loki.json'), 'utf-8');
const before = new Date();
for (let i = 0; i < 1000; i++) {
  const query = ['4성', '법구'];
  const db = new loki();
  db.loadJSON(dataload_loki);
  const coll = db.getCollection('Weapon');
  results = coll.find({
    'name': {'$contains': query}
  });
  if (!results.length) {
    const lists = {
      raritys: coll.find({'raritys': {'$containsAny': query}}),
      weapontype: coll.find({'weapontype': {'$containsAny': query}}),
      substats: coll.find({'substats': {'$containsAny': query}})
    } 
    results = Object.values(lists).filter(w => w.length > 0);
    results = intersectionWith((a, b) => a['$loki'] == b['$loki'], ...results);
  }
}
const after = new Date();
console.log(after - before);
*/


const loki = require('lokijs');
const dataload_loki = fs.readFileSync(pa.join(__dirname, '../loki.json'), 'utf-8');
const query = ['4성', '법구'];
const db = new loki();
db.loadJSON(dataload_loki);
const coll = db.getCollection('Weapon');
results = coll.find({
  'name': {'$contains': query}
});
if (!results.length) {
  const lists = {
    raritys: coll.find({'raritys': {'$containsAny': query}}),
    weapontype: coll.find({'weapontype': {'$containsAny': query}}),
    substats: coll.find({'substats': {'$containsAny': query}})
  } 
  results = Object.values(lists).filter(w => w.length > 0);
  results = intersectionWith((a, b) => a['$loki'] == b['$loki'], ...results);
}
console.log(results);