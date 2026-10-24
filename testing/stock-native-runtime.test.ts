import{it,expect}from'vitest';import{readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync,realpathSync,readdirSync,existsSync}from'node:fs';import{resolve,join}from'node:path';import{tmpdir}from'node:os';import{spawnSync}from'node:child_process';
it('loads the actual npm tarball with plain Node inside node_modules, without tsx, TS support or runtime dependencies',()=>{
 const report=JSON.parse(readFileSync('artifacts/expression-records/npm-pack.json','utf8').replace(/^\uFEFF/,''))[0];const archive=readdirSync('artifacts',{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>resolve('artifacts',e.name,report.filename)).find(p=>existsSync(p));expect(archive).toBeTruthy();const dir=mkdtempSync(join(tmpdir(),'bubble-native-runtime-')),root=realpathSync(dir);expect(root.startsWith(realpathSync(tmpdir()))).toBe(true);
 try{const pkgdir=join(dir,'node_modules','cortico-world-bubble-emotes');mkdirSync(pkgdir,{recursive:true});const unpack=spawnSync('tar',['-xzf',archive!,'--strip-components=1','-C',pkgdir],{encoding:'utf8'});expect(unpack.status,unpack.stderr).toBe(0);writeFileSync(join(dir,'package.json'),'{"type":"module"}');const script=`
 import assert from 'node:assert/strict';import fs from 'node:fs';
 import definition from 'cortico-world-bubble-emotes';
 const world=definition.create({dataDir:${JSON.stringify(join(dir,'data'))},secret:()=>'',storeSecret:()=>{throw Error('unexpected secret write');}});
 assert.equal(world.id,'bubble-emotes');await world.start({store:{latestCursor:()=>0,range:()=>[]}});
 try{assert.equal(world.webUi().lamps.length,3);const prompt=world.webUi().promptDocs[0].path;assert.ok(fs.readFileSync(prompt,'utf8').includes('bubbleEmotes.directGuide'));const out=await world.tools().find(t=>t.name==='bubble_emotes_search').handler({emotion:'comfort'},{signal:new AbortController().signal});assert.ok(JSON.parse(out.text).some(e=>e.text==='💙'));assert.equal(world.webUi().lamps[0].state,'online');}finally{await world.stop();}
 console.log('NATIVE_RUNTIME_OK');`;
 const result=spawnSync(process.execPath,['--no-experimental-strip-types','--input-type=module','-e',script],{cwd:dir,encoding:'utf8',env:{...process.env,NODE_OPTIONS:'',NODE_PATH:''},timeout:10000});expect(result.status,result.stderr).toBe(0);expect(result.stdout).toContain('NATIVE_RUNTIME_OK');expect(readFileSync(join(pkgdir,'package.json'),'utf8')).not.toContain('"main": "./src/index.ts"');
 }finally{if(realpathSync(dir)!==root||!root.startsWith(realpathSync(tmpdir())))throw Error('Unsafe cleanup path');rmSync(root,{recursive:true,force:true});}
});
