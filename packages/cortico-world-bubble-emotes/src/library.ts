import {isEmojiContent} from './emoji.ts';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import {DEFAULT_EMOTES as defaults, EMOTIONS, CATALOG_VERSION} from './catalog.ts';
export {EMOTIONS} from './catalog.ts';
export type Emotion = typeof EMOTIONS[number];
export interface Emote {
  id: string; kind: 'emoji' | 'sticker'; text?: string; file?: string; sha256?: string;
  unicodeName?: string; bodyExpression?: string; usage?: string; avoid?: string[]; example?: string; aliases?: string[];
  description: string; emotions: Emotion[]; intensity: number; forbidden: Emotion[];
  reviewed: boolean; enabled: boolean; source: string; license: string;
}
interface LibraryData { schemaVersion: 1; catalogVersion?:number; emotes: Emote[] }
export const asEmotion = (v: unknown): Emotion => {
  if (!(EMOTIONS as readonly unknown[]).includes(v)) throw new Error('Unknown emotion.');
  return v as Emotion;
};
export function validateEmote(raw: unknown): Emote {
  if (!raw || typeof raw !== 'object') throw new Error('Expected emote metadata.');
  if(JSON.stringify(raw).length>16384)throw new Error('Emote metadata exceeds 16 KiB of JSON text.');
  const r = raw as Emote;
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(r.id) || !['emoji','sticker'].includes(r.kind) || typeof r.description !== 'string' || !r.description.trim() || r.description.length > 500) throw new Error('Invalid emote identity.');
  if (!Array.isArray(r.emotions) || !r.emotions.length || !Array.isArray(r.forbidden)) throw new Error('Missing emotion labels.');
  for(const key of ['unicodeName','bodyExpression','usage','example'] as const) if(r[key]!==undefined && (typeof r[key]!=='string'||r[key]!.length>500)) throw new Error('Invalid usage metadata.');
  for(const key of ['avoid','aliases'] as const) if(r[key]!==undefined && (!Array.isArray(r[key])||r[key]!.length>20||r[key]!.some(v=>typeof v!=='string'||v.length>500))) throw new Error('Invalid usage labels.');
  r.emotions.forEach(asEmotion); r.forbidden.forEach(asEmotion);
  if (!Number.isFinite(r.intensity) || r.intensity < 0 || r.intensity > 1 || typeof r.reviewed !== 'boolean' || typeof r.enabled !== 'boolean') throw new Error('Invalid intensity or review state.');
  if (typeof r.source !== 'string' || !r.source.trim() || r.source.length>2000 || typeof r.license !== 'string' || !r.license.trim() || r.license.length>2000) throw new Error('Source and license required.');
  if (r.kind === 'emoji' && (typeof r.text !== 'string' || !r.text.length || r.text.length > 32 || !isEmojiContent(r.text))) throw new Error('Expected Unicode emoji.');
  if (r.kind === 'sticker' && (!/^[a-f0-9]{64}\.png$/.test(r.file ?? '') || r.sha256 !== r.file?.slice(0,-4))) throw new Error('Invalid sticker filename.');
  return structuredClone(r);
}
export class EmoteLibrary {
  private data!: LibraryData;
  readonly root: string;
  private readonly index: string;
  constructor(dataDir: string) {
    this.root = join(dataDir,'bubble-emotes'); this.index = join(this.root,'library.json');
    mkdirSync(this.root,{recursive:true});
    this.withLock(()=>{
    if (existsSync(this.index)) {
      const raw = JSON.parse(readFileSync(this.index,'utf8'));
      if (raw.schemaVersion !== 1 || !Array.isArray(raw.emotes)) throw new Error('Unsupported library schema; restore a matching backup before writing.');
      this.data = {schemaVersion:1,catalogVersion:raw.catalogVersion,emotes:raw.emotes.map(validateEmote)};
      if((raw.catalogVersion??0)<3) {
        const old=this.data.emotes.find(e=>e.id==='comfort'&&e.kind==='emoji'&&e.text==='🫂'&&['Unicode','https://www.unicode.org/emoji/charts/emoji-list.html'].includes(e.source)&&(e.unicodeName==='people hugging'||(!e.unicodeName&&['people hugging','A supportive hug, without celebration'].includes(e.description))));
        if(old){old.text='💙';if(old.description==='people hugging')old.description='blue heart';old.unicodeName='blue heart';if(JSON.stringify(old.aliases)===JSON.stringify(['安慰','拥抱','陪伴']))old.aliases=['安慰','支持','陪伴'];}
      }
      if((raw.catalogVersion??0)<CATALOG_VERSION) {
        for(const seed of defaults) {
          const old=this.data.emotes.find(e=>e.id===seed.id);
          if(!old) this.data.emotes.push(structuredClone(seed));
          else for(const key of ['unicodeName','bodyExpression','usage','avoid','example','aliases'] as const) {
            if(old[key]===undefined) Object.assign(old,{[key]:structuredClone(seed[key])});
          }
        }
        this.data.catalogVersion=CATALOG_VERSION;this.save();
      }
    } else { this.data = {schemaVersion:1,catalogVersion:CATALOG_VERSION,emotes:structuredClone(defaults)}; this.save(); }
    });
  }
  private withLock<T>(fn:()=>T):T {
    let fd:number;
    try{fd=openSync(this.index+'.lock','wx');}catch(error){if((error as NodeJS.ErrnoException).code==='EEXIST')throw new Error('Emote library is busy. If a writer crashed, close all instances and remove the stale library.json.lock before retrying.');throw error;}
    try{return fn();}finally{closeSync(fd);unlinkSync(this.index+'.lock');}
  }
  private readIndex():LibraryData {
    const raw=JSON.parse(readFileSync(this.index,'utf8'));
    if(raw.schemaVersion!==1||!Array.isArray(raw.emotes))throw new Error('Unsupported library schema.');
    return {...raw,emotes:raw.emotes.map(validateEmote)};
  }
  list() { this.data=this.readIndex();return structuredClone(this.data.emotes); }
  search(emotion: Emotion, maxIntensity = 1, query = '') {
    return this.list().filter((e) => e.kind === 'emoji' && e.enabled && e.reviewed && e.intensity <= maxIntensity && e.emotions.includes(emotion) && !e.forbidden.includes(emotion) && (!query || [e.id,e.description,e.usage??'',...(e.aliases??[])].some(value=>value.toLowerCase().includes(query.toLowerCase())))).sort((a,b)=>a.intensity-b.intensity || a.id.localeCompare(b.id));
  }
  get(id: string) { this.data=this.readIndex();const e = this.data.emotes.find((e) => e.id === id); if (!e) throw new Error('Unknown emote.'); return structuredClone(e); }
  put(raw: unknown) {return this.withLock(()=>this.putLocked(raw));}
  private putLocked(raw:unknown) {
    const e = validateEmote(raw);if(e.kind!=='emoji')throw new Error('Only Unicode emoji can be edited in this version.');this.data=this.readIndex();const before = this.data;
    this.data = {...this.data,emotes:[...this.data.emotes.filter((p)=>p.id!==e.id),e]};
    try { this.save(); } catch (error) { this.data=before; throw error; }
    return e;
  }
  private save() {
    if (existsSync(this.index)) copyFileSync(this.index,`${this.index}.bak`);
    const temp=`${this.index}.${randomUUID()}.tmp`;
    writeFileSync(temp,JSON.stringify(this.data,null,2),'utf8'); renameSync(temp,this.index);
  }
}

