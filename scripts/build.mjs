import {build} from 'esbuild';
import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');await copyFile('index.html','dist/index.html');await cp('src','dist/src',{recursive:true});console.log('Built static frontend in dist/');

await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outfile:'dist/src/app.js',platform:'browser',target:'es2022',legalComments:'eof'});
