import {it,expect,afterEach,vi} from 'vitest';import {mkdtempSync,rmSync} from 'node:fs';import {join} from 'node:path';import {tmpdir} from 'node:os';import {createRequire} from 'node:module';
import bundle from '../packages/cortico-world-bubble-emotes/web/client.ts';import {BubbleEmotesWorld} from '../packages/cortico-world-bubble-emotes/src/world.ts';import {h} from '../upstream/Coopanion-0.2.8/vendor/cortico/src/web/client/ui/dom.ts';import {sheet,button} from '../upstream/Coopanion-0.2.8/vendor/cortico/src/web/client/ui/sheet.ts';
const require=createRequire(new URL('../upstream/Coopanion-0.2.8/package.json',import.meta.url));const {JSDOM}=require('jsdom');const dirs:string[]=[];afterEach(()=>{vi.unstubAllGlobals();for(const p of dirs.splice(0))rmSync(p,{recursive:true,force:true})});
async function setup(state:any){const dir=mkdtempSync(join(tmpdir(),'habit-panel-'));dirs.push(dir);const world=new BubbleEmotesWorld(dir);await world.start({} as any);const dom=new JSDOM('<main></main>');const doc=dom.window.document,root=doc.querySelector('main'),control=new dom.window.AbortController();const timers:Array<()=>void>=[];const fetch=vi.fn(async()=>({ok:true,json:async()=>state}));vi.stubGlobal('fetch',fetch);const ctx:any={root,signal:control.signal,ui:{h:(tag:any,cls:any,text:any)=>h(doc,tag,cls,text),sheet:(opts:any)=>sheet(doc,opts),button:(label:any,opts:any)=>button(doc,control.signal,label,opts)},invoke:(method:string,args:any[]=[])=>world.webUi().invoke!('library',method,args),interval:(fn:()=>void)=>{timers.push(fn);return{dispose(){}}}};return{world,root,ctx,control,timers,state,fetch,dom}}
it.each([['none','安静'],['poke','默认'],['all','积极'],['custom','自定义']])('read-only Habits shows %s and no independent mode selector',async(wakeOn,label)=>{const s=await setup({wake:{wakeOn,wakeKinds:['pet']}});bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelector('[role=status]').textContent).toContain(label);expect(s.root.querySelector('.be-habit select')).toBeNull();expect(s.fetch.mock.calls[0][0]).toBe('/api/webui/providers/world%3Adesktop-pet/panels/pet/state');s.control.abort();await s.world.stop()});
it('refreshes changed Habits, reports cancelled vs plain and does not expose ids or text',async()=>{const state={wake:{wakeOn:'poke',wakeKinds:[]},expression:{recent:[] as any[]}};const s=await setup(state);bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.textContent).toContain('默认');state.wake.wakeOn='all';state.expression.recent=[{requestId:'private-id',text:'private conversation',status:'cancelled',reason:'sleeping'},{status:'legacy_queued',reason:'not_selected'}];s.timers[0]();await expect.poll(()=>s.root.textContent).toContain('积极');expect(s.root.textContent).toContain('睡眠未获唤醒许可');expect(s.root.textContent).toContain('未选择表情');expect(s.root.textContent).not.toMatch(/private-id|private conversation/);s.control.abort();await s.world.stop()});
it('failed Habits query is visible without blocking the library',async()=>{const s=await setup({});s.fetch.mockRejectedValue(new Error('offline'));bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.textContent).toContain('习惯状态暂不可用');await expect.poll(()=>s.root.querySelectorAll('section').length).toBe(37);s.control.abort();await s.world.stop()});
it('late Habits response is ignored after unmount',async()=>{const s=await setup({wake:{wakeOn:'all'}});let resolve:any;s.fetch.mockImplementation(()=>new Promise(r=>{resolve=r}));bundle.panels.library.mount(s.ctx);s.control.abort();resolve({ok:true,json:async()=>s.state});await new Promise(r=>setTimeout(r,10));expect(s.root.textContent).not.toContain('积极');await s.world.stop()});
it('old host missing capabilities gives an explicit compatibility warning',async()=>{const s=await setup({wake:{wakeOn:'poke',wakeKinds:[]}});bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.textContent).toContain('当前主程序尚不支持头顶表情气泡');s.state.presentationCapabilities={schema:1};s.timers[0]();await expect.poll(()=>s.root.textContent).not.toContain('当前主程序尚不支持头顶表情气泡');s.control.abort();await s.world.stop()});


