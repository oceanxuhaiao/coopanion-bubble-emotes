import {describe,it,expect} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import type {WorldHost,ToolOutcome} from 'cortico/core/types.ts';
import {BubbleEmotesWorld} from '../src/world.ts';
import {BUBBLE_EMOTES} from '../src/definition.ts';
import {parsePageId} from 'cortico/web/shared/webui-protocol.ts';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=','base64');
describe('emote World with a real persistent library',()=>{
  it('registers a valid World page with the same definition and runtime id',()=>{
    const world=new BubbleEmotesWorld('unused');
    expect(world.id).toBe(BUBBLE_EMOTES.id);
    expect(parsePageId(`world:${world.id}`)).not.toBeNull();
    expect(world.webUi().label).toContain('表情与表情包');
    expect(world.webUi().panels?.some(p=>p.id==='library')).toBe(true);
  });
  it('imports images unreviewed, rejects conflicting intent and returns approved attachments',async()=>{
    const dir=mkdtempSync(join(tmpdir(),'emotes-world-')),world=new BubbleEmotesWorld(dir);
    try{
      await world.start({} as WorldHost);
      const search=world.tools().find(t=>t.name==='bubble_emotes_search')!;
      const searchResult=await search.handler({emotion:'calm',query:'平静',maxIntensity:.2},{role:'main',log:{} as WorldHost['log']}) as ToolOutcome;
      expect(JSON.parse(searchResult.text)).toMatchObject([{id:'calm',text:'😌',bodyExpression:'neutral'}]);
      const prepare=world.tools().find(t=>t.name==='bubble_emotes_prepare')!;
      const calm=await prepare.handler({id:'calm',emotion:'calm'},{role:'main',log:{} as WorldHost['log']}) as ToolOutcome;
      expect(JSON.parse(calm.text)).toMatchObject({emote:{usage:expect.any(String),avoid:expect.any(Array),example:expect.any(String)},suggestedPresentation:{bodyCue:{expression:'neutral'},segments:[{kind:'emoji',text:'😌'}]}});
      const invoke=world.webUi().invoke!;
      const entry=await invoke('library','import',[{base64:png.toString('base64'),metadata:{id:'hug',description:'A supportive hug',emotions:['comfort'],intensity:.2,forbidden:['joy'],source:'test fixture',license:'test-only'}}]) as Record<string,unknown>;
      const tool=world.tools().find(t=>t.name==='bubble_emotes_prepare')!;
      const call=(emotion:string)=>tool.handler({id:'hug',emotion},{role:'main',log:{} as WorldHost['log']}) as Promise<ToolOutcome>;
      expect(await call('comfort')).toMatchObject({failed:true});
      await invoke('library','update',[{...entry,reviewed:true}]);
      expect(await call('joy')).toMatchObject({failed:true});
      const out=await call('comfort');expect(out.failed).toBeUndefined();expect(out.blobs).toHaveLength(1);
      expect(out.blobs?.[0]).toMatchObject({mime:'image/png'});
      await expect(invoke('library','import',[{base64:Buffer.from('not image').toString('base64'),metadata:{}}])).rejects.toThrow(/PNG/);
      await world.stop();await world.start({} as WorldHost);
      expect((await invoke('library','list',[]) as Array<{id:string;reviewed:boolean}>).find(e=>e.id==='hug')?.reviewed).toBe(true);
    }finally{await world.stop();rmSync(dir,{recursive:true,force:true});}
  });
});
