import {describe,it,expect} from 'vitest';
import {mkdtempSync,rmSync,readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {EmoteLibrary, EMOTIONS, validateEmote} from '../src/library.ts';
import {DEFAULT_EMOTES} from '../src/catalog.ts';
describe('persistent emote library',()=>{
  it('merges independent writers and reports an active lock without overwriting data',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-writers-'));
    try{const a=new EmoteLibrary(dir),b=new EmoteLibrary(dir);a.put({...a.get('calm'),example:'first'});b.put({...b.get('fear'),example:'second'});expect(a.get('fear').example).toBe('second');expect(b.get('calm').example).toBe('first');
      const lock=join(a.root,'library.json.lock');writeFileSync(lock,'active writer');expect(()=>a.put({...a.get('calm'),example:'blocked'})).toThrow(/busy/);rmSync(lock);expect(a.get('calm').example).toBe('first');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('cleans a new image if its index commit fails',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-transaction-'));
    try{const a=new EmoteLibrary(dir);const backup=join(a.root,'library.json.bak');mkdirSync(backup);
      const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=','base64');
      expect(()=>a.importPng(png,{...a.get('calm'),id:'image'})).toThrow();expect(readdirSync(a.root).filter(n=>n.endsWith('.png'))).toEqual([]);expect(readdirSync(a.root)).not.toContain('library.json.lock');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('rejects non-emoji content while preserving composed Unicode emoji',()=>{
    for(const text of ['1','ordinary text','😊123'])expect(()=>validateEmote({...DEFAULT_EMOTES[0],text})).toThrow();
    for(const text of ['1️⃣','👨‍👩‍👧‍👦','🇨🇳','👍🏽'])expect(validateEmote({...DEFAULT_EMOTES[0],text}).text).toBe(text);
    expect(()=>validateEmote({...DEFAULT_EMOTES[0],source:'a'.repeat(200000)})).toThrow();
  });
  it('covers every semantic category with usable meaning and preserves user teaching on migration',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-catalog-'));
    try{
      for(const e of DEFAULT_EMOTES) {expect(validateEmote(e)).toEqual(e);expect(e.usage).toBeTruthy();expect(e.avoid?.length).toBeGreaterThan(0);expect(e.example).toBeTruthy();expect(e.bodyExpression).toBeTruthy();}
      expect(new Set(DEFAULT_EMOTES.map(e=>e.id)).size).toBe(DEFAULT_EMOTES.length);
      const a=new EmoteLibrary(dir);
      for(const emotion of EMOTIONS) expect(a.search(emotion).length).toBeGreaterThan(0);
      expect(a.search('calm',.2,'平静')[0]).toMatchObject({text:'😌',bodyExpression:'neutral'});
      expect(a.search('neutral')[0]?.text).toBe('😐');
      expect(a.search('fear',.5).map(e=>e.text)).toEqual(['😨']);
      const index=join(dir,'bubble-emotes','library.json');
      const edited={...a.get('joy'),enabled:false,usage:'My own usage',text:'🙂'};
      writeFileSync(index,JSON.stringify({schemaVersion:1,emotes:[edited]}));
      const b=new EmoteLibrary(dir);expect(b.get('joy')).toMatchObject(edited);
      expect(b.get('calm').text).toBe('😌');
      const before=readFileSync(index,'utf8');new EmoteLibrary(dir);expect(readFileSync(index,'utf8')).toBe(before);
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('requires review, preserves edits across upgrades and rejects future schema writes',()=>{
    const dir=mkdtempSync(join(tmpdir(),'bubble-emotes-'));
    try {
      const a=new EmoteLibrary(dir);
      expect(a.search('sadness').some(e=>e.id==='joy')).toBe(false);
      const joy=a.get('joy');a.put({...joy,enabled:false});
      const indexBefore=join(dir,'bubble-emotes','library.json'); const old=JSON.parse(readFileSync(indexBefore,'utf8')); delete old.catalogVersion;old.emotes=old.emotes.filter((e:{id:string})=>!['fear','anger'].includes(e.id));writeFileSync(indexBefore,JSON.stringify(old));
      const b=new EmoteLibrary(dir);expect(b.search('fear')[0]?.text).toBe('😨');expect(b.search('anger')[0]?.text).toBe('😠');expect(b.search('joy').some(e=>e.id==='joy')).toBe(false);
      b.put({...joy,reviewed:false});expect(b.search('joy').some(e=>e.id==='joy')).toBe(false);
      expect(()=>b.put({...joy,id:'../escape'})).toThrow();
      const index=join(dir,'bubble-emotes','library.json');
      writeFileSync(index,JSON.stringify({schemaVersion:2,emotes:[]}));
      expect(()=>new EmoteLibrary(dir)).toThrow(/schema/);
      expect(JSON.parse(readFileSync(index,'utf8')).schemaVersion).toBe(2);
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
});


