require('esbuild').build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './dist/worker.js',
  minify: true,
  sourcemap: true,
  target: 'esnext',
	external: ['fs', 'path', 'util'],
}).catch(() => process.exit(1))