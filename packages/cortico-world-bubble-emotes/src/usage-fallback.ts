export type HintState='queued'|'rendered'|'delivered'|'discarded'|'expired'|'cancelled'|'skipped';
export type HintInfo={state:HintState;reason:string;at:string;ticketId?:string;eventCursor?:number;followup?:{cursor:number;hasEmoji:boolean;at:string}};
import type {WorldHost} from 'cortico/core/types.ts';

/** A bounded fallback, not a semantic classifier or sending middleware. */
export class UsageFallback {
  private cursor:number;
  private streak=0;
  private lastQueued=-Infinity;
  private pending?:{id:string;at:number;valid:()=>boolean;notify:(state:HintState,reason:string)=>void};
  private sequence=0;
  private active=true;
  constructor(private host:WorldHost,private available:()=>boolean,private now=Date.now){
    // Never read historical conversations on mount; an unavailable optional
    // store disables this fallback instead of preventing the library from loading.
    try{this.cursor=host.store.latestCursor();}catch{this.cursor=0;this.active=false;}
  }
  stop(){this.active=false;this.tick();}
  private read(){
    const latest=this.host.store.latestCursor();
    const rows=this.host.store.range({source:'desktop-pet',senderKey:'desktop-pet.self',fromCursor:this.cursor+1,toCursor:latest,limit:100});
    if(latest<this.cursor){this.cursor=latest;this.streak=0;return;}
    // A bounded query can omit older records. Do not join a streak across a gap.
    if(rows.length===100)this.streak=0;
    for(const e of rows.sort((a,b)=>a.cursor-b.cursor)){
      if(e.cursor<=this.cursor||e.cursor>latest||e.type!=='desktop-pet.self'||e.source!=='desktop-pet'||e.senderKey!=='desktop-pet.self'||e.meta?.kind!=='say'||!e.text.trim())continue;
      this.streak=/\p{Extended_Pictographic}|\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3/u.test(e.text)?0:this.streak+1;
    }
    this.cursor=latest;
  }
  tick(){const p=this.pending;if(!p)return;if(this.now()-p.at>120000){this.pending=undefined;p.notify('expired','等待正常对话时已过期');}else if(!this.active||!this.available()||!p.valid()){this.pending=undefined;p.notify('cancelled','记录、表情或运行状态已改变');}}
  review(current:()=>{emotion:string;suggestion:string}|undefined,recordId?:string,report?:(info:HintInfo)=>void){
    this.tick();
    const update=(state:HintState,reason:string,ticketId?:string)=>{try{report?.({state,reason,at:new Date(this.now()).toISOString(),ticketId});}catch{}};
    if(!this.active||!this.available()||!current()){update('skipped','没有近期可用的匹配建议');return;}
    if(this.pending||this.now()-this.lastQueued<120000){update('skipped','已有待送达建议或处于两分钟冷却');return;}
    const id=String(++this.sequence)+'-'+this.now();
    const token={id,at:this.now(),valid:()=>!!current(),notify:(state:HintState,reason:string)=>update(state,reason,id)};
    this.pending=token;this.lastQueued=this.now();token.notify('queued','等待下一次正常对话');
    try{this.host.pushDeferred({type:'bubble-emotes.usage_hint',origin:'internal',senderKey:'expression-usage',tags:['snapshot'],meta:{ticketId:id,recordId},render:()=>{
      this.tick();if(this.pending!==token)return null;
      const assessment=current();if(!assessment){this.pending=undefined;token.notify('cancelled','建议已失效');return null;}
      this.pending=undefined;token.notify('rendered','建议已成文，等待宿主确认送达');
      return 'Expression feedback: a recent completed review found an emotional reply missing emoji. This is advisory and may be wrong. '+JSON.stringify(assessment)+'. Do not send anything solely because of this feedback, repeat the old reply, or send an isolated correction. On the next independently warranted reply, first judge its CURRENT emotion: include one suitable enabled Unicode emoji directly in the SAME pet_say.script if emotional; keep neutral narration plain. The suggested emoji applies only if that emotion still fits. No search or prepare is needed for familiar emoji. Respect silence, Habits, quotation and negation. Never copy a past emotion into an unrelated new topic.';
    }},{trigger:'piggyback'});}catch{if(this.pending===token)this.pending=undefined;token.notify('cancelled','宿主未接受建议排队');}
  }
  scan(){
    if(!this.active)return;
    try{
      this.tick();this.read();
      if(this.pending||this.streak<10||this.now()-this.lastQueued<600000||!this.available())return;
      const token={id:String(++this.sequence),at:this.now(),valid:()=>this.streak>=10,notify:()=>{}};this.pending=token;this.lastQueued=this.now();
      this.host.pushDeferred({type:'bubble-emotes.usage_hint',origin:'internal',senderKey:'expression-usage',tags:['snapshot'],render:()=>{
        this.tick();if(this.pending!==token)return null;this.pending=undefined;
        if(!this.active)return null;
        try{this.read();if(this.streak<10||!this.available())return null;}catch{return null;}
        this.streak=0;
        return 'Expression usage fallback: recent recorded desktop-pet replies contain no emoji. This is a frequency observation, not an emotion judgment or proof of display. Do not send anything because of this note, repeat a reply, or append an isolated emoji. On your next independently warranted emotional reply, choose one suitable enabled emoji from the direct guide and include it in pet_say.script. Keep factual/neutral replies plain and respect silence, Habits, attribution and negation. No new speaking opportunity is created.';
      }},{trigger:'piggyback'});
    }catch{
      // Optional public observation must never break the pet or other Worlds.
      this.pending=undefined;
    }
  }
}
