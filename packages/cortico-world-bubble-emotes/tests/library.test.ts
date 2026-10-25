import {describe,it,expect} from 'vitest';
import {mkdtempSync,rmSync,readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {EmoteLibrary, EMOTIONS, validateEmote} from '../src/library.ts';
import {DEFAULT_EMOTES,CATALOG_VERSION} from '../src/catalog.ts';
describe('persistent emote library',()=>{
  it('merges independent writers and reports an active lock without overwriting data',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-writers-'));
    try{const a=new EmoteLibrary(dir),b=new EmoteLibrary(dir);a.put({...a.get('calm'),example:'first'});b.put({...b.get('fear'),example:'second'});expect(a.get('fear').example).toBe('second');expect(b.get('calm').example).toBe('first');
      const lock=join(a.root,'library.json.lock');writeFileSync(lock,'active writer');expect(()=>a.put({...a.get('calm'),example:'blocked'})).toThrow(/busy/);rmSync(lock);expect(a.get('calm').example).toBe('first');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('preserves legacy image records and files but excludes them from search and updates',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-legacy-'));
    try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8'));
      const entry={...a.get('calm'),id:'old-image',kind:'sticker',text:undefined,file:'a'.repeat(64)+'.png',sha256:'a'.repeat(64)};
      raw.emotes.push(entry);writeFileSync(index,JSON.stringify(raw));const file=join(a.root,entry.file);writeFileSync(file,'legacy bytes');
      expect(a.search('calm').every(e=>e.kind==='emoji')).toBe(true);expect(()=>a.put(entry)).toThrow(/Unicode/);
      a.put({...a.get('calm'),usage:'Updated'});expect(a.list().find(e=>e.id==='old-image')).toMatchObject(JSON.parse(JSON.stringify(entry)));expect(readFileSync(file,'utf8')).toBe('legacy bytes');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('migrates only the default unsupported comfort glyph, preserving user settings',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-comfort-'));
    try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8'));
      Object.assign(raw.emotes.find((e:{id:string})=>e.id==='comfort'),{text:'🫂',description:'people hugging',unicodeName:'people hugging',aliases:['安慰','拥抱','陪伴'],enabled:false,usage:'My usage'});raw.catalogVersion=1;writeFileSync(index,JSON.stringify(raw));
      const b=new EmoteLibrary(dir);expect(b.get('comfort')).toMatchObject({text:'💙',enabled:false,usage:'My usage'});
      const bytes=readFileSync(index,'utf8');new EmoteLibrary(dir);expect(readFileSync(index,'utf8')).toBe(bytes);
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it.each([1,2])('repairs the shipped legacy hug even after catalog %s was marked upgraded, preserving edits and backup',version=>{
    const dir=mkdtempSync(join(tmpdir(),'comfort-regression-'));
    try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8'));
      const edited={...a.get('comfort'),source:version===2?'Unicode':a.get('comfort').source,text:'🫂',description:'A supportive hug, without celebration',unicodeName:'people hugging',enabled:false,reviewed:false,usage:'我的安慰用法',aliases:['我的安慰','拥抱','陪伴']};
      raw.catalogVersion=version;raw.emotes=raw.emotes.map((e:any)=>e.id==='comfort'?edited:e);const original=JSON.stringify(raw);writeFileSync(index,original);
      const b=new EmoteLibrary(dir);expect(b.get('comfort')).toEqual({...edited,text:'💙',unicodeName:'blue heart'});expect(JSON.parse(readFileSync(index,'utf8')).catalogVersion).toBe(CATALOG_VERSION);expect(readFileSync(index+'.bak','utf8')).toBe(original);
      expect(b.list().filter(e=>e.id!=='comfort')).toEqual(raw.emotes.filter((e:any)=>e.id!=='comfort'));
      const migrated=readFileSync(index,'utf8');new EmoteLibrary(dir);expect(readFileSync(index,'utf8')).toBe(migrated);
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('does not replace a user-selected comfort emoji or custom-source hug',()=>{
    for(const patch of[{text:'🤗'},{text:'🫂',source:'custom'}]){const dir=mkdtempSync(join(tmpdir(),'comfort-custom-'));
      try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8'));const edited={...a.get('comfort'),unicodeName:'people hugging',...patch};raw.catalogVersion=2;raw.emotes=raw.emotes.map((e:any)=>e.id==='comfort'?edited:e);writeFileSync(index,JSON.stringify(raw));expect(new EmoteLibrary(dir).get('comfort')).toEqual(edited);
      }finally{rmSync(dir,{recursive:true,force:true});}
    }
  });
  it('rejects non-emoji content while preserving composed Unicode emoji',()=>{
    for(const text of ['1','ordinary text','😊123'])expect(()=>validateEmote({...DEFAULT_EMOTES[0],text})).toThrow();
    for(const text of ['1️⃣','👨‍👩‍👧‍👦','🇨🇳','👍🏽'])expect(validateEmote({...DEFAULT_EMOTES[0],text}).text).toBe(text);
    expect(()=>validateEmote({...DEFAULT_EMOTES[0],source:'a'.repeat(200000)})).toThrow();
  });
  it('covers every semantic category with usable meaning and preserves user teaching on migration',()=>{
    const dir=mkdtempSync(join(tmpdir(),'emote-catalog-'));
    try{
      for(const e of DEFAULT_EMOTES) {expect(validateEmote(e)).toEqual(e);expect(e.usage).toBeTruthy();expect(e.avoid?.length).toBeGreaterThan(0);expect(e.example).toBeTruthy();expect(e.bodyMatch).toBeTruthy();if(e.bodyMatch!=='none')expect(e.bodyExpression).toBeTruthy();else expect(e.bodyExpression).toBeUndefined();}
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



it('classifies all 37 defaults against exactly 19 expressions and never maps an expression to a motion',async()=>{const{BODY_EXPRESSIONS}=await import('../src/body-mapping.ts');expect(Object.keys(BODY_EXPRESSIONS)).toHaveLength(19);const counts={direct:0,approximate:0,none:0};for(const e of DEFAULT_EMOTES){validateEmote(e);counts[e.bodyMatch!]++;if(e.bodyMatch!=='none')expect(Object.hasOwn(BODY_EXPRESSIONS,e.bodyExpression!)).toBe(true);else expect(e.bodyExpression).toBeUndefined();}expect(counts).toEqual({direct:16,approximate:21,none:0});expect(DEFAULT_EMOTES.find(e=>e.id==='sleepy')).toMatchObject({bodyMatch:'approximate',bodyExpression:'sleepy'});expect(DEFAULT_EMOTES.find(e=>e.id==='apology')).toMatchObject({bodyMatch:'approximate',bodyExpression:'flustered'});expect(DEFAULT_EMOTES.filter(e=>e.bodyMatch==='none').map(e=>e.id)).toEqual([]);expect(()=>validateEmote({...DEFAULT_EMOTES[0],bodyExpression:'sleep'})).toThrow();expect(()=>validateEmote({...DEFAULT_EMOTES[0],bodyMatch:'none'})).toThrow();});
it('migrates a real version 3 library and preserves user edits, custom choices and explicit classifications',()=>{const dir=mkdtempSync(join(tmpdir(),'mapping-upgrade-'));try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8'));raw.catalogVersion=3;for(const e of raw.emotes){delete e.bodyMatch;delete e.bodyMatchReason;if(['disgust','ill'].includes(e.id))e.bodyExpression='worried';if(e.id==='apology')e.bodyExpression='sad';}const joy=raw.emotes.find((e:any)=>e.id==='joy');Object.assign(joy,{enabled:false,reviewed:false,usage:'我的用法',aliases:['自定义名称'],bodyExpression:'cry'});const explicit=raw.emotes.find((e:any)=>e.id==='calm');Object.assign(explicit,{bodyMatch:'none',bodyMatchReason:'用户不希望指定脸部'});delete explicit.bodyExpression;writeFileSync(index,JSON.stringify(raw));const b=new EmoteLibrary(dir);expect(b.get('disgust')).toMatchObject({bodyMatch:'approximate',bodyExpression:'scared'});expect(b.get('ill').bodyExpression).toBe('sleepy');expect(b.get('apology')).toMatchObject({bodyMatch:'approximate',bodyExpression:'flustered'});expect(b.get('joy')).toMatchObject({bodyMatch:'approximate',bodyExpression:'cry',enabled:false,reviewed:false,usage:'我的用法',aliases:['自定义名称']});expect(b.get('calm')).toEqual(explicit);const bytes=readFileSync(index,'utf8');new EmoteLibrary(dir);expect(readFileSync(index,'utf8')).toBe(bytes);expect(readFileSync(index+'.bak','utf8')).toBe(JSON.stringify(raw));}finally{rmSync(dir,{recursive:true,force:true});}});

it('upgrades all four version 4 default mappings and preserves edited usage and switches',()=>{const dir=mkdtempSync(join(tmpdir(),'four-mappings-'));try{const a=new EmoteLibrary(dir),index=join(a.root,'library.json'),raw=JSON.parse(readFileSync(index,'utf8')),previous={"apology": {"text": "🙇", "bodyMatch": "approximate", "bodyExpression": "neutral", "bodyMatchReason": "没有歉意脸，采用平静降级；抱歉不必然难过，鞠躬属于另行判断的动作。"}, "gratitude": {"text": "🙏", "bodyMatch": "approximate", "bodyExpression": "neutral", "bodyMatchReason": "感谢无专属身体表情，平静仅作为克制降级。"}, "disgust": {"text": "🤢", "bodyMatch": "none", "bodyExpression": null, "bodyMatchReason": "内置19种表情没有恶心、反胃；不再强配担心，不要求改变身体表情。"}, "ill": {"text": "🤒", "bodyMatch": "none", "bodyExpression": null, "bodyMatchReason": "内置19种表情没有生病、发烧；不再强配担心，不要求改变身体表情。"}};raw.catalogVersion=4;for(const e of raw.emotes){const prior=previous[e.id as keyof typeof previous];if(prior){Object.assign(e,prior,{enabled:false,usage:'我的用法'});if(prior.bodyExpression===null)delete e.bodyExpression;}}writeFileSync(index,JSON.stringify(raw));const next=new EmoteLibrary(dir);for(const[id,expression]of Object.entries({apology:'flustered',gratitude:'excited',disgust:'scared',ill:'sleepy'}))expect(next.get(id)).toMatchObject({bodyMatch:'approximate',bodyExpression:expression,enabled:false,usage:'我的用法'});const bytes=readFileSync(index,'utf8');new EmoteLibrary(dir);expect(readFileSync(index,'utf8')).toBe(bytes);}finally{rmSync(dir,{recursive:true,force:true});}});

it('persists user emotion and body mapping changes and rejects non-body actions',()=>{const dir=mkdtempSync(join(tmpdir(),'mapping-edit-'));try{const lib=new EmoteLibrary(dir);lib.put({...lib.get('joy'),emotions:['gratitude'],forbidden:['sadness'],bodyExpression:'excited',bodyMatch:'approximate',bodyMatchReason:'用户选用期待脸表达感谢。'});const restored=new EmoteLibrary(dir);expect(restored.search('joy').some(e=>e.id==='joy')).toBe(false);expect(restored.search('gratitude').find(e=>e.id==='joy')?.bodyExpression).toBe('excited');expect(()=>lib.put({...lib.get('joy'),bodyExpression:'dance'})).toThrow();lib.put({...lib.get('joy'),bodyExpression:undefined,bodyMatch:'none'});expect(new EmoteLibrary(dir).get('joy').bodyExpression).toBeUndefined();}finally{rmSync(dir,{recursive:true,force:true});}});