it('simple cards hide all editing and diagnostic controls by default, without JSON editors',async()=>{
 const s=await setup({wake:{wakeOn:'poke'},presentationCapabilities:{schema:1}});bundle.panels.library.mount(s.ctx);
 await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 expect(s.root.querySelectorAll('details[open]')).toHaveLength(0);
 expect(s.root.querySelector('[data-id=comfort] .be-visual img').src).toMatch(/^data:image\/svg\+xml/);
 expect(s.root.querySelectorAll('textarea').length).toBeGreaterThan(0);
 for(const t of s.root.querySelectorAll('textarea'))expect(t.value).not.toMatch(/^\s*\{/);
 expect(s.root.querySelector('.be-toolbar').textContent).not.toContain('schema');
 s.control.abort();await s.world.stop();
});
it('filters by Chinese mood and shows an empty state',async()=>{
 const s=await setup({wake:{wakeOn:'poke'}});bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 const filter=s.root.querySelector('.be-search');filter.value='平静';filter.dispatchEvent(new s.dom.window.Event('input'));
 expect([...s.root.querySelectorAll('.be-card')].filter((r:any)=>!r.hidden).length).toBeGreaterThan(0);
 filter.value='不存在的表情xyz';filter.dispatchEvent(new s.dom.window.Event('input'));expect(s.root.querySelector('.be-empty').hidden).toBe(false);
 s.control.abort();await s.world.stop();
});
it('one-click disable preserves semantic metadata',async()=>{
 const s=await setup({wake:{wakeOn:'poke'}});const before:any=(await s.ctx.invoke('list')).find((e:any)=>e.id==='calm');
 bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 s.root.querySelector('[data-id=calm] .be-actions button').click();
 await expect.poll(async()=>(await s.ctx.invoke('list')).find((e:any)=>e.id==='calm').enabled).toBe(false);
 expect((await s.ctx.invoke('list')).find((e:any)=>e.id==='calm')).toEqual({...before,enabled:false});
 s.control.abort();await s.world.stop();
});
it('form edits preserve forbidden labels and identifiers',async()=>{
 const s=await setup({wake:{wakeOn:'poke'}});const before:any=(await s.ctx.invoke('list')).find((e:any)=>e.id==='calm');
 bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 const form=s.root.querySelector('[data-id=calm] form');form.querySelector('input[type=text]').value='安安静静';
 form.dispatchEvent(new s.dom.window.Event('submit',{cancelable:true,bubbles:true}));
 await expect.poll(async()=>(await s.ctx.invoke('list')).find((e:any)=>e.id==='calm').aliases[0]).toBe('安安静静');
 expect((await s.ctx.invoke('list')).find((e:any)=>e.id==='calm').forbidden).toEqual(before.forbidden);
 s.control.abort();await s.world.stop();
});
it('imports a PNG through plain fields and requires a preview before review',async()=>{
 const s=await setup({wake:{wakeOn:'poke'}});bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=','base64');
 const form=s.root.querySelector('.be-import form');Object.defineProperty(form.querySelector('input[type=file]'),'files',{value:[{size:png.length,arrayBuffer:async()=>png}]});
 const inputs=form.querySelectorAll('input[type=text]');inputs[0].value='抱抱';inputs[1].value='原创';inputs[2].value='允许使用';form.querySelector('textarea').value='一颗爱心';
 form.dispatchEvent(new s.dom.window.Event('submit',{cancelable:true,bubbles:true}));
 await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(38);
 const entry=(await s.ctx.invoke('list')).find((e:any)=>e.kind==='sticker');expect(entry.reviewed).toBe(false);
 const row=s.root.querySelector('[data-kind=sticker]');expect(row.hidden).toBe(false);expect(row.querySelector('.be-actions button:last-child').disabled).toBe(true);
 const editor=row.querySelector('form');editor.querySelector('.be-review input').checked=true;editor.dispatchEvent(new s.dom.window.Event('submit',{cancelable:true,bubbles:true}));
 await expect.poll(()=>s.root.querySelector('.be-message').textContent).toContain('请先查看图片');
 expect((await s.ctx.invoke('list')).find((e:any)=>e.id===entry.id).reviewed).toBe(false);
 row.querySelector('.be-actions button').click();await expect.poll(()=>row.querySelector('img')).not.toBeNull();
 editor.dispatchEvent(new s.dom.window.Event('submit',{cancelable:true,bubbles:true}));
 await expect.poll(async()=>(await s.ctx.invoke('list')).find((e:any)=>e.id===entry.id).reviewed).toBe(true);
 s.control.abort();await s.world.stop();
});
it('renders hostile names as inert text',async()=>{
 const s=await setup({wake:{wakeOn:'poke'}});const entries=await s.ctx.invoke('list');await s.ctx.invoke('update',[{...entries[0],aliases:['<img src=x onerror=alert(1)>']}]);
 bundle.panels.library.mount(s.ctx);await expect.poll(()=>s.root.querySelectorAll('.be-card').length).toBe(37);
 expect(s.root.querySelector('h3 img')).toBeNull();expect(s.root.textContent).toContain('<img');
 s.control.abort();await s.world.stop();
});
