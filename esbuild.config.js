const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: './dist/worker.js',
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: 'esnext',
	external: [nodeExternalsPlugin()],
}).catch(() => process.exit(1))