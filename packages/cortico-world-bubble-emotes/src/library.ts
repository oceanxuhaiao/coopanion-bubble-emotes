import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { pngSize } from './media.ts';

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
  const r = raw as Emote;
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(r.id) || !['emoji','sticker'].includes(r.kind) || typeof r.description !== 'string' || !r.description.trim() || r.description.length > 500) throw new Error('Invalid emote identity.');
  if (!Array.isArray(r.emotions) || !r.emotions.length || !Array.isArray(r.forbidden)) throw new Error('Missing emotion labels.');
  for(const key of ['unicodeName','bodyExpression','usage','example'] as const) if(r[key]!==undefined && (typeof r[key]!=='string'||r[key]!.length>500)) throw new Error('Invalid usage metadata.');
  for(const key of ['avoid','aliases'] as const) if(r[key]!==undefined && (!Array.isArray(r[key])||r[key]!.length>20||r[key]!.some(v=>typeof v!=='string'||v.length>500))) throw new Error('Invalid usage labels.');
  r.emotions.forEach(asEmotion); r.forbidden.forEach(asEmotion);
  if (!Number.isFinite(r.intensity) || r.intensity < 0 || r.intensity > 1 || typeof r.reviewed !== 'boolean' || typeof r.enabled !== 'boolean') throw new Error('Invalid intensity or review state.');
  if (typeof r.source !== 'string' || !r.source.trim() || typeof r.license !== 'string' || !r.license.trim()) throw new Error('Source and license required.');
  if (r.kind === 'emoji' && (typeof r.text !== 'string' || !r.text.length || r.text.length > 32 || !/\p{Emoji}/u.test(r.text) || /[\p{Letter}]/u.test(r.text))) throw new Error('Expected Unicode emoji.');
  if (r.kind === 'sticker' && (!/^[a-f0-9]{64}\.png$/.test(r.file ?? '') || r.sha256 !== r.file?.slice(0,-4))) throw new Error('Invalid sticker filename.');
  return structuredClone(r);
}
export class EmoteLibrary {
  private data: LibraryData;
  readonly root: string;
  private readonly index: string;
  constructor(dataDir: string) {
    this.root = join(dataDir,'bubble-emotes'); this.index = join(this.root,'library.json');
    mkdirSync(this.root,{recursive:true});
    if (existsSync(this.index)) {
      const raw = JSON.parse(readFileSync(this.index,'utf8'));
      if (raw.schemaVersion !== 1 || !Array.isArray(raw.emotes)) throw new Error('Unsupported library schema; restore a matching backup before writing.');
      this.data = {schemaVersion:1,catalogVersion:raw.catalogVersion,emotes:raw.emotes.map(validateEmote)};
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
  }
  list() { return structuredClone(this.data.emotes); }
  search(emotion: Emotion, maxIntensity = 1, query = '') {
    return this.list().filter((e) => e.enabled && e.reviewed && e.intensity <= maxIntensity && e.emotions.includes(emotion) && !e.forbidden.includes(emotion) && (!query || [e.id,e.description,e.usage??'',...(e.aliases??[])].some(value=>value.toLowerCase().includes(query.toLowerCase())))).sort((a,b)=>a.intensity-b.intensity || a.id.localeCompare(b.id));
  }
  get(id: string) { const e = this.data.emotes.find((e) => e.id === id); if (!e) throw new Error('Unknown emote.'); return structuredClone(e); }
  put(raw: unknown) {
    const e = validateEmote(raw), before = this.data;
    this.data = {...this.data,emotes:[...this.data.emotes.filter((p)=>p.id!==e.id),e]};
    try { this.save(); } catch (error) { this.data=before; throw error; }
    return e;
  }
  importPng(bytes: Uint8Array, metadata: Record<string, unknown>) {
    pngSize(bytes);
    const sha256=createHash('sha256').update(bytes).digest('hex'), file=`${sha256}.png`;
    // Imports remain unreviewed until the person checks image contents and any written words.
    const entry=validateEmote({...metadata,kind:'sticker',file,sha256,reviewed:false,enabled:true});
    writeFileSync(join(this.root,file),bytes);
    return this.put(entry);
  }
  bytes(e: Emote) {
    if (e.kind !== 'sticker' || !e.file) throw new Error('Not a sticker.');
    const bytes=readFileSync(join(this.root,e.file));
    if (createHash('sha256').update(bytes).digest('hex') !== e.sha256) throw new Error('Sticker hash mismatch.');
    return bytes;
  }
  private save() {
    if (existsSync(this.index)) copyFileSync(this.index,`${this.index}.bak`);
    const temp=`${this.index}.${randomUUID()}.tmp`;
    writeFileSync(temp,JSON.stringify(this.data,null,2),'utf8'); renameSync(temp,this.index);
  }
}
