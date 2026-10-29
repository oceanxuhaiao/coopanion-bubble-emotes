import {applyExpressionPolicy} from './expression-policy.ts';
import {coordinateBody,type BodySnapshot} from './body-coordination.ts';
import {mkdirSync,readFileSync,existsSync,writeFileSync,renameSync,unlinkSync} from 'node:fs';
import {join,dirname} from 'node:path';import {randomUUID} from 'node:crypto';
import {EMOTIONS,type Emote} from './library.ts';import {isEmojiContent} from './emoji.ts';
export type Assessment={emotion:string;verdict:'appropriate'|'missing'|'unnecessary'|'inappropriate'|'uncertain';explanation:string;suggestion?:string};
const segmenter=new Intl.Segmenter(undefined,{granularity:'grapheme'});
export const actualEmoji=(text:string)=>[...new Set([...segmenter.segment(text)].map(s=>s.segment).filter(s=>s.trim()&&isEmojiContent(s)))];
export function parseAssessment(raw:string,used:string[],entries:Emote[]):Assessment{
 if(typeof raw!=='string'||raw.length>32000)throw Error('分析返回过长或不可用');
 const obj=JSON.parse(raw.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
 if(!obj||typeof obj!=='object'||![...EMOTIONS,'uncertain'].includes(obj.emotion)||!['appropriate','missing','unnecessary','inappropriate','uncertain'].includes(obj.verdict)||typeof obj.explanation!=='string'||!obj.explanation.trim()||obj.explanation.length>500)throw Error('分析格式不正确');
 if((!used.length&&['appropriate','inappropriate'].includes(obj.verdict))||(used.length&&['missing','unnecessary'].includes(obj.verdict)))throw Error('分析与实际表情使用情况冲突');
 if(obj.suggestion!==undefined&&(typeof obj.suggestion!=='string'||!entries.some(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.text===obj.suggestion&&e.emotions.includes(obj.emotion as any)&&!e.forbidden.includes(obj.emotion as any))))throw Error('建议表情不在当前可用语义范围内');
 return{emotion:obj.emotion,verdict:obj.verdict,explanation:obj.explanation.trim(),...(['missing','inappropriate'].includes(obj.verdict)&&obj.suggestion?{suggestion:obj.suggestion}:{})};
}
export function reviewAssessment(raw:string,used:string[],entries:Emote[]):{analysis:Assessment;notice?:string;needsReview?:boolean}{
 if(typeof raw!=='string'||raw.length>32000)throw Error('分析返回过长或不可用');
 const obj=JSON.parse(raw.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
 if(!obj||!['appropriate','missing','unnecessary','inappropriate','uncertain'].includes(obj.verdict))throw Error('分析格式不正确');
 const core={...obj};delete core.suggestion;
 // Validate primary fields before treating a fact conflict as an unresolved judgment.
 parseAssessment(JSON.stringify({...core,verdict:'uncertain'}),used,entries);
 const conflict=(!used.length&&['appropriate','inappropriate'].includes(obj.verdict))||(used.length&&['missing','unnecessary'].includes(obj.verdict));
 if(conflict)return{analysis:{emotion:'uncertain',verdict:'uncertain',explanation:'模型的使用判定与实际表情记录冲突，本次无法可靠判断。'},needsReview:true,notice:'主要结论与观测事实冲突；待复核，不用于表情提醒。'};
 const analysis=parseAssessment(JSON.stringify(core),used,entries);
 if(obj.suggestion===undefined)return{analysis};
 if(!['missing','inappropriate'].includes(obj.verdict))return{analysis,notice:'本次判断无需建议表情，已忽略多余建议。'};
 try{return{analysis:parseAssessment(raw,used,entries)};}
 catch{return{analysis,notice:'可选表情建议不在当前可用语义范围，已忽略；主要判断保留。'};}
}
export class DraftReview {
 private file:string;private enabled=true;private bodyEnabled=true;private stopped=false;private storageError='';private generation=0;private busy=false;private abort?:AbortController;
 constructor(dataDir:string,private entries:()=>Emote[],private bodySnapshot?:(signal:AbortSignal)=>Promise<BodySnapshot|undefined>){
  this.file=join(dataDir,'bubble-emotes','draft-settings.json');
  if(existsSync(this.file))try{const text=readFileSync(this.file,'utf8');if(text.length>2000)throw Error();const d=JSON.parse(text);if(d.version!==1||typeof d.enabled!=='boolean'||typeof d.bodyEnabled!=='boolean')throw Error();this.enabled=d.enabled;this.bodyEnabled=d.bodyEnabled;}catch{this.storageError='草稿设置无法读取，原文件保留。';this.enabled=false;}
 }
 private save(){if(this.storageError)throw Error(this.storageError);mkdirSync(dirname(this.file),{recursive:true});const tmp=this.file+'.'+randomUUID()+'.tmp';try{writeFileSync(tmp,JSON.stringify({version:1,enabled:this.enabled,bodyEnabled:this.bodyEnabled}),'utf8');renameSync(tmp,this.file);}finally{if(existsSync(tmp))unlinkSync(tmp);}}
 state(){return{settings:{enabled:this.enabled},reviewMode:'main-model-self-check',bodyCoordination:{enabled:this.bodyEnabled,scope:'内置Coo/大肥鱼19种身体表情；由原生播放器保护，不执行唤醒或独立动作'},draftMode:{enabled:this.draftActive(),busy:this.busy},storageError:this.storageError};}
 configure(raw:unknown){const v=raw as any;if(!v||typeof v.enabled!=='boolean'||Object.keys(v).some(k=>k!=='enabled'))throw Error('草稿设置无效');this.generation++;this.abort?.abort();this.enabled=v.enabled;this.save();return this.state();}
 configureBody(value:unknown){if(typeof value!=='boolean')throw Error('身体协调开关无效');this.generation++;this.abort?.abort();this.bodyEnabled=value;this.save();return this.state();}
 bodyActive(){return this.bodyEnabled&&this.draftActive();}
 draftActive(){return this.enabled&&!this.stopped&&!this.storageError;}
 statusLamp():import('cortico/web/shared/webui-protocol.ts').WebUiLamp{return{label:'草稿检查',state:this.stopped?'offline':this.storageError?'error':!this.enabled?'offline':this.busy?'loading':'online',hint:this.storageError||'当前主模型自检，不是独立复核；不保存草稿或发言'};}
 async reviewDraft(raw:unknown,callerSignal?:AbortSignal){
  const v=raw as any;if(!v||typeof v.draft!=='string'||!v.draft.trim()||v.draft.length>600||typeof v.context!=='string'||v.context.length>400)throw Error('草稿最多600字、语境最多400字');
  if(!this.draftActive())return{status:'disabled',sent:false,instruction:'草稿检查未开启；自行决定是否发言。'};
  if(this.busy)return{status:'busy',sent:false};if(callerSignal?.aborted)return{status:'cancelled',sent:false};
  this.busy=true;this.abort=new AbortController();const gen=this.generation;
  try{
   const signal=AbortSignal.any([this.abort.signal,AbortSignal.timeout(2000),...(callerSignal?[callerSignal]:[])]);
   if(!v.assessment||typeof v.assessment!=='object'||!['emotional_commentary','neutral_narration','uncertain'].includes(v.assessment.expressionIntent)||!['suitable','avoid','uncertain'].includes(v.assessment.emojiSuitability))throw Error('缺少结构化主模型自检');
   const used=actualEmoji(v.draft),checked=applyExpressionPolicy(reviewAssessment(JSON.stringify(v.assessment),used,this.entries()),v.assessment,used,this.entries());
   const a=checked.analysis,conflict=!!checked.needsReview,added=!conflict&&a.verdict==='missing'&&!!a.suggestion&&!used.length;
   const snapshot=this.bodyEnabled?await this.bodySnapshot?.(signal).catch(()=>undefined):undefined;
   if(signal.aborted||gen!==this.generation||!this.draftActive())throw Error('cancelled');
   const body=coordinateBody(added?v.draft+' '+a.suggestion:v.draft,a.emotion,a.verdict,conflict,this.entries(),this.bodyEnabled,snapshot);
   return{status:conflict?'needs_review':'reviewed',source:'main-model-self-check',analysis:a,body:body.body,notice:checked.notice,originalDraft:v.draft,finalDraft:body.script,changed:body.script!==v.draft,sent:false,instruction:'This is the current main model self-check, not an independent review. Read finalDraft and decide whether one reply remains warranted. Retain its emoji and suggested leading face only while the CURRENT meaning still fits; blocked/off prohibits a face marker, not the emoji. Never add motions, wake a pet or repeat a sent reply. This tool sends nothing, stores no draft/history and does not intercept pet_say.'};
  }catch{return{status:gen!==this.generation||this.stopped||callerSignal?.aborted?'cancelled':'unavailable',finalDraft:v.draft,changed:false,sent:false,error:'自检无效或已取消，保留原稿。'};}
  finally{this.busy=false;}
 }
 stop(){this.stopped=true;this.generation++;this.abort?.abort();}
}
