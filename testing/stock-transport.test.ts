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


it('submits a checked final script through stock pet_say without collecting speech',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'stock-draft-only-')),cfg=structuredClone(DESKTOP_PET_DEFAULTS);cfg.enabled=true;cfg.port=0;cfg.window.enabled=false;cfg.asr.enabled=false;
 const host=new FakeHost(),pet=new DesktopPetWorld({cfg,timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>join(dir,'runtimes'),modelsDir:()=>join(dir,'models')}),emotes=new BubbleEmotesWorld(dir);let page:FakePage|undefined;
 try{vi.stubGlobal('fetch',async()=>{throw Error('No external service');});await pet.start(host);await emotes.start({store:new Proxy({},{get(){throw Error('Unexpected event-store read');}})}as any);page=await FakePage.open(new URL(pet.petUrl).origin);
 const result=await emotes.tools().find(t=>t.name==='bubble_emotes_review_draft')!.handler({draft:'我会陪着你。',context:'温柔陪伴',assessment:{expressionIntent:'emotional_commentary',emojiSuitability:'suitable',emotion:'comfort',verdict:'missing',explanation:'陪伴。',suggestion:'💙'}},{role:'main',log:host.log})as any;
 const checked=JSON.parse(result.text);expect(checked.finalDraft).toBe('我会陪着你。 💙');
 await pet.tools().find(t=>t.name==='pet_say')!.handler({script:checked.finalDraft},{role:'main',log:host.log});const order=await page.next(m=>m.t==='say');expect((order.beats as any[])[0].text).toBe(checked.finalDraft);
 expect(emotes.webUi().panels?.map(p=>p.id)).toEqual(['library']);expect(emotes).not.toHaveProperty('onTurnEnded');const state=await emotes.webUi().invoke!('library','state',[])as any;expect(state).not.toHaveProperty('rows');
 }finally{vi.unstubAllGlobals();await page?.close();await emotes.stop();await pet.stop();rmSync(dir,{recursive:true,force:true});}
});
