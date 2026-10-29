import{describe,it,expect,afterEach,vi}from'vitest';
import{mkdtempSync,rmSync,readFileSync,writeFileSync}from'node:fs';import{tmpdir}from'node:os';import{join}from'node:path';
import type{WorldHost,ToolOutcome}from'cortico/core/types.ts';import{BubbleEmotesWorld}from'../src/world.ts';import{BUBBLE_EMOTES}from'../src/definition.ts';import{parsePageId}from'cortico/web/shared/webui-protocol.ts';
import {renderWorldEnvPrompt} from 'cortico/core/prefix.ts';
const dirs:string[]=[];afterEach(()=>{for(const d of dirs.splice(0))rmSync(d,{recursive:true,force:true});});
async function setup(){const dir=mkdtempSync(join(tmpdir(),'stock-emotes-'));dirs.push(dir);const world=new BubbleEmotesWorld(dir);await world.start({}as WorldHost);return{dir,world,invoke:world.webUi().invoke!,call:async(name:string,args:Record<string,unknown>)=>world.tools().find(t=>t.name===name)!.handler(args,{role:'main',log:{}as WorldHost['log']})as Promise<ToolOutcome>};}
describe('stock-compatible emoji World',()=>{
 it('renders current common characters through the official host template without a tool call',async()=>{const s=await setup();const rendered=await renderWorldEnvPrompt(s.world);expect(rendered.text).not.toContain('{{');const rows=s.world.envPromptVars()['bubbleEmotes.directGuide'].split('\n').map(x=>JSON.parse(x));expect(rows).toHaveLength(8);expect(rows.find(r=>r.intent==='calm').emoji).toBe('😌');expect(rows.find(r=>r.intent==='comfort').emoji).toBe('💙');for(const r of rows)expect(rendered.text).toContain(r.emoji);await s.world.stop();});
 it('rebuilds the guide from edits and excludes disabled, unreviewed or forbidden entries',async()=>{const s=await setup();const entries=await s.invoke('library','list',[])as any[];for(const e of entries){await s.invoke('library','update',[{...e,enabled:e.id==='calm',text:e.id==='calm'?'🙂':e.text}]);}let rows=s.world.envPromptVars()['bubbleEmotes.directGuide'].split('\n').map(x=>JSON.parse(x));expect(rows).toHaveLength(1);expect(rows[0]).toMatchObject({intent:'calm',emoji:'🙂'});const calm=(await s.invoke('library','list',[])as any[]).find(e=>e.id==='calm');await s.invoke('library','update',[{...calm,forbidden:['calm']}]);expect(s.world.envPromptVars()['bubbleEmotes.directGuide']).toContain('No enabled');await s.invoke('library','update',[{...calm,reviewed:false}]);expect(s.world.envPromptVars()['bubbleEmotes.directGuide']).toContain('No enabled');const rendered=await renderWorldEnvPrompt(s.world);expect(rendered.text).not.toMatch(/\p{Extended_Pictographic}/u);await s.world.stop();});
 it('keeps the existing World identity and valid page id',()=>{const w=new BubbleEmotesWorld('unused');expect(w.id).toBe(BUBBLE_EMOTES.id);expect(parsePageId('world:'+w.id)).not.toBeNull();expect(w.webUi().panels?.some(p=>p.id==='library')).toBe(true);});
 it('prepares standard script only, with no binary attachments',async()=>{const s=await setup();const out=await s.call('bubble_emotes_prepare',{id:'calm',emotion:'calm'});const p=JSON.parse(out.text);expect(p.suggestedSay).toEqual({script:'😌'});expect(p.suggestedPresentation).toBeUndefined();expect(out.blobs).toBeUndefined();expect(out.failed).toBeUndefined();await s.world.stop();});
 it('searches Chinese meanings and respects disabled and conflicting entries',async()=>{const s=await setup();const entries=await s.invoke('library','list',[])as any[];const calm=entries.find(e=>e.id==='calm');expect(JSON.parse((await s.call('bubble_emotes_search',{emotion:'calm',query:'平静'})).text)).toHaveLength(1);await s.invoke('library','update',[{...calm,enabled:false}]);expect(await s.call('bubble_emotes_prepare',{id:'calm',emotion:'calm'})).toMatchObject({failed:true});expect(await s.call('bubble_emotes_prepare',{id:'joy',emotion:'sadness'})).toMatchObject({failed:true});await s.world.stop();});
 it('rejects image import and excludes existing image metadata from every public path',async()=>{const s=await setup();const path=join(s.dir,'bubble-emotes/library.json'),raw=JSON.parse(readFileSync(path,'utf8'));raw.emotes.push({...raw.emotes[0],id:'old-image',kind:'sticker',text:undefined,file:'b'.repeat(64)+'.png',sha256:'b'.repeat(64)});writeFileSync(path,JSON.stringify(raw));await expect(s.invoke('library','import',[{}])).rejects.toThrow(/Unsupported/);expect((await s.invoke('library','list',[])as any[]).every(e=>e.kind==='emoji')).toBe(true);await expect(s.invoke('library','preview',['old-image'])).rejects.toThrow(/not supported/);expect(await s.call('bubble_emotes_prepare',{id:'old-image',emotion:raw.emotes[0].emotions[0]})).toMatchObject({failed:true});await s.world.stop();});
 it('rejects replacing an emoji with an image',async()=>{const s=await setup();const e=(await s.invoke('library','list',[])as any[])[0];await expect(s.invoke('library','update',[{...e,kind:'sticker'}])).rejects.toThrow(/Unicode/);await s.world.stop();});
});

