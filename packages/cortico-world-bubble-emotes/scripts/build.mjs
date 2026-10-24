import{build}from'esbuild';import{copyFileSync,mkdirSync}from'node:fs';import{fileURLToPath}from'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));mkdirSync(root+'dist',{recursive:true});
await build({absWorkingDir:root,entryPoints:['src/index.ts'],bundle:true,platform:'node',format:'esm',target:'node22',outfile:'dist/index.js',metafile:true}).then(result=>{const external=Object.values(result.metafile.outputs).flatMap(o=>o.imports).filter(i=>i.external&&!i.path.startsWith('node:'));if(external.length)throw Error('Unexpected runtime dependencies: '+external.map(i=>i.path).join(','));});
copyFileSync(root+'src/ENV_PROMPT.md',root+'dist/ENV_PROMPT.md');
await build({absWorkingDir:root,entryPoints:['web/client.ts'],bundle:true,format:'esm',outfile:'dist/webui.js'});
console.log('Built dependency-free JavaScript runtime, prompt asset and WebUI.');
