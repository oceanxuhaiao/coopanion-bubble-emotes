import type{WebUiPanelContext}from'cortico/web/shared/client-panel.ts';
export function mountDraftSettings(ctx:WebUiPanelContext,parent:HTMLElement){
 const{ui,signal}=ctx,box=ui.h('details','be-diagnostics');box.append(ui.h('summary',null,'草稿与身体设置'));
 const status=ui.h('p','be-muted'),message=ui.h('p','be-message'),toggle=ui.button('读取草稿检查设置'),body=ui.button('读取身体协调设置');message.setAttribute('role','status');box.append(status,toggle,body,message);parent.append(box);
 let enabled=false,bodyEnabled=false;
 const fail=(e:unknown)=>{message.textContent=String((e as Error).message??e);};
 async function refresh(){const s=await ctx.invoke<any>('state');if(signal.aborted)return;enabled=s.settings.enabled;bodyEnabled=s.bodyCoordination.enabled;status.textContent=s.storageError||(s.draftMode.enabled?'草稿检查已开启':'草稿检查已暂停');toggle.textContent=enabled?'暂停草稿检查':'开启草稿检查';body.textContent=bodyEnabled?'关闭身体协调':'开启身体协调';}
 toggle.addEventListener('click',()=>{toggle.disabled=true;void ctx.invoke('configure',[{enabled:!enabled}]).then(()=>refresh()).catch(fail).finally(()=>toggle.disabled=false);},{signal});
 body.addEventListener('click',()=>{body.disabled=true;void ctx.invoke('bodyCoordination',[!bodyEnabled]).then(()=>refresh()).catch(fail).finally(()=>body.disabled=false);},{signal});
 void refresh().catch(fail);ctx.interval(()=>{void refresh().catch(fail);},5000);
}
