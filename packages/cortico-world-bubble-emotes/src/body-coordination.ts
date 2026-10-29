import{DEFAULT_EMOTES}from'./catalog.ts';
import{BODY_EXPRESSIONS,type BodyExpression}from'./body-mapping.ts';import type{Emote}from'./library.ts';
export type BodySnapshot={figure:string;connected:boolean;onDesktop?:boolean;quiet:boolean|'unknown';posture:'awake'|'sleeping'|'interacting'|'unknown';observedAt:number;faceProtection?:'builtin-kit'};
export type BodyDecision={state:'off'|'blocked'|'suggested';reason:string;suggested?:BodyExpression;match?:string;display:'unknown';figure?:string};
export function coordinateBody(script:string,emotion:string,verdict:string,conflict:boolean,entries:Emote[],enabled:boolean,snapshot?:BodySnapshot):{script:string;body:BodyDecision}{
 const body:BodyDecision={state:enabled?'blocked':'off',reason:enabled?'等待判断':'身体协调已关闭',display:'unknown'};
 const done=(reason:string)=>({script,body:{...body,reason}});
 if(!enabled)return done('身体协调已关闭，保留文字与emoji检查');
 if(conflict||emotion==='neutral'||emotion==='uncertain'||['uncertain','inappropriate'].includes(verdict))return done('中性、判断冲突、语境不足或已有表情不匹配，保留原稿');
 const list=entries.filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.emotions.includes(emotion as any)&&!e.forbidden.includes(emotion as any));
 const selected=list.filter(e=>e.text&&script.includes(e.text));
 const signatures=new Set(selected.map(e=>e.bodyExpression??'none'));if(signatures.size>1)return done('多个emoji的身体建议冲突，保留原稿');
 const entry=selected.find(e=>e.bodyMatch!=='none'&&e.bodyExpression&&Object.hasOwn(BODY_EXPRESSIONS,e.bodyExpression));
 if(!entry?.bodyExpression)return done('没有已确认且可用于该语境的内置身体映射');

 body.suggested=entry.bodyExpression as BodyExpression;body.match=entry.bodyMatch??'approximate';body.figure=snapshot?.figure;
 const approved=DEFAULT_EMOTES.find(e=>e.id===entry.id&&e.text===entry.text&&e.bodyExpression===entry.bodyExpression&&e.bodyMatch===entry.bodyMatch);if(!approved)return done('使用自定义身体心情建议，仍需结合语境判断，不自动追加标记');
 if(/【[^】]*】|<[^<>\n]{1,80}>|＜[^＜＞\n]{1,80}＞/u.test(script))return done('原稿已有身体或动作标记，不自动覆盖或追加');
 if(!snapshot||!Number.isFinite(snapshot.observedAt)||Date.now()-snapshot.observedAt>2000||snapshot.observedAt>Date.now()+1000)return done('身体状态未知或已过期，只给建议，不追加标记');
 if(!['coo','whale'].includes(snapshot.figure))return done('当前形象未验证支持，保留原稿');
 if(!snapshot.connected)return done('桌宠窗口未连接，保留原稿');
 if(snapshot.onDesktop===false)return done('桌宠窗口未显示，保留原稿');
 if(snapshot.quiet===true)return done('安静状态已开启，仅不追加身体标记，emoji建议保留');
 if(snapshot.posture==='sleeping'||snapshot.posture==='interacting')return done(snapshot.posture==='sleeping'?'睡眠优先，不唤醒':'用户互动优先，不打断');
 if((snapshot.quiet==='unknown'||snapshot.posture==='unknown')&&snapshot.faceProtection!=='builtin-kit')return done('无法确认实时身体状态或原生表情保护，只给建议，不追加标记');
 body.state='suggested';body.reason=snapshot.faceProtection==='builtin-kit'?'已生成内置表情标记；实时姿态未确认，睡眠与忙碌处理交给原生播放器，不执行唤醒或独立动作；未发送、未确认显示':'同一候选稿建议内置身体表情，主模型仍需结合当前语境决定；未发送、未确认显示';
 return{script:'【'+body.suggested+'】'+script,body};
}
