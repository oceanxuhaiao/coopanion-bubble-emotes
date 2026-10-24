import {describe,it,expect,afterEach} from 'vitest';
import {mkdtempSync,rmSync,readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {createRequire} from 'node:module';
import {EmoteLibrary,validateEmote,EMOTIONS} from '../packages/cortico-world-bubble-emotes/src/library.ts';
import {DEFAULT_EMOTES} from '../packages/cortico-world-bubble-emotes/src/catalog.ts';
import {BubbleEmotesWorld} from '../packages/cortico-world-bubble-emotes/src/world.ts';
import {pngSize} from '../packages/cortico-world-bubble-emotes/src/media.ts';
import {readPresentation} from '../upstream/Coopanion-0.2.8/packages/cortico-world-desktop-pet/src/presentation.ts';
import {renderPresentation,PresentationSession,presentationSpeech} from '../upstream/Coopanion-0.2.8/packages/cortico-world-desktop-pet/web/presentation.js';
const require=createRequire(new URL('../upstream/Coopanion-0.2.8/package.json',import.meta.url));const {JSDOM}=require('jsdom');
const roots:string[]=[];const temp=()=>{const p=mkdtempSync(join(tmpdir(),'emote-audit-'));roots.push(p);return p};
afterEach(()=>{for(const p of roots.splice(0))rmSync(p,{recursive:true,force:true})});
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=','base64');
const meta={id:'audit',description:'audit image',emotions:['comfort'],intensity:.2,forbidden:[],source:'synthetic fixture',license:'test'};
const vocab=[{id:'neutral',kind:'expression'},{id:'happy',kind:'expression'},{id:'stand',kind:'motion'}] as any;
const plan=(segments:any[])=>({schema:1,requestId:'audit',bodyCue:{expression:'neutral',transitions:[],allowWake:false},segments});
function fakePng(){return Buffer.concat([png.subarray(0,33),png.subarray(png.length-12)])}

describe('F01/F04 all catalog preparations',()=>{
 it.each(DEFAULT_EMOTES.map(e=>[e.id,e]))('%s is prepared with contextual guidance',async(_id,entry:any)=>{
  const world=new BubbleEmotesWorld(temp());await world.start({} as any);const t=world.tools().find(t=>t.name==='bubble_emotes_prepare')!;const r:any=await t.handler({id:entry.id,emotion:entry.emotions[0]},{role:'main',log:{}} as any);expect(r.failed).not.toBe(true);const out=JSON.parse(r.text);expect(out.emote.usage).toBeTruthy();expect(out.suggestedPresentation.segments[0].text).toBe(entry.text);await world.stop();
 });
 it('unknown tool emotion, bad maximum and unavailable emotes return controlled failures',async()=>{const w=new BubbleEmotesWorld(temp());await w.start({} as any);for(const args of [{emotion:'not-real'},{emotion:'joy',maxIntensity:Infinity},{emotion:'joy',maxIntensity:-1}])expect(await w.tools()[0].handler(args,{role:'main',log:{}} as any)).toMatchObject({failed:true});expect(await w.tools()[1].handler({emotion:'joy',id:'missing'},{role:'main',log:{}} as any)).toMatchObject({failed:true});await w.stop();expect(await w.tools()[0].handler({emotion:'joy'},{role:'main',log:{}} as any)).toMatchObject({failed:true});});
});
describe('S03 metadata and path boundaries',()=>{
 it.each(['../escape','..\\escape','C:\\outside','/tmp/out','%2e%2e%2fescape','a/b','a\\b',''])('rejects identifier %s',id=>{expect(()=>validateEmote({...DEFAULT_EMOTES[0],id})).toThrow()});
 it.each(['../outside.png','C:\\outside.png','a'.repeat(64)+'.png/../out','a'.repeat(63)+'.png'])('rejects unsafe sticker file %s',file=>{expect(()=>validateEmote({...meta,kind:'sticker',file,sha256:file.slice(0,-4),reviewed:true,enabled:true})).toThrow()});
 it('detects changed sticker bytes before reading or preparing',()=>{const l=new EmoteLibrary(temp());const e=l.importPng(png,meta as any);writeFileSync(join(l.root,e.file!),Buffer.from('modified'));expect(()=>l.bytes(e)).toThrow(/hash/)});
 it.each([NaN,-.1,1.01,Infinity])('rejects invalid intensity %s',intensity=>expect(()=>validateEmote({...DEFAULT_EMOTES[0],intensity})).toThrow());
 it('rejects overlong description and alias',()=>{expect(()=>validateEmote({...DEFAULT_EMOTES[0],description:'a'.repeat(501)})).toThrow();expect(()=>validateEmote({...DEFAULT_EMOTES[0],aliases:['a'.repeat(501)]})).toThrow()});
 it('S05 rejects unbounded provenance text',()=>{expect(()=>validateEmote({...DEFAULT_EMOTES[0],source:'a'.repeat(200000)})).toThrow()});
 it('S05 emoji text cannot be an ASCII digit instead of a visible emoji',()=>{expect(()=>validateEmote({...DEFAULT_EMOTES[0],text:'1'})).toThrow()});
});
describe('S04 PNG decoding prerequisites',()=>{
 it('accepts a small real PNG',()=>expect(pngSize(png)).toEqual({width:1,height:1}));
 it.each([Buffer.from('not png'),png.subarray(0,32),png.subarray(0,png.length-1),Buffer.alloc(2*1024*1024+1)])('rejects non-PNG/truncated/oversized bytes (%#)',bytes=>expect(()=>pngSize(bytes)).toThrow());
 it('rejects dimensions beyond 2048',()=>{const b=Buffer.from(png);b.writeUInt32BE(2049,16);expect(()=>pngSize(b)).toThrow()});
 it('rejects APNG animation chunks',()=>{const chunk=Buffer.alloc(12);chunk.write('acTL',4);const b=Buffer.concat([png.subarray(0,33),chunk,png.subarray(33)]);expect(()=>pngSize(b)).toThrow(/Animated/)});
 it('rejects a PNG that has no IDAT image data',()=>{expect(()=>pngSize(fakePng())).toThrow()});
 it('rejects incorrect chunk CRC',()=>{const b=Buffer.from(png);b[29]^=255;expect(()=>pngSize(b)).toThrow()});
 it('host also rejects a structurally fake PNG',()=>{expect(()=>readPresentation(plan([{kind:'sticker',handle:'audit',alt:''}]),vocab,()=>({bytes:fakePng(),mime:'image/png'}))).toThrow()});
});
describe('R02/R03 persistence and failures',()=>{
 it.each(['中文 路径','space path','long-'.repeat(12)])('supports isolated path %s',name=>{const dir=join(temp(),name);const l=new EmoteLibrary(dir);l.put({...l.get('calm'),example:'edited'});expect(new EmoteLibrary(dir).get('calm').example).toBe('edited')});
 it('corrupt JSON is rejected without overwriting it',()=>{const dir=temp();const l=new EmoteLibrary(dir);const file=join(l.root,'library.json');writeFileSync(file,'{broken');expect(()=>new EmoteLibrary(dir)).toThrow();expect(readFileSync(file,'utf8')).toBe('{broken')});
 it('future schema is rejected and preserved',()=>{const dir=temp();const l=new EmoteLibrary(dir);const file=join(l.root,'library.json');writeFileSync(file,JSON.stringify({schemaVersion:99,emotes:[]}));expect(()=>new EmoteLibrary(dir)).toThrow();expect(JSON.parse(readFileSync(file,'utf8')).schemaVersion).toBe(99)});
 it('failed index write rolls memory and index back',()=>{const l=new EmoteLibrary(temp());const file=join(l.root,'library.json');rmSync(file+'.bak',{force:true});mkdirSync(file+'.bak');const before=readFileSync(file,'utf8');expect(()=>l.put({...l.get('calm'),example:'must not save'})).toThrow();expect(readFileSync(file,'utf8')).toBe(before);expect(l.get('calm').example).not.toBe('must not save')});
 it('two loaded instances preserve both independent edits',()=>{const dir=temp();const a=new EmoteLibrary(dir),b=new EmoteLibrary(dir);a.put({...a.get('calm'),example:'first-edit'});b.put({...b.get('fear'),example:'second-edit'});const c=new EmoteLibrary(dir);expect(c.get('calm').example).toBe('first-edit');expect(c.get('fear').example).toBe('second-edit')});
 it('does not leave an orphan image after index write failure',()=>{const l=new EmoteLibrary(temp());const file=join(l.root,'library.json');rmSync(file+'.bak',{force:true});mkdirSync(file+'.bak');expect(()=>l.importPng(png,meta as any)).toThrow();expect(readdirSync(l.root).filter(n=>n.endsWith('.png'))).toHaveLength(0)});
 it('legacy migration keeps edits, disabled items and custom imports',()=>{const dir=temp(),l=new EmoteLibrary(dir);const image=l.importPng(png,meta as any);const calm={...l.get('calm'),enabled:false,example:'mine'};writeFileSync(join(l.root,'library.json'),JSON.stringify({schemaVersion:1,emotes:[calm,image]}));const upgraded=new EmoteLibrary(dir);expect(upgraded.get('calm')).toMatchObject(calm);expect(upgraded.bytes(image)).toEqual(png);expect(upgraded.list()).toHaveLength(38);expect(new EmoteLibrary(dir).list()).toEqual(upgraded.list())});
});
describe('F02/S01 host input and rendering',()=>{
 it('renders injected tags/attributes as inert text',()=>{const d=new JSDOM('<p></p>').window.document;const root=d.querySelector('p');renderPresentation(root,[{kind:'text',text:'<img src=x onerror="globalThis.pwn=1"><script>pwn()</script>'}]);expect(root.querySelector('img,script')).toBeNull();expect(root.textContent).toContain('<script>')});
 it('image alt cannot become injected attributes',()=>{const d=new JSDOM('<p></p>').window.document;const root=d.querySelector('p');renderPresentation(root,[{kind:'sticker',src:'data:image/png;base64,AA==',alt:'" onerror="pwn()',width:1,height:1}]);expect(root.querySelector('img').hasAttribute('onerror')).toBe(false)});
 it.each([[],Array.from({length:33},()=>({kind:'text',text:'a'})),[{kind:'text',text:'a'.repeat(4001)}],[{kind:'sticker',handle:'missing',alt:''}]])('rejects bad/oversize/missing presentation (%#)',segments=>expect(()=>readPresentation(plan(segments),vocab,()=>null)).toThrow());
 it('rejects unknown body expression and transition',()=>{expect(()=>readPresentation({...plan([{kind:'emoji',text:'😌'}]),bodyCue:{expression:'bogus',transitions:[],allowWake:false}},vocab,()=>null)).toThrow();expect(()=>readPresentation({...plan([{kind:'emoji',text:'😌'}]),bodyCue:{expression:'neutral',transitions:['bogus'],allowWake:false}},vocab,()=>null)).toThrow()});
 it('enforces max 4 image attachments',()=>expect(()=>readPresentation(plan(Array.from({length:5},()=>({kind:'sticker',handle:'a',alt:''}))),vocab,()=>({bytes:png,mime:'image/png'}))).toThrow());
 it('S05 emoji nodes cannot hide ordinary text from TTS',()=>expect(()=>readPresentation(plan([{kind:'emoji',text:'important ordinary words'}]),vocab,()=>null)).toThrow());
 it('V01 strips all catalog emoji and never speaks metadata',()=>{expect(presentationSpeech(DEFAULT_EMOTES.map(e=>({kind:'emoji',text:e.text,alt:e.usage})))).toBe('');expect(presentationSpeech([{kind:'text',text:'编号123，谢谢。'},...DEFAULT_EMOTES.map(e=>({kind:'emoji',text:e.text}))])).toBe('编号123，谢谢。')});
 it.each(['drag','air','crouch','dizzy'])('R01 cancels unsafe mode %s',mode=>{const reasons:string[]=[];const session=new PresentationSession({figure:'coo',bodyCue:{expression:'neutral',transitions:[],allowWake:false}},{command:()=>1,finish:(r:string)=>reasons.push(r)});session.loaded();expect(session.step({face:'neutral',mode,busy:false,pressing:false,gesture:null,commandSeq:0},'coo')).toBe(false);expect(reasons).toContain('body-interrupted')});
});
