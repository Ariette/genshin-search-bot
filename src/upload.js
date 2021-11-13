const shell = require('shelljs');
const fs = require('fs');

fs.readdir('./data', (err, lists) => {
  if (err) throw err;
  const keys = lists.map(w => w.replace('.json', ''));
  for (const key of keys) {
    if (shell.exec(`npx wrangler kv:key put --binding=DB ${key} ./data/${key}.json --path`).code !== 0) {
        shell.echo('Error: command failed')
        shell.exit(1)
      }
    }
})