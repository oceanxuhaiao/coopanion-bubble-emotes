import {it,expect} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createPet,KIT_EXPRESSIONS} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/web/kit/body.js';
import {DesktopPetWorld} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/world.ts';
import {DESKTOP_PET_DEFAULTS} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/config.ts';
import {FakeHost} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/tests/helpers/fake-host.ts';
import {FakePage} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/tests/helpers/page.ts';
import {BODY_EXPRESSIONS} from '../packages/cortico-world-bubble-emotes/src/body-mapping.ts';
import {readBodySnapshot} from '../packages/cortico-world-bubble-emotes/src/body-snapshot.ts';
import {coordinateBody} from '../packages/cortico-world-bubble-emotes/src/body-coordination.ts';
import {DEFAULT_EMOTES} from '../packages/cortico-world-bubble-emotes/src/catalog.ts';

it.each(['idle','sit','sleep','drag','air','crouch'])('audits all 19 allowed faces against the real stock kit in mode %s',mode=>{
 for(const face of Object.keys(BODY_EXPRESSIONS)){
  expect(KIT_EXPRESSIONS).toContain(face);
  const body=createPet({} as any,{bounds:()=>({W:1000,H:800,floorY:700,S:1}),sfx:{play:()=>{}},roam:'calm'});
  body.pet.mode=mode;
  body.doWord(face);
  expect(body.pet.mode).toBe(mode);
  if(['drag','air','crouch'].includes(mode))expect(body.pet.expr).toBeNull();
  else expect(body.pet.expr).toBe(face);
 }
});

it('sends a generated face through stock pet_say and observes its native submitted mood',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'stock-body-')),cfg=structuredClone(DESKTOP_PET_DEFAULTS);
 cfg.enabled=true;cfg.port=0;cfg.window.enabled=false;cfg.asr.enabled=false;
 const host=new FakeHost(),pet=new DesktopPetWorld({cfg,timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>join(dir,'runtimes'),modelsDir:()=>join(dir,'models')});
 let page:FakePage|undefined;
 try{
  await pet.start(host);const windowUrl=new URL((pet as any).server.windowUrl);page=await FakePage.open(windowUrl.origin,'role=pet&host=window&'+windowUrl.hash.slice(1));
  const state=readBodySnapshot(pet.petState())!;
  expect(state.posture).toBe('unknown');
  const result=coordinateBody('太好了 😊','joy','appropriate',false,DEFAULT_EMOTES,true,state);
  expect(result.script).toBe('【happy】太好了 😊');
  const receipt=await pet.tools().find(t=>t.name==='pet_say')!.handler({script:result.script},{role:'main',log:host.log}) as any;
  expect(receipt.failed).toBeUndefined();
  const order=await page.next(m=>m.t==='say');
  expect(order.beats).toMatchObject([{actions:['happy'],text:'太好了 😊'}]);
  await expect.poll(()=>host.store.range(0).filter((e:any)=>e.meta?.kind==='say').length).toBe(1);
  const event=host.store.range(0).find((e:any)=>e.meta?.kind==='say')!;
  expect((event.meta as any).beats[0].mood.id).toBe('happy');
 }finally{await page?.close();await pet.stop();rmSync(dir,{recursive:true,force:true});}
});
