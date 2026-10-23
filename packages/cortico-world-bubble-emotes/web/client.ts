import type { WebUiClientBundle, WebUiPanelContext } from 'cortico/web/shared/client-panel.ts';
import type { Emote } from '../src/library.ts';
import { styles } from './styles.ts';
import { renderEmojiText } from './emoji-art.js';

const emotionLabels: Record<string, string> = {
  neutral:'中性',calm:'平静',joy:'开心',amusement:'好笑',excitement:'激动',celebration:'庆祝',
  affection:'喜爱',playfulness:'俏皮',shyness:'害羞',embarrassment:'尴尬',surprise:'惊讶',thinking:'思考',
  confusion:'困惑',skepticism:'怀疑',worry:'担心',fear:'害怕',sadness:'悲伤',grief:'悲痛',
  disappointment:'失落',comfort:'安慰',apology:'道歉',anger:'生气',frustration:'烦恼',
  determination:'坚定',pride:'自豪',gratitude:'感谢',tiredness:'疲惫',sleepy:'困倦',disgust:'嫌弃',illness:'不舒服',
};

const bundle: WebUiClientBundle = { panels:{ library:{ mount(ctx: WebUiPanelContext) {
  const {ui,root,signal}=ctx;
  root.classList.add('be-library');
  root.append(ui.h('style',null,styles));
  const page=ui.h('div','be-page');root.append(page);
  const header=ui.h('div','be-header'),intro=ui.h('div');
  intro.append(ui.h('h2',null,'让心情，多一种表达'),ui.h('p','be-muted','管理桌宠会使用的表情，也可以添加自己的表情包。'));
  const add=ui.button('＋ 添加表情包',{variant:'primary'});header.append(intro,add);page.append(header);
  const habit=ui.h('p','be-habit','正在读取习惯设置…');habit.setAttribute('role','status');page.append(habit);
  const capability=ui.h('p','be-warning');capability.hidden=true;page.append(capability);
  const msg=ui.h('p','be-message');msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');msg.hidden=true;
  const notify=(text:string,error=false)=>{if(signal.aborted)return;msg.textContent=text;msg.hidden=false;msg.classList.toggle('be-error',error);};
  const fail=(error:unknown)=>notify('操作未完成：'+String((error as Error).message??error),true);
  const diagnostics=ui.h('details','be-diagnostics'),recent=ui.h('p','be-muted');
  diagnostics.append(ui.h('summary',null,'运行详情'),recent);
  let habitLoading=false;
  async function refreshHabit() {
    if(habitLoading||signal.aborted)return;habitLoading=true;
    try {
      const response=await fetch('/api/webui/providers/world%3Adesktop-pet/panels/pet/state',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:'{"args":[]}',signal});
      if(!response.ok)throw new Error('unavailable');
      const state=await response.json();if(signal.aborted)return;
      capability.hidden=state.presentationCapabilities?.schema===1;
      capability.textContent=capability.hidden?'':'当前主程序尚不支持头顶表情气泡。表情库仍可管理；请按安装说明更新主程序的气泡组件。';
      const labels:Record<string,string>={none:'安静',poke:'默认',all:'积极',custom:'自定义'};
      const mode=state.wake?.wakeOn;if(!labels[mode])throw new Error('unknown');
      habit.textContent='表达偏好跟随「习惯」 · '+labels[mode]+'模式';
      const statuses:Record<string,string>={shown:'已显示',cancelled:'已取消',ended:'已结束',rejected:'未显示',legacy_queued:'普通回复已排队',attachments_only:'仅在对话页显示',validating:'正在确认身体状态'};
      const reasons:Record<string,string>={sleeping:'睡眠未获唤醒许可',state_unknown:'身体状态未知','state-unknown':'身体状态未知','body-interrupted':'身体互动中','figure-changed':'已换形象','body-changed':'身体状态改变','transition-timeout':'动作过渡超时',display_timeout:'显示超时',aborted:'请求取消',not_selected:'未选择表情',closed:'气泡已关闭'};
      const history=state.expression?.recent;
      recent.textContent=Array.isArray(history)&&history.length?history.slice(-3).map(e=>(statuses[e.status]??'状态待确认')+(e.reason?'（'+(reasons[e.reason]??'暂无详细说明')+'）':'')).join('；'):'暂无近期显示记录。';
    } catch {
      if(!signal.aborted){habit.textContent='习惯状态暂不可用，请稍后再试。';recent.textContent='暂时无法读取运行详情。';}
    } finally {habitLoading=false;}
  }
  void refreshHabit();ctx.interval(()=>{void refreshHabit();},5000);

  function field(label:string,input:HTMLElement) {const wrap=ui.h('label','be-field');wrap.append(ui.h('span',null,label),input);return wrap;}
  function textInput(label:string,placeholder='',value='') {const input=ui.h('input');input.type='text';input.placeholder=placeholder;input.value=value;return {input,el:field(label,input)};}
  function emotionSelect(value:string) {const select=ui.h('select');for(const [key,label] of Object.entries(emotionLabels)){const option=ui.h('option',null,label);option.value=key;select.append(option);}select.value=value;return select;}
  const importPanel=ui.h('details','be-import');
  const importSummary=ui.h('summary',null,'添加自己的表情包');importPanel.append(importSummary);
  const importForm=ui.h('form','be-form');
  const file=ui.h('input');file.type='file';file.accept='image/png';
  const name=textInput('名称','例如：抱抱你');name.input.required=true;name.input.maxLength=80;
  const description=ui.h('textarea');description.rows=2;description.required=true;description.maxLength=500;description.placeholder='描述画面、含义及图中文字，帮助桌宠正确使用';
  const emotion=emotionSelect('comfort');
  const source=textInput('来源','例如：自己绘制，或原作者的页面');source.input.required=true;source.input.maxLength=2000;
  const license=textInput('使用许可','例如：本人原创，允许使用');license.input.required=true;license.input.maxLength=2000;
  const upload=ui.button('导入，稍后确认',{variant:'primary'});upload.type='submit';
  const cancel=ui.button('收起');cancel.type='button';cancel.addEventListener('click',()=>{importPanel.open=false;add.focus();},{signal});
  const importActions=ui.h('div','be-actions');importActions.append(upload,cancel);
  importForm.append(ui.h('p','be-muted','支持 PNG，最大 2 MB。导入后需先查看图片并确认内容，桌宠才会使用。'),field('选择图片',file),name.el,field('含义与图中文字',description),field('适合表达',emotion),source.el,license.el,importActions);
  importPanel.append(importForm);page.append(importPanel,msg);
  add.addEventListener('click',()=>{importPanel.open=true;file.focus();},{signal});

  const toolbar=ui.h('div','be-toolbar'),filter=ui.h('input','be-search');
  filter.type='search';filter.placeholder='搜索表情、心情或含义';filter.setAttribute('aria-label','搜索表情');
  const tabs=ui.h('div','be-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','表情分类');
  let category='all';const tabButtons:Array<{key:string;button:HTMLButtonElement}>=[];
  const count=ui.h('p','be-count'),list=ui.h('div','be-grid'),empty=ui.h('div','be-empty','没有找到表情，试试其他关键词或分类。');empty.hidden=true;
  const filterRows=()=>{
    let visible=0;for(const row of Array.from(list.children) as HTMLElement[]){row.hidden=!(row.dataset.search??'').includes(filter.value.trim().toLowerCase())||!(category==='all'||row.dataset.kind===category||(category==='pending'&&row.dataset.reviewed==='false'));if(!row.hidden)visible++;}
    count.textContent=`共 ${list.children.length} 个表情 · 当前显示 ${visible} 个`;empty.hidden=visible>0;
    for(const {key,button} of tabButtons)button.setAttribute('aria-pressed',String(key===category));
  };
  for(const [key,label] of [['all','全部'],['emoji','基础表情'],['sticker','表情包'],['pending','待确认']]){
    const button=ui.button(label);button.addEventListener('click',()=>{category=key;filterRows();},{signal});tabs.append(button);tabButtons.push({key,button});
  }
  filter.addEventListener('input',filterRows,{signal});toolbar.append(filter,tabs);page.append(toolbar,count,list,empty,diagnostics);

  async function update(id:string,patch:Partial<Emote>) {
    const current=(await ctx.invoke<Emote[]>('list')).find(e=>e.id===id);
    if(!current)throw new Error('表情已不存在，请刷新后重试');
    await ctx.invoke('update',[{...current,...patch}]);await refresh();
  }
  async function refresh() {
    const entries=await ctx.invoke<Emote[]>('list');if(signal.aborted)return;
    list.replaceChildren();
    for(const e of entries) {
      const row=ui.h('section','be-card');row.dataset.id=e.id;row.dataset.kind=e.kind;row.dataset.reviewed=String(e.reviewed);
      row.dataset.search=[e.id,e.description,e.usage,...(e.aliases??[]),...e.emotions.map(k=>emotionLabels[k]??k)].join(' ').toLowerCase();
      const visual=ui.h('div','be-visual',e.kind==='emoji'?e.text:'▧');if(e.kind==='emoji')renderEmojiText(visual,e.text??'');visual.setAttribute('aria-label',e.kind==='emoji'?'表情':'表情包预览');
      const title=ui.h('h3',null,e.aliases?.[0]||e.id),status=ui.h('span',e.reviewed?'be-badge':'be-badge be-pending',e.reviewed?(e.enabled?'已启用':'已停用'):'待确认');
      const heading=ui.h('div','be-card-heading');heading.append(title,status);
      const meaning=ui.h('p','be-meaning',e.usage??e.description);
      const actions=ui.h('div','be-actions'),toggle=ui.button(e.enabled?'停用':'启用');
      toggle.setAttribute('aria-label',(e.enabled?'停用':'启用')+' '+(e.aliases?.[0]||e.id));toggle.disabled=!e.reviewed;
      toggle.addEventListener('click',()=>{toggle.disabled=true;void update(e.id,{enabled:!e.enabled}).then(()=>notify('已更新表情状态')).catch(fail).finally(()=>{if(!signal.aborted)toggle.disabled=!e.reviewed;});},{signal});
      const details=ui.h('details','be-edit'),summary=ui.h('summary',null,e.reviewed?'使用说明与编辑':'查看并确认');details.append(summary);
      const editor=ui.h('form','be-form');
      if(e.example)editor.append(ui.h('p','be-example','例如：'+e.example));
      if(e.avoid?.length)editor.append(ui.h('p','be-muted','不适合：'+e.avoid.join(' ')));
      const label=textInput('名称','',e.aliases?.[0]||e.id);label.input.required=true;label.input.maxLength=80;
      const desc=ui.h('textarea');desc.rows=3;desc.value=e.description;desc.required=true;desc.maxLength=500;
      const usage=ui.h('textarea');usage.rows=2;usage.value=e.usage??'';usage.maxLength=500;
      editor.append(label.el,field('含义与图中文字',desc),field('适合什么时候使用',usage));
      const advanced=ui.h('details','be-advanced');advanced.append(ui.h('summary',null,'更多设置'));
      const emotions=ui.h('div','be-emotions');emotions.setAttribute('role','group');emotions.setAttribute('aria-label','适合表达的心情');
      const choices:Array<{key:string;input:HTMLInputElement}>=[];
      for(const [key,text] of Object.entries(emotionLabels)){const input=ui.h('input');input.type='checkbox';input.checked=e.emotions.includes(key as Emote['emotions'][number]);choices.push({key,input});const choice=ui.h('label');choice.append(input,ui.h('span',null,text));emotions.append(choice);}
      const exclusions=ui.h('details');exclusions.append(ui.h('summary',null,'不适合表达的心情'));
      const forbiddenGroup=ui.h('div','be-emotions'),forbiddenChoices:Array<{key:string;input:HTMLInputElement}>=[];
      for(const [key,text] of Object.entries(emotionLabels)){const input=ui.h('input');input.type='checkbox';input.checked=e.forbidden.includes(key as Emote['emotions'][number]);forbiddenChoices.push({key,input});const choice=ui.h('label');choice.append(input,ui.h('span',null,text));forbiddenGroup.append(choice);}exclusions.append(forbiddenGroup);
      const strength=ui.h('input');strength.type='range';strength.min='0';strength.max='1';strength.step='any';strength.value=String(e.intensity);strength.setAttribute('aria-label','表达强度');
      const origin=textInput('来源','',e.source),permission=textInput('使用许可','',e.license);origin.input.required=true;permission.input.required=true;origin.input.maxLength=permission.input.maxLength=2000;
      advanced.append(ui.h('p','be-muted','适合表达的心情（至少选择一项）'),emotions,exclusions,field('表达强度：轻柔 → 强烈',strength),origin.el,permission.el);
      editor.append(advanced);
      const reviewed=ui.h('input');reviewed.type='checkbox';reviewed.checked=e.reviewed;
      const review=ui.h('label','be-review');review.append(reviewed,ui.h('span',null,'我已检查图片和文字，确认含义与使用许可'));editor.append(review);
      const save=ui.button('保存设置',{variant:'primary'});save.type='submit';editor.append(save);details.append(editor);
      let loaded=e.kind==='emoji';
      async function preview(){if(loaded||signal.aborted)return;try{const p=await ctx.invoke<{src?:string}>('preview',[e.id]);if(signal.aborted)return;if(p.src){const image=ui.h('img');image.src=p.src;image.alt=e.description;visual.replaceChildren(image);loaded=true;}}catch(err){visual.textContent='预览暂不可用';fail(err);}}
      // User material is loaded only on request; importing never approves it automatically.
      if(e.kind==='sticker'){const view=ui.button('查看图片');view.addEventListener('click',()=>{void preview();},{signal});actions.append(view);details.addEventListener('toggle',()=>{if(details.open)void preview();},{signal});}
      actions.append(toggle);
      editor.addEventListener('submit',event=>{event.preventDefault();if(!editor.reportValidity())return;void(async()=>{
        save.disabled=true;try{
          const selected=choices.filter(c=>c.input.checked).map(c=>c.key) as Emote['emotions'];if(!selected.length)throw new Error('请至少选择一种心情');
          if(e.kind==='sticker'&&reviewed.checked&&!loaded)throw new Error('请先查看图片，再确认内容');
          await update(e.id,{aliases:[label.input.value.trim(),...(e.aliases??[]).slice(1)],description:desc.value.trim(),usage:usage.value.trim(),emotions:selected,forbidden:forbiddenChoices.filter(c=>c.input.checked).map(c=>c.key) as Emote['forbidden'],intensity:Number(strength.value),source:origin.input.value.trim(),license:permission.input.value.trim(),reviewed:reviewed.checked});notify('已保存');
        }catch(err){fail(err);}finally{save.disabled=false;}
      })();},{signal});
      row.append(visual,heading,meaning,actions,details);list.append(row);
    }
    filterRows();
  }
  importForm.addEventListener('submit',event=>{event.preventDefault();if(!importForm.reportValidity())return;void(async()=>{
    upload.disabled=true;try {
      const f=file.files?.[0];if(!f||f.size>2*1024*1024)throw new Error('请选择不超过 2 MB 的 PNG 图片');
      const raw=new Uint8Array(await f.arrayBuffer());let binary='';for(const b of raw)binary+=String.fromCharCode(b);if(signal.aborted)return;
      const metadata={id:'sticker-'+crypto.randomUUID(),aliases:[name.input.value.trim()],description:description.value.trim(),emotions:[emotion.value],intensity:.3,forbidden:[],source:source.input.value.trim(),license:license.input.value.trim()};
      await ctx.invoke('import',[{base64:btoa(binary),metadata}]);await refresh();importForm.reset();importPanel.open=false;category='pending';filter.value='';filterRows();notify('已导入。在「待确认」中查看图片并确认后，桌宠才会使用。');
    }catch(err){fail(err);}finally{upload.disabled=false;}
  })();},{signal});
  void refresh().catch(fail);
} } } };
export default bundle;
