import type { WebUiClientBundle, WebUiPanelContext } from 'cortico/web/shared/client-panel.ts';
import type { Emote } from '../src/library.ts';
import { styles } from './styles.ts';
const bundle: WebUiClientBundle = {panels:{library:{mount(ctx:WebUiPanelContext){
 const {ui,root,signal}=ctx;root.classList.add('be-library');root.append(ui.h('style',null,styles));const page=ui.h('div','be-page');root.append(page);
 const header=ui.h('div','be-header'),intro=ui.h('div');intro.append(ui.h('h2',null,'给心情加一个表情'),ui.h('p','be-muted','直接用于原版桌宠气泡，无需修改主程序。'));header.append(intro);page.append(header);
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
  const row=ui.h('section','be-card');row.dataset.id=e.id;row.dataset.search=[e.id,e.description,e.usage,...(e.aliases??[]),...e.emotions].join(' ').toLowerCase();
  const visual=ui.h('div','be-visual',e.text),heading=ui.h('div','be-card-heading'),title=ui.h('h3',null,e.aliases?.[0]||e.id),badge=ui.h('span','be-badge',!e.reviewed?'未确认':e.enabled?'已启用':'已停用');heading.append(title,badge);
  const meaning=ui.h('p','be-meaning',e.usage??e.description),actions=ui.h('div','be-actions'),toggle=ui.button(e.enabled?'停用':'启用');toggle.disabled=!e.reviewed;toggle.setAttribute('aria-label',(e.enabled?'停用':'启用')+' '+(e.aliases?.[0]||e.id));
  toggle.addEventListener('click',()=>{toggle.disabled=true;void update(e.id,{enabled:!e.enabled}).then(()=>notify('已更新')).catch(fail).finally(()=>{if(!signal.aborted)toggle.disabled=!e.reviewed;});},{signal});actions.append(toggle);
  const details=ui.h('details','be-edit');details.append(ui.h('summary',null,'使用说明与编辑'));const form=ui.h('form','be-form');if(e.example)form.append(ui.h('p','be-example','例如：'+e.example));if(e.avoid?.length)form.append(ui.h('p','be-muted','不适合：'+e.avoid.join(' ')));
  const name=ui.h('input');name.value=e.aliases?.[0]||e.id;name.required=true;name.maxLength=80;const usage=ui.h('textarea');usage.rows=3;usage.value=e.usage??e.description;usage.required=true;usage.maxLength=500;
  const reviewed=ui.h('input');reviewed.type='checkbox';reviewed.checked=e.reviewed;const review=ui.h('label','be-review');review.append(reviewed,ui.h('span',null,'已确认含义与使用场景'));
  const save=ui.button('保存设置',{variant:'primary'});save.type='submit';form.append(field('名称',name),field('适合什么时候使用',usage),review,save);details.append(form);
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;save.disabled=true;void update(e.id,{aliases:[name.value.trim(),...(e.aliases??[]).slice(1)],usage:usage.value.trim(),reviewed:reviewed.checked}).then(()=>notify('已保存')).catch(fail).finally(()=>{save.disabled=false;});},{signal});
  row.append(visual,heading,meaning,actions,details);list.append(row);
 }filterRows();}
 void refresh().catch(fail);
}}}};
export default bundle;
