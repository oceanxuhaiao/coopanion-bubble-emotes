import{mountDraftStatus}from'./draft-status.ts';
import{populateProviders,mountCloudModels}from'./cloud-controls.ts';
import type {WebUiPanelContext} from 'cortico/web/shared/client-panel.ts';
import {styles} from './styles.ts';
export const guidePanel={mount(ctx:WebUiPanelContext){
 const{ui,root,signal}=ctx;root.classList.add('be-library');root.append(ui.h('style',null,styles));const page=ui.h('div','be-page');root.append(page);
 page.append(ui.h('h2',null,'让表情陪你开始'),ui.h('p','be-muted','推荐配置分析 API 并开启表达记录与分析，自动启用草稿检查。直接使用表情库也可以，但缺少分析与检查，不能保证表情使用的稳定性；配置后仍不保证每次采纳建议。'));
 const status=ui.h('p','be-habit','正在读取状态…'),message=ui.h('p','be-message');message.setAttribute('role','status');message.hidden=true;page.append(status,message);
 const choices=ui.h('section','be-card'),basic=ui.button('直接使用表情库'),analysis=ui.button('设置分析与反馈',{variant:'primary'});choices.append(ui.h('h3',null,'选择适合你的方式'),ui.h('p','be-muted','直接使用：无需额外API或模型。可在「表情库」搜索、启停表情。'),basic,ui.h('p','be-muted','推荐：配置 API 后，检查发送前草稿并分析新的发言，帮助减少漏用。'),analysis);page.append(choices);

 mountDraftStatus(ctx,page);
 const setup=ui.h('section','be-card');setup.hidden=true;page.append(setup);setup.append(ui.h('h3',null,'1 · 选择分析方式'));
 const backend=ui.h('select'),provider=ui.h('select'),model=ui.h('input'),key=ui.h('input'),detect=ui.button('检测本机模型');
 for(const[v,n]of[['cloud','云端API'],['ollama','本机Ollama']]){const o=ui.h('option',null,n);o.value=v;backend.append(o);}populateProviders(ui,provider);
 backend.setAttribute('aria-label','分析方式');provider.setAttribute('aria-label','云端服务');model.setAttribute('aria-label','分析模型');model.placeholder='模型名称';key.type='password';key.autocomplete='off';key.placeholder='API Key，已保存时可留空';key.setAttribute('aria-label','API Key');
 const field=(label:string,node:HTMLElement)=>{const el=ui.h('label','be-field');el.append(ui.h('span',null,label),node);return el;};const providerField=field('云端服务',provider),keyField=field('API Key',key);
 setup.append(field('分析方式',backend),providerField,field('模型名称',model),keyField,detect,ui.h('p','be-muted','云端需独立API Key和API额度，不自动复用聊天连接，ChatGPT订阅不代替API额度。本机Ollama需先运行服务并安装模型，不会自动下载。'));
 const cloudChoices=ui.h('div');setup.append(cloudChoices);const cloudPicker=mountCloudModels(ui,cloudChoices,provider,model,signal,'guide');
 const localStatus=ui.h('p','be-muted'),localModels=ui.h('select');localModels.setAttribute('aria-label','检测到的本机模型');localModels.hidden=true;setup.append(localStatus,localModels);
 localModels.addEventListener('change',()=>{model.value=localModels.value;edited();},{signal});
 const save=ui.button('保存设置（暂停分析）'),test=ui.button('测试已保存的连接');setup.append(ui.h('h3',null,'2 · 保存并测试'),save,test,ui.h('p','be-muted','测试只发送固定测试文本，不读取聊天；云端测试也可能产生API用量。'));
 const consent=ui.h('input');consent.type='checkbox';const consentLabel=ui.h('label','be-consent');consentLabel.append(consent,ui.h('span',null,'我了解：开启后仅收集新的桌宠发言，最多100条本地明文记录；原话、发送前草稿、当前语境与表情库摘要交给所选模型，云端可能收费并增加等待。开启分析即同时启用草稿检查。无需导入或开启宿主历史聊天记录。'));
 const start=ui.button('开启分析与反馈',{variant:'primary'}),pause=ui.button('暂停分析');start.disabled=true;setup.append(ui.h('h3',null,'3 · 确认后开启'),consentLabel,start,pause,ui.h('p','be-muted','可随时在「表达记录」暂停、清空或跳过。分析是事后评价，不是桌宠的内部思考；主模型可能不采纳建议。'));
 let tested=false,dirty=false;
 function notify(text:string,bad=false){if(signal.aborted)return;message.hidden=false;message.textContent=text;message.classList.toggle('be-error',bad);}
 function fail(e:unknown){notify(String((e as Error).message??e),true);}
 function gate(){start.disabled=!tested||dirty||!consent.checked;test.disabled=dirty;}
 function visible(){providerField.hidden=keyField.hidden=backend.value!=='cloud';detect.hidden=backend.value!=='ollama';cloudChoices.hidden=backend.value!=='cloud';localStatus.hidden=backend.value!=='ollama';localModels.hidden=backend.value!=='ollama'||!localModels.options.length;}
 function edited(){dirty=true;tested=false;gate();visible();}
 for(const node of[backend,provider,model,key])node.addEventListener('input',edited,{signal});
 backend.addEventListener('change',()=>{model.value=backend.value==='cloud'&&provider.value==='deepseek'?'deepseek-flash':'';edited();},{signal});provider.addEventListener('change',()=>{key.value='';edited();},{signal});consent.addEventListener('change',gate,{signal});
 async function refresh(initial=false){const data=await ctx.invoke<any>('state');if(signal.aborted)return;status.textContent=data.storageError||data.cloud.error?'配置异常 · '+(data.storageError||data.cloud.error):data.settings.enabled?'分析与草稿检查正在运行 · '+(data.settings.backend==='cloud'?'云端API':'本机Ollama'):'分析与反馈未开启 · 表情库可直接使用';if(initial){backend.value=data.settings.backend;provider.value=data.cloud.provider;model.value=data.settings.backend==='cloud'?data.cloud.model:data.settings.model;setup.hidden=data.guideChoice!=='analysis'&&!data.settings.enabled;cloudPicker.refresh();visible();}pause.disabled=!data.settings.enabled;}
 basic.addEventListener('click',()=>{void ctx.invoke('guide',['basic']).then(()=>{setup.hidden=true;notify('已选择基础使用，分析已暂停。点击上方「表情库」管理表情。');return refresh();}).catch(fail);},{signal});
 analysis.addEventListener('click',()=>{void ctx.invoke('guide',['analysis']).then(()=>{setup.hidden=false;return refresh();}).catch(fail);},{signal});
 save.addEventListener('click',()=>{save.disabled=true;tested=false;void(async()=>{if(backend.value==='cloud')await ctx.invoke('cloud',[{provider:provider.value,model:model.value,apiKey:key.value}]);await ctx.invoke('configure',[{enabled:false,backend:backend.value,model:backend.value==='ollama'?model.value:''}]);key.value='';dirty=false;gate();notify('设置已保存，分析保持暂停。下一步测试连接。');await refresh();})().catch(fail).finally(()=>save.disabled=false);},{signal});
 test.addEventListener('click',()=>{test.disabled=true;void ctx.invoke<any>('test').then(r=>{tested=r.ok;notify(r.message,!r.ok);gate();}).catch(fail).finally(()=>{test.disabled=dirty;});},{signal});
 detect.addEventListener('click',()=>{detect.disabled=true;detect.textContent='正在检测…';localStatus.textContent='正在连接本机 Ollama，请稍候…';void ctx.invoke<any>('models').then(r=>{if(signal.aborted)return;localModels.replaceChildren();for(const name of r.models??[]){const o=ui.h('option',null,name);o.value=name;localModels.append(o);}localStatus.textContent=r.error||((r.models??[]).length?'检测到 '+r.models.length+' 个模型，请选择后保存。':'Ollama 已连接，但没有已安装的模型；请先在 Ollama 安装模型后重新检测。');if(r.models?.length){model.value=r.models.includes(model.value)?model.value:r.models[0];localModels.value=model.value;edited();}visible();}).catch(e=>{localStatus.textContent='检测失败，请确认 Ollama 正在运行。';fail(e);}).finally(()=>{detect.disabled=false;detect.textContent='检测本机模型';});},{signal});
 start.addEventListener('click',()=>{start.disabled=true;void ctx.invoke('enableGuided',[consent.checked]).then(()=>{tested=false;notify('已开启表达分析与草稿检查，等待桌宠下一句新发言。结果请到「表达记录」查看。');return refresh();}).catch(fail).finally(gate);},{signal});
 pause.addEventListener('click',()=>{void ctx.invoke<any>('state').then(s=>ctx.invoke('configure',[{...s.settings,enabled:false}])).then(()=>refresh()).catch(fail);},{signal});
 visible();void refresh(true).catch(fail);ctx.interval(()=>{void refresh().catch(fail);},5000);
}};