it('exposes three live native sidebar lamps and contains library failure without losing the panel',async()=>{const s=await setup();try{expect(s.world.webUi().lamps?.map(l=>l.state)).toEqual(['online','online']);const entries=await s.invoke('library','list',[])as any[];for(const e of entries)await s.invoke('library','update',[{...e,enabled:false}]);expect(s.world.webUi().lamps?.[0]).toMatchObject({state:'offline'});writeFileSync(join(s.dir,'bubble-emotes/library.json'),'broken');expect(s.world.webUi().lamps?.[0]).toMatchObject({state:'error'});expect(s.world.webUi().panels).toHaveLength(1);}finally{await s.world.stop();}expect(s.world.webUi().lamps?.every(l=>l.state==='offline')).toBe(true);});


it.each([true,false])('checks a draft through the real World adapter, with desktop state available=%s',async available=>{
 const originalFetch=globalThis.fetch;
 vi.stubGlobal('fetch',async(url:any)=>{
  if(String(url).includes('/panels/pet/state'))return new Response(JSON.stringify({connected:true,onDesktop:true,skin:{figure:'whale'},wake:{wakeOn:'none'}}),{status:available?200:503});
  if(String(url).includes('11434'))return new Response(JSON.stringify({message:{content:JSON.stringify({emotion:'joy',verdict:'missing',explanation:'开心。',suggestion:'😊'})}}));
  throw Error('Unexpected endpoint');
 });
 const s=await setup();
 try{
  await s.invoke('library','configure',[{enabled:true}]);
  const result=await s.call('bubble_emotes_review_draft',{draft:'太好了',context:'好消息',assessment:{expressionIntent:'emotional_commentary',emojiSuitability:'suitable',emotion:'joy',verdict:'missing',explanation:'开心',suggestion:'😊'}});
  const review=JSON.parse(result.text);
  expect(review.finalDraft).toBe(available?'【happy】太好了 😊':'太好了 😊');
  expect(review.body.state).toBe(available?'suggested':'blocked');
  expect(review.sent).toBe(false);
  await s.invoke('library','bodyCoordination',[false]);
  const disabled=JSON.parse((await s.call('bubble_emotes_review_draft',{draft:'太好了',context:'好消息',assessment:{expressionIntent:'emotional_commentary',emojiSuitability:'suitable',emotion:'joy',verdict:'missing',explanation:'开心',suggestion:'😊'}})).text);
  expect(disabled.finalDraft).toBe('太好了 😊');
 }finally{await s.world.stop();globalThis.fetch=originalFetch;vi.unstubAllGlobals();}
});
