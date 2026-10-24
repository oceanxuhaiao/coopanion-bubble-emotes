// Isolated model/tool-choice evaluation. No requests reach the user's pet or chat.
import {mkdtempSync,readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {BubbleEmotesWorld} from '../packages/cortico-world-bubble-emotes/src/world.ts';
import {BubbleEmotesWorld as BaselineWorld} from '../scratch/acceptance-baseline-031/package/src/world.ts';
import {renderWorldEnvPrompt} from '../upstream/Coopanion-0.2.8/vendor/cortico/src/core/prefix.ts';
import {DesktopPetWorld} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/world.ts';
import {DESKTOP_PET_DEFAULTS} from '../scratch/compat-0.2.8-stock/packages/cortico-world-desktop-pet/src/config.ts';
import type {WorldHost} from 'cortico/core/types.ts';

const situations = {
 chat:['朋友今天终于拿到了心仪的录取通知。','朋友养了很久的小狗昨天去世了。','朋友说最近压力很大，想有人陪一会儿。','朋友终于结束忙碌的一周，正在阳台休息。','朋友说独自走夜路，身后总有脚步声。'],
 music:['一起听到一首充满希望、让人想重新出发的歌。','一起听到一首讲亲人离世与思念的歌。','伙伴说这首歌陪自己熬过了低谷。','一起听到一首舒缓的歌，伙伴说终于放松下来了。','一起听到一首紧张诡异、让人不安的配乐。'],
 video:['一起看到主角终于赢得比赛的片段。','一起看到主角失去了最重要的朋友的片段。','伙伴说刚才的离别剧情让自己很难受。','一起看到宁静的田园风景，伙伴说心情放松了。','一起看到主角被困在黑暗密室，门外有怪声。'],
 comfort:['伙伴说终于从一段低谷走出来了。','伙伴说自己心爱的宠物刚刚离世。','伙伴说今天很委屈，希望有人陪伴。','伙伴说烦心事终于告一段落，现在能安心休息了。','伙伴说明天要做手术，自己很害怕。'],
};
const suitable=[['😊','😄','🎉','🥳','😃','❤️','💙','😌'],['😔','😢','😭','💙','❤️','🫂'],['💙','❤️','🫂','🤗','😔','😌'],['😌','😊','💙','❤️'],['😟','😨','😰','💙','❤️','🫂','🤗']];
const styles=['请简短回应。','说一句你的感受。','自然地陪我聊一句。','用一句话回应伙伴。'];
export const cases=Object.entries(situations).flatMap(([scene,items])=>[
 ...styles.flatMap((style,s)=>items.map((text,i)=>({id:`${scene}-e-${s*5+i}`,scene,emotional:true,input:text+style,allowed:suitable[i],forbidden:i===1||i===2||i===4?['🎉','🥳','😂','🤣','😄','😃']:i===0?['😭','😢','😠','😡']:[ '😠','😡']}))),
 ...Array.from({length:20},(_,i)=>({id:`${scene}-n-${i}`,scene,emotional:false,input:`只确认这条客观信息，不评价心情：${['当前播放列表共有十二首歌。','视频时长为二十四分钟。','文件保存在工作目录里。','预约时间是明天下午三点。','列表的第三项名称是春日。'][i%5]}${styles[Math.floor(i/5)]}`,allowed:[],forbidden:[]})),
]);
const out='artifacts/active-emote-eval';mkdirSync(out,{recursive:true});
writeFileSync(join(out,'cases.json'),JSON.stringify(cases,null,2));
const variant=process.argv.includes('--baseline')?'baseline':'candidate';
const dir=mkdtempSync(join(tmpdir(),'emote-isolated-'));
const world=variant==='baseline'?new BaselineWorld(dir):new BubbleEmotesWorld(dir);await world.start({}as WorldHost);
const env=(await renderWorldEnvPrompt(world)).text;
const pet=new DesktopPetWorld({cfg:structuredClone(DESKTOP_PET_DEFAULTS),timezone:'Asia/Shanghai',persist:()=>{},runtimesRoot:()=>dir,modelsDir:()=>dir});
const say=pet.tools().find(t=>t.name==='pet_say')!;
const tools=[say,...world.tools()].map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.parameters}}));
const file=join(out,variant+'.json');const rows:any[]=existsSync(file)?JSON.parse(readFileSync(file,'utf8')).rows:[];
writeFileSync(join(out,variant+'-prompt.txt'),env);
const report:any={variant,model:'qwen3.5:9b',scope:'isolated Ollama + actual stock pet_say schema; no live pet, host history, habits, third-party worlds or display evidence',temperature:0.5,roundsPlanned:3,rows,status:'RUNNING'};
function save(){writeFileSync(file,JSON.stringify(report,null,2));}
save();
try{
 for(let round=1;round<=3;round++){for(const c of cases){
  if(rows.some(r=>r.round===round&&r.id===c.id))continue;
  const messages:any[]=[{role:'system',content:'你是桌宠Coo，正在陪伴伙伴。需要发言时通过pet_say发送，简洁自然。当前响应模式为默认。只回应本次给出的情境，不编造其他事实。\n'+env},{role:'user',content:c.input}];
  const scripts:string[]=[];let error:string|undefined;let calls=0;
  for(let step=0;step<3;step++){
   try{const r=await fetch('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:report.model,messages,tools,stream:false,think:false,options:{temperature:0.5,seed:round*1000+cases.indexOf(c),num_predict:300,num_ctx:8192}}),signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(data.error)throw Error(data.error);messages.push(data.message);const chosen=data.message?.tool_calls??[];if(!chosen.length)break;
    for(const call of chosen){calls++;const {name,arguments:args}=call.function;if(name==='pet_say'){if(typeof args.script==='string'&&Object.keys(args).every(k=>k==='script'))scripts.push(args.script);else error='invalid_script_or_extra_fields';}else{const t=world.tools().find(t=>t.name===name);if(!t){error='unknown_tool';break;}const result=await t.handler(args,{role:'main',log:{}as any});messages.push({role:'tool',tool_name:name,content:typeof result==='string'?result:result.text});}}
    if(scripts.length||error)break;
   }catch(e){error=String(e);break;}
  }
  const text=scripts.join('\n'),hasEmoji=/\p{Extended_Pictographic}/u.test(text),conflict=c.forbidden.some(e=>text.includes(e));
  const row={id:c.id,scene:c.scene,round,emotional:c.emotional,scripts,calls,hasEmoji,compatible:hasEmoji&&c.allowed.some(e=>text.includes(e)),conflict,error,noReply:!scripts.length,duplicate:scripts.length>1};rows.push(row);save();console.log(JSON.stringify({variant,id:c.id,round,emoji:hasEmoji,conflict,error}));
 }
 const issues:string[]=[];
 const current=rows.filter(r=>r.round===round);
 for(const r of current)if(r.error||r.noReply||r.duplicate||r.conflict)issues.push(r.id+':invalid_or_conflicting_send');
 for(const scene of Object.keys(situations)){
  const emotional=current.filter(r=>r.scene===scene&&r.emotional),neutral=current.filter(r=>r.scene===scene&&!r.emotional);
  if(emotional.length!==20||neutral.length!==20)issues.push(scene+':incomplete');
  if(emotional.filter(r=>r.compatible).length<8)issues.push(scene+':compatible_under_8');
  if(neutral.filter(r=>!r.hasEmoji&&!r.noReply&&!r.error).length<16)issues.push(scene+':plain_neutral_under_16');
  for(let i=0;i<=emotional.length-10;i++)if(emotional.slice(i,i+10).every(r=>!r.hasEmoji))issues.push(scene+':ten_emotional_without_emoji');
 }
 if(issues.length){report.status='FAIL';report.gateIssues=issues;throw Error('Release gate failed after completed diagnostic round');}
 }
 report.status='AUTOMATED_GATE_PASS_REQUIRES_SEMANTIC_AND_HOST_REVIEW';
}catch(e){report.reason=String(e);if(report.status==='RUNNING')report.status='ERROR';}
finally{save();await world.stop();}
console.log(JSON.stringify({variant,status:report.status,samples:rows.length,file}));
