import{EMOTIONS}from'../src/catalog.ts';
import type{Emotion}from'../src/library.ts';
import{EMOTION_LABELS}from'./emotion-labels.ts';
import{BODY_EXPRESSIONS,BODY_MATCH_LABELS,type BodyExpression}from'../src/body-mapping.ts';
import {mountDraftSettings} from './draft-settings.ts';
import type { WebUiClientBundle, WebUiPanelContext } from 'cortico/web/shared/client-panel.ts';
import type { Emote } from '../src/library.ts';
import { styles } from './styles.ts';
const bundle: WebUiClientBundle = {panels:{library:{mount(ctx:WebUiPanelContext){
 const {ui,root,signal}=ctx;root.classList.add('be-library');root.append(ui.h('style',null,styles));const page=ui.h('div','be-page');root.append(page);
 const header=ui.h('div','be-header'),intro=ui.h('div');intro.append(ui.h('h2',null,'给心情加一个表情'),ui.h('p','be-muted','直接用于原版桌宠气泡。身体映射面向内置19种表情，仅供参考，不自动执行动作。'));header.append(intro);page.append(header);
 mountDraftSettings(ctx,page);
 const habit=ui.h('p','be-habit','回应方式由主程序「习惯」管理。');page.append(habit);
 let loading=false;async function refreshHabit(){if(loading||signal.aborted)return;loading=true;try{const r=await fetch('/api/webui/providers/world%3Adesktop-pet/panels/pet/state',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:'{"args":[]}',signal});if(!r.ok)throw Error();const s=await r.json();if(signal.aborted)return;const labels:Record<string,string>={none:'安静',poke:'默认',all:'积极',custom:'自定义'};habit.textContent=labels[s.wake?.wakeOn]?'当前习惯 · '+labels[s.wake.wakeOn]+'模式':'回应方式由主程序「习惯」管理。';}catch{if(!signal.aborted)habit.textContent='习惯状态暂不可用；可继续管理表情。';}finally{loading=false;}}
 void refreshHabit();ctx.interval(()=>{void refreshHabit();},5000);
 const notice=ui.h('details','be-diagnostics');notice.append(ui.h('summary',null,'功能范围'),ui.h('p','be-muted','仅支持普通emoji字符，不支持图片和表情包。显示依赖系统字体，动作仅为建议；不确认身体同步，也不保证第三方语音会跳过emoji。旧图片素材保留，但不在新版中使用。'));page.append(notice);
 const filter=ui.h('input','be-search');filter.type='search';filter.placeholder='搜索表情、心情或含义';filter.setAttribute('aria-label','搜索表情');
 const count=ui.h('p','be-count'),message=ui.h('p','be-message');message.hidden=true;message.setAttribute('role','status');message.setAttribute('aria-live','polite');const list=ui.h('div','be-grid'),empty=ui.h('p','be-empty','没有找到表情，试试其他关键词。');empty.hidden=true;page.append(filter,count,message,list,empty);
 function notify(text:string,error=false){if(signal.aborted)return;message.textContent=text;message.hidden=false;message.classList.toggle('be-error',error);}
 function fail(error:unknown){notify('操作未完成：'+String((error as Error).message??error),true);}
 function filterRows(){let visible=0;for(const row of Array.from(list.children) as HTMLElement[]){row.hidden=!(row.dataset.search??'').includes(filter.value.trim().toLowerCase());if(!row.hidden)visible++;}count.textContent=`共 ${list.children.length} 个表情 · 当前显示 ${visible} 个`;empty.hidden=visible>0;}
 filter.addEventListener('input',filterRows,{signal});
 function field(label:string,input:HTMLElement){const wrap=ui.h('label','be-field');wrap.append(ui.h('span',null,label),input);return wrap;}
 async function update(id:string,patch:Partial<Emote>){const entries=await ctx.invoke<Emote[]>('list');const current=entries.find(e=>e.id===id);if(!current)throw Error('表情不存在，请刷新后重试');await ctx.invoke('update',[{...current,...patch}]);await refresh();}
 async function refresh(){const entries=await ctx.invoke<Emote[]>('list');if(signal.aborted)return;list.replaceChildren();for(const e of entries.filter(e=>e.kind==='emoji')){
  const row=ui.h('section','be-card');row.dataset.id=e.id;row.dataset.search=[e.id,e.description,e.usage,...(e.aliases??[]),...e.emotions,...e.emotions.map(x=>EMOTION_LABELS[x]),e.bodyMatch?BODY_MATCH_LABELS[e.bodyMatch]:'',BODY_EXPRESSIONS[e.bodyExpression as BodyExpression]??''].join(' ').toLowerCase();
  const visual=ui.h('div','be-visual',e.text),heading=ui.h('div','be-card-heading'),title=ui.h('h3',null,e.aliases?.[0]||e.id),badge=ui.h('span','be-badge',!e.reviewed?'未确认':e.enabled?'已启用':'已停用');heading.append(title,badge);
  const meaning=ui.h('p','be-meaning',e.usage??e.description),actions=ui.h('div','be-actions'),toggle=ui.button(e.enabled?'停用':'启用');toggle.disabled=!e.reviewed;toggle.setAttribute('aria-label',(e.enabled?'停用':'启用')+' '+(e.aliases?.[0]||e.id));
  toggle.addEventListener('click',()=>{toggle.disabled=true;void update(e.id,{enabled:!e.enabled}).then(()=>notify('已更新')).catch(fail).finally(()=>{if(!signal.aborted)toggle.disabled=!e.reviewed;});},{signal});actions.append(toggle);
  const mapping=ui.h('p','be-muted',(e.bodyMatch?BODY_MATCH_LABELS[e.bodyMatch]:'未分类')+' · '+(e.bodyExpression?(BODY_EXPRESSIONS[e.bodyExpression as BodyExpression]??'非内置表情'):'不指定身体表情'));mapping.dataset.bodyMatch=e.bodyMatch??'unknown';mapping.title=e.bodyMatchReason??'旧自定义映射尚未分类';
  const details=ui.h('details','be-edit');details.append(ui.h('summary',null,'使用说明与编辑'));const form=ui.h('form','be-form');if(e.bodyMatchReason)form.append(ui.h('p','be-muted','映射说明：'+e.bodyMatchReason));if(e.example)form.append(ui.h('p','be-example','例如：'+e.example));if(e.avoid?.length)form.append(ui.h('p','be-muted','不适合：'+e.avoid.join(' ')));
  const name=ui.h('input');name.value=e.aliases?.[0]||e.id;name.required=true;name.maxLength=80;const usage=ui.h('textarea');usage.rows=3;usage.value=e.usage??e.description;usage.required=true;usage.maxLength=500;
  const reviewed=ui.h('input');reviewed.type='checkbox';reviewed.checked=e.reviewed;const review=ui.h('label','be-review');review.append(reviewed,ui.h('span',null,'已确认含义与使用场景'));
  const save=ui.button('保存设置',{variant:'primary'});save.type='submit';form.append(field('名称',name),field('适合什么时候使用',usage),review,save);details.append(form);
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;save.disabled=true;void update(e.id,{aliases:[name.value.trim(),...(e.aliases??[]).slice(1)],usage:usage.value.trim(),reviewed:reviewed.checked}).then(()=>notify('已保存')).catch(fail).finally(()=>{save.disabled=false;});},{signal});
  const chain=ui.h('p','be-mapping-chain',e.emotions.map(x=>EMOTION_LABELS[x]??x).join('、')+' → '+e.text+' → '+(e.bodyExpression?BODY_EXPRESSIONS[e.bodyExpression as BodyExpression]:'不指定身体心情'));
  const mappingEdit=ui.h('details','be-edit');mappingEdit.append(ui.h('summary',null,'编辑映射'));const mappingForm=ui.h('form','be-form');
  function emotionChecks(title:string,values:Emotion[]){const group=ui.h('fieldset','be-emotion-group'),legend=ui.h('legend',null,title);group.append(legend);const checks=new Map<Emotion,HTMLInputElement>();for(const emotion of EMOTIONS){const label=ui.h('label','be-emotion-option'),input=ui.h('input');input.type='checkbox';input.checked=values.includes(emotion);input.value=emotion;label.append(input,ui.h('span',null,EMOTION_LABELS[emotion]??emotion));group.append(label);checks.set(emotion,input);}return{group,values:()=>[...checks].filter(([,input])=>input.checked).map(([emotion])=>emotion)};}
  const allowed=emotionChecks('适用情绪（至少选一项）',e.emotions),forbidden=emotionChecks('禁用情绪（优先于适用情绪）',e.forbidden);
  const target=ui.h('select');target.setAttribute('aria-label','身体心情');for(const [value,label]of [['','不指定身体心情'],...Object.entries(BODY_EXPRESSIONS)]){const option=ui.h('option',null,label);option.value=value;target.append(option);}target.value=e.bodyExpression??'';
  const match=ui.h('select');match.setAttribute('aria-label','对应程度');for(const [value,label]of Object.entries(BODY_MATCH_LABELS)){const option=ui.h('option',null,label);option.value=value;match.append(option);}match.value=e.bodyMatch??(target.value?'approximate':'none');
  const reason=ui.h('textarea');reason.rows=2;reason.maxLength=500;reason.required=true;reason.value=e.bodyMatchReason??'用户自定义映射，请结合语境使用。';
  const sync=()=>{if(!target.value){match.value='none';match.disabled=true;}else{match.disabled=false;if(match.value==='none')match.value='approximate';}};target.addEventListener('change',sync,{signal});sync();
  const mappingSave=ui.button('保存映射',{variant:'primary'});mappingSave.type='submit';mappingForm.append(allowed.group,forbidden.group,field('身体心情',target),field('对应程度',match),field('映射说明',reason),ui.h('p','be-muted','自定义身体映射用于建议，不保证自动播放；禁用情绪优先。'),mappingSave);
  mappingForm.addEventListener('submit',event=>{event.preventDefault();const emotions=allowed.values(),blocked=forbidden.values();if(!emotions.length){notify('请至少选择一种适用情绪',true);return;}if(emotions.some(x=>blocked.includes(x))){notify('同一情绪不能同时设为适用和禁用',true);return;}if(target.value&&match.value==='none'){notify('请选择直接或近似对应，或取消身体心情',true);return;}if(!mappingForm.reportValidity())return;mappingSave.disabled=true;void update(e.id,{emotions,forbidden:blocked,bodyExpression:target.value||undefined,bodyMatch:target.value?match.value as Emote['bodyMatch']:'none',bodyMatchReason:reason.value.trim()}).then(()=>notify('映射已保存，后续搜索和草稿检查将使用新映射')).catch(fail).finally(()=>{mappingSave.disabled=false;});},{signal});mappingEdit.append(mappingForm);
  row.append(visual,heading,meaning,chain,mapping,actions,mappingEdit,details);list.append(row);
 }filterRows();}
 void refresh().catch(fail);
}}}};
export default bundle;
