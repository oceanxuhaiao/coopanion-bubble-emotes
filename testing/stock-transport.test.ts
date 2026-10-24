import{it,expect,vi}from'vitest';import{mkdtempSync,rmSync}from'node:fs';import{tmpdir}from'node:os';import{join}from'node:path';import{createRequire}from'node:module';
import{DesktopPetWorld}from'../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/world.ts';
import{DESKTOP_PET_DEFAULTS}from'../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/config.ts';
import{FakeHost}from'../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/tests/helpers/fake-host.ts';import{FakePage}from'../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/tests/helpers/page.ts';
import{BubbleEmotesWorld}from'../packages/cortico-world-bubble-emotes/src/world.ts';import{linked}from'../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/web/ui.js';
import{speechText}from'../scratch/stock-soft-voice-parser-0.4.11.js';
const require=createRequire(new URL('../upstream/Coopanion-0.2.8/package.json',import.meta.url));const{JSDOM}=require('jsdom');
it.each(['standalone','mixed','direct'])('stock 0.2.8 receives and renders %s emoji using only script',async mode=>{
 const dir=mkdtempSync(join(tmpdir(),'stock-transport-')),cfg=structuredClone(DESKTOP_PET_DEFAULTS);cfg.enabled=true;cfg.port=0;cfg.window.enabled=false;cfg.asr.enabled=false;
 const host=new FakeHost(),pet=new DesktopPetWorld({cfg,timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>join(dir,'runtimes'),modelsDir:()=>join(dir,'models')}),emotes=new BubbleEmotesWorld(dir);let page:FakePage|undefined;
 try{await pet.start(host);await emotes.start(host);page=await FakePage.open(new URL(pet.petUrl).origin);
 const prepared=mode==='direct'?null:await emotes.tools().find(t=>t.name==='bubble_emotes_prepare')!.handler({id:'calm',emotion:'calm'},{role:'main',log:host.log})as any;
 const selected=mode==='direct'?emotes.envPromptVars()['bubbleEmotes.directGuide'].split('\n').map(s=>JSON.parse(s)).find(r=>r.intent==='calm').emoji:JSON.parse(prepared.text).suggestedSay.script;const script=mode==='standalone'?selected:'我在 '+selected+' 陪你';
 const say=pet.tools().find(t=>t.name==='pet_say')!;expect((say.parameters.properties as any).presentation).toBeUndefined();expect((say.parameters.properties as any).emoji).toBeUndefined();
 const result=await say.handler({script},{role:'main',log:host.log})as any;expect(result.failed).toBeUndefined();const order=await page.next(m=>m.t==='say');const text=(order.beats as any[]).map(b=>b.text).join('');expect(text).toBe(script);
 const doc=new JSDOM('<p></p>').window.document;doc.querySelector('p').append(linked(text,text.length,doc));expect(doc.querySelector('p').textContent).toBe(script);expect(page.messages.some(m=>m.t==='presentation')).toBe(false);
 }finally{await page?.close();await emotes.stop();await pet.stop();rmSync(dir,{recursive:true,force:true});}
});
it('documents the actual stock third-party voice limitation instead of asserting a filter',()=>{expect(speechText('陪你 💙')).toContain('💙');});

it('observes real stock accepted-say records across turns without counting failed sends or waking the pet',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'stock-usage-')),cfg=structuredClone(DESKTOP_PET_DEFAULTS);cfg.enabled=true;cfg.port=0;cfg.window.enabled=false;cfg.asr.enabled=false;
 const host=new FakeHost(),queued:any[]=[];host.pushDeferred=((spec:any,opts:any)=>queued.push({spec,opts}))as any;
 const pet=new DesktopPetWorld({cfg,timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>join(dir,'runtimes'),modelsDir:()=>join(dir,'models')}),emotes=new BubbleEmotesWorld(dir);let page:FakePage|undefined;
 try{await pet.start(host);await emotes.start(host);const say=pet.tools().find(t=>t.name==='pet_say')!;
 expect(await say.handler({script:'not connected'},{role:'main',log:host.log})).toMatchObject({failed:true});emotes.onTurnEnded();expect(queued).toHaveLength(0);
 page=await FakePage.open(new URL(pet.petUrl).origin);
 for(let i=0;i<10;i++){await say.handler({script:'一条普通叙述'},{role:'main',log:host.log});await page.next(m=>m.t==='say');await new Promise(resolve=>setImmediate(resolve));emotes.onTurnEnded();if(i<9)expect(queued).toHaveLength(0);}
 expect(queued).toHaveLength(1);expect(queued[0].opts.trigger).toBe('piggyback');
 await say.handler({script:'我在这里 💙'},{role:'main',log:host.log});await page.next(m=>m.t==='say');await new Promise(resolve=>setImmediate(resolve));expect(queued[0].spec.render()).toBeNull();
 }finally{await page?.close();await emotes.stop();await pet.stop();rmSync(dir,{recursive:true,force:true});}
});

it('links native accepted speech to review, queued advice, host delivery and the next reply',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'stock-feedback-')),cfg=structuredClone(DESKTOP_PET_DEFAULTS);cfg.enabled=true;cfg.port=0;cfg.window.enabled=false;cfg.asr.enabled=false;
 const host=new FakeHost(),queued:any[]=[];host.pushDeferred=((spec:any,opts:any)=>queued.push({spec,opts}))as any;
 const originalFetch=fetch;vi.stubGlobal('fetch',async(input:any,options:any)=>String(input)==='http://127.0.0.1:11434/api/chat'?new Response(JSON.stringify({message:{content:JSON.stringify({emotion:'comfort',verdict:'missing',explanation:'表达陪伴。',suggestion:'💙'})}})):originalFetch(input,options));
 const pet=new DesktopPetWorld({cfg,timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>join(dir,'runtimes'),modelsDir:()=>join(dir,'models')}),emotes=new BubbleEmotesWorld(dir);let page:FakePage|undefined;
 try{await pet.start(host);await emotes.start(host);page=await FakePage.open(new URL(pet.petUrl).origin);const invoke=(m:string,a:any[]=[])=>emotes.webUi().invoke!('records',m,a);await invoke('configure',[{enabled:true,backend:'ollama',model:'synthetic'}]);const say=pet.tools().find(t=>t.name==='pet_say')!;
 await say.handler({script:'我会陪着你。'},{role:'main',log:host.log});await page.next(m=>m.t==='say');await new Promise(resolve=>setImmediate(resolve));emotes.onTurnEnded();await expect.poll(()=>queued.length).toBe(1);let state:any=await invoke('state');const id=state.rows[0].id;expect(state.rows[0].hint.state).toBe('queued');expect(queued[0].spec.render()).toContain('SAME pet_say.script');state=await invoke('state');expect(state.rows[0].hint.state).toBe('rendered');emotes.onEventsSettled([{type:'bubble-emotes.usage_hint',source:'bubble-emotes',cursor:host.store.latestCursor(),meta:queued[0].spec.meta}as any],'delivered');state=await invoke('state');expect(state.rows[0].hint.state).toBe('delivered');
 await say.handler({script:'我在呢 💙'},{role:'main',log:host.log});await page.next(m=>m.t==='say');await new Promise(resolve=>setImmediate(resolve));emotes.onTurnEnded();state=await invoke('state');expect(state.rows.find((r:any)=>r.id===id).hint.followup.hasEmoji).toBe(true);
 }finally{vi.unstubAllGlobals();await page?.close();await emotes.stop();await pet.stop();rmSync(dir,{recursive:true,force:true});}
});
