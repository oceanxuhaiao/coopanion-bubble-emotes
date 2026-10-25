import{DEFAULT_EMOTES}from'./catalog.ts';
import{createHash}from'node:crypto';import{BODY_EXPRESSIONS,type BodyExpression}from'./body-mapping.ts';import type{Emote}from'./library.ts';
export type BodySnapshot={figure:string;connected:boolean;quiet:boolean|'unknown';posture:'awake'|'sleeping'|'interacting'|'unknown';observedAt:number};
export type BodyDecision={state:'off'|'blocked'|'suggested';reason:string;suggested?:BodyExpression;match?:string;submitted?:string;observation:'not_seen'|'submitted'|'different'|'no_metadata'|'ambiguous';display:'unknown';fingerprint?:string;figure?:string};
export const plainScript=(s:string)=>s.replace(/【[^】]*】|<[^<>\n]{1,80}>/gu,'').trim();
export const speechFingerprint=(s:string)=>createHash('sha256').update(plainScript(s)).digest('hex');
export function coordinateBody(script:string,emotion:string,verdict:string,conflict:boolean,entries:Emote[],enabled:boolean,snapshot?:BodySnapshot):{script:string;body:BodyDecision}{
 const body:BodyDecision={state:enabled?'blocked':'off',reason:enabled?'等待判断':'身体协调已关闭',observation:'not_seen',display:'unknown'};
 const done=(reason:string)=>({script,body:{...body,reason}});
 if(!enabled)return done('身体协调已关闭，保留文字与emoji检查');
 if(conflict||emotion==='neutral'||emotion==='uncertain'||['uncertain','inappropriate'].includes(verdict))return done('中性、判断冲突、语境不足或已有表情不匹配，保留原稿');
 const list=entries.filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.emotions.includes(emotion as any)&&!e.forbidden.includes(emotion as any));
 const selected=list.filter(e=>e.text&&script.includes(e.text));
 const signatures=new Set(selected.map(e=>e.bodyExpression??'none'));if(signatures.size>1)return done('多个emoji的身体建议冲突，保留原稿');
 const entry=(selected.length?selected:list).find(e=>e.bodyMatch!=='none'&&e.bodyExpression&&Object.hasOwn(BODY_EXPRESSIONS,e.bodyExpression));
 if(!entry?.bodyExpression)return done('没有已确认且可用于该语境的内置身体映射');

 body.suggested=entry.bodyExpression as BodyExpression;body.match=entry.bodyMatch??'approximate';body.fingerprint=speechFingerprint(script);body.figure=snapshot?.figure;
 const approved=DEFAULT_EMOTES.find(e=>e.id===entry.id&&e.text===entry.text&&e.bodyExpression===entry.bodyExpression&&e.bodyMatch===entry.bodyMatch);if(!approved)return done('使用自定义身体心情建议，仍需结合语境判断，不自动追加标记');
 if(/【[^】]*】|<[^<>\n]{1,80}>/u.test(script))return done('原稿已有身体或动作标记，不自动覆盖或追加');
 if(!snapshot||Date.now()-snapshot.observedAt>2000||snapshot.observedAt>Date.now()+1000)return done('身体状态未知或已过期，只给建议，不追加标记');
 if(!['coo','whale'].includes(snapshot.figure))return done('当前形象未验证支持，保留原稿');
 if(!snapshot.connected)return done('桌宠窗口未连接，保留原稿');
 if(snapshot.quiet!==false)return done('处于安静要求或无法确认习惯，保留原稿');
 if(snapshot.posture!=='awake')return done(snapshot.posture==='sleeping'?'睡眠优先，不唤醒':snapshot.posture==='interacting'?'用户互动优先，不打断':'无法确认实时身体状态，只给建议，不追加标记');
 body.state='suggested';body.reason='同一候选稿建议内置身体表情，主模型仍需结合当前语境决定；未发送、未确认显示';
 return{script:'<'+body.suggested+'>'+script,body};
}
export function restoreBody(raw:any):BodyDecision|undefined{if(!raw||!['off','blocked','suggested'].includes(raw.state))return;return{state:raw.state,reason:typeof raw.reason==='string'?raw.reason.slice(0,300):'旧诊断',suggested:Object.hasOwn(BODY_EXPRESSIONS,raw.suggested)?raw.suggested:undefined,match:['direct','approximate','none'].includes(raw.match)?raw.match:undefined,submitted:typeof raw.submitted==='string'?raw.submitted.slice(0,40):undefined,observation:['not_seen','submitted','different','no_metadata','ambiguous'].includes(raw.observation)?raw.observation:'not_seen',display:'unknown',fingerprint:/^[a-f0-9]{64}$/.test(raw.fingerprint??'')?raw.fingerprint:undefined,figure:typeof raw.figure==='string'?raw.figure.slice(0,80):undefined};}
