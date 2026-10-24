import {MusicWorld,toolDecls} from '../../网易云音乐/src/world.ts';
import {defaults} from '../../网易云音乐/src/config.ts';
import type{WorldHost}from'cortico/core/types.ts';

// Real installed music World produces these events. Inputs/readers/comments are
// synthetic; no player, browser, network comments or user's conversation is read.
export async function musicFixture(text:string,id:string){
 const cfg={...defaults(),enabled:true,maxCommentChars:40};let callback:any;let cursor=0;
 const events:any[]=[];const original=Date.now;let clock=Date.parse('2026-10-23T12:00:00+08:00');Date.now=()=>clock;
 const world=new MusicWorld(cfg,()=>{throw Error('Test must not persist preferences');},{start(cb:any){callback=cb;},async stop(){}},{async get(){return{status:'ok',match:'title-artist-version-unverified',excerpts:[{text,kind:'hot',likes:10}]};}} as any);
 try{
  await world.start({pushEvent:async(e:any)=>{const saved={...e,cursor:++cursor};events.push(saved);return saved;}} as WorldHost);
  const track={title:'测试曲目-'+id,artist:'测试歌手',album:'',app:'cloudmusic',status:'playing',method:'smtc'};
  callback({track});clock+=9000;callback({track});await world.tick(clock);
  if(events.length!==2)throw Error('Real music World did not generate event pair');
  const receipt=await world.tools().find(t=>t.name==='music_now_playing')!.handler({},{role:'main',log:{}as any});
  if(!JSON.parse(String(receipt)).readyToComment)throw Error('Fixture track must be settled');
  return{events,receipt:typeof receipt==='string'?receipt:receipt.text,tools:toolDecls};
 }finally{await world.stop();Date.now=original;}
}
