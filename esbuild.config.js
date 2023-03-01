const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: './dist/worker.js',
  minify: true,
  sourcemap: false,
  platform: 'browser',
  target: 'esnext',
  plugins: [
    nodeExternalsPlugin({
      dependencies: false,
    }),
  ],
}).catch(() => process.exit(1));
