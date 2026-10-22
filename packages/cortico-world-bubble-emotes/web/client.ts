import type { WebUiClientBundle, WebUiPanelContext } from 'cortico/web/shared/client-panel.ts';
import type { Emote } from '../src/library.ts';

const bundle: WebUiClientBundle = { panels:{ library:{ mount(ctx: WebUiPanelContext) {
  const {ui,root,signal}=ctx;
  const card=ui.sheet({title:'表情库 / Emote library'}); root.append(card.el);
  const msg=ui.h('p'), list=ui.h('div'), form=ui.h('div');
  const filter=ui.h('input');filter.type='search';filter.placeholder='搜索名称、含义 / Search meaning';filter.setAttribute('aria-label','搜索表情 / Search emotes');
  const filterRows=()=>{for(const row of Array.from(list.children) as HTMLElement[]) row.hidden=!(row.dataset.search??'').includes(filter.value.trim().toLowerCase());};
  filter.addEventListener('input',filterRows,{signal});
  const file=ui.h('input'); file.type='file'; file.accept='image/png'; file.setAttribute('aria-label','PNG 文件 / PNG file');
  const metadata=ui.h('textarea'); metadata.rows=10; metadata.setAttribute('aria-label','素材标签 / Emote metadata');
  metadata.value=JSON.stringify({id:'my-sticker',description:'Describe the full image and written words',emotions:['comfort'],intensity:.2,forbidden:['anger'],source:'Your source',license:'Your permission or license'},null,2);
  const upload=ui.button('导入 PNG（待审核） / Import PNG (unreviewed)');
  const note=ui.h('p',null,'检查图片与图中文字后再审核。需要支持 presentation schema 1 的宿主。 / Review the image and its words before approving. Requires a presentation schema 1 host.');
  form.append(note,file,metadata,upload); card.body.append(form,msg,filter,list);
  const fail=(err:unknown)=>{if(!signal.aborted)msg.textContent=String((err as Error).message??err);};
  async function refresh() {
    const entries=await ctx.invoke<Emote[]>('list'); if(signal.aborted)return;
    list.replaceChildren();
    for(const e of entries) {
      const row=ui.h('section'), title=ui.h('h3',null,`${e.text??''} ${e.aliases?.join(' / ')||e.id}`), preview=ui.h('div');
      row.dataset.search=[e.id,e.description,e.usage,...(e.aliases??[]),...e.emotions].join(' ').toLowerCase();
      const meaning=ui.h('p',null,e.usage??e.description);
      const avoid=ui.h('p',null,e.avoid?.length?`避免 / Avoid: ${e.avoid.join(' ')}`:'');
      const example=ui.h('p',null,e.example?`例句 / Example: ${e.example}`:'');
      const editor=ui.h('textarea'); editor.rows=9; editor.value=JSON.stringify(e,null,2); editor.setAttribute('aria-label',e.id);
      const view=ui.button('预览 / Preview'), save=ui.button('保存标签与审核状态 / Save labels and review status');
      view.addEventListener('click',()=>{void ctx.invoke<{text?:string;src?:string}>('preview',[e.id]).then(p=>{
        if(signal.aborted)return;preview.replaceChildren();
        if(p.src){const image=ui.h('img');image.src=p.src;image.alt=e.description;image.style.maxWidth='160px';preview.append(image);}
        else preview.textContent=p.text??'';
      }).catch(fail);},{signal});
      save.addEventListener('click',()=>{void(async()=>{
        save.disabled=true;
        try {await ctx.invoke('update',[JSON.parse(editor.value)]);await refresh();}catch(err){fail(err);}finally{save.disabled=false;}
      })();},{signal});
      row.append(title,meaning,avoid,example,view,preview,editor,save);list.append(row);
    }
    filterRows();
  }
  upload.addEventListener('click',()=>{void(async()=>{
    upload.disabled=true;
    try {
      const f=file.files?.[0]; if(!f||f.size>2*1024*1024)throw new Error('请选择不超过 2 MiB 的 PNG / Select a PNG up to 2 MiB');
      const raw=new Uint8Array(await f.arrayBuffer());
      let binary='';for(const b of raw)binary+=String.fromCharCode(b);
      if(signal.aborted)return;
      await ctx.invoke('import',[{base64:btoa(binary),metadata:JSON.parse(metadata.value)}]);
      await refresh();msg.textContent='已导入，待审核 / Imported, awaiting review';
    }catch(err){fail(err);}finally{upload.disabled=false;}
  })();},{signal});
  void refresh().catch(fail);
} } } };
export default bundle;
