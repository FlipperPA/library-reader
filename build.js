const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['content.js'],
  bundle: true,
  outfile: 'dist/content.bundle.js',
  external: [],
  platform: 'browser'
}).catch(() => process.exit(1));
