import { fileURLToPath } from 'node:url';
import type { ToolDef, World, WorldHost, WorldWebUiDecl } from 'cortico/core/types.ts';
import { EmoteLibrary, asEmotion, EMOTIONS, type Emote } from './library.ts';

export const BUBBLE_EMOTES_TOOL_DECLS: Array<Omit<ToolDef,'handler'>> = [
  {name:'bubble_emotes_search',tags:['read'],description:'Find enabled, reviewed Unicode emoji by intended meaning. Read usage, avoid rules and examples; judge context, negation, quotation and emotional changes. Pictures are not supported. Use a selected emoji directly in pet_say.script; no other fields or host patches are needed.',parameters:{type:'object',properties:{emotion:{enum:[...EMOTIONS]},maxIntensity:{type:'number',minimum:0,maximum:1},query:{type:'string',maxLength:80}},required:['emotion'],additionalProperties:false}},
  {name:'bubble_emotes_prepare',tags:['read'],description:'Read one enabled, reviewed Unicode emoji and its usage. Put the emoji character itself in the standard pet_say.script, alone or beside words. Body expressions are optional script-marker suggestions, not confirmed synchronization. No images, rich presentation, renderer registration or special emoji fields are supported.',parameters:{type:'object',properties:{id:{type:'string'},emotion:{enum:[...EMOTIONS]}},required:['id','emotion'],additionalProperties:false}},
];
export class BubbleEmotesWorld implements World {
  readonly id='bubble-emotes';
  private library: EmoteLibrary | null=null;
  constructor(private readonly dataDir: string) {}
  async start(_host: WorldHost) { this.library=new EmoteLibrary(this.dataDir); }
  async stop() { this.library=null; }
  envPromptVars() { return {}; }
  private get lib() { if(!this.library) throw new Error('World is not mounted.'); return this.library; }
  private activeEntry(id:string) {const e=this.lib.get(id);if(e.kind!=='emoji')throw new Error('Image assets are not supported in this version.');return e;}
  tools(): ToolDef[] {
    return BUBBLE_EMOTES_TOOL_DECLS.map(decl=>({...decl,handler:async(args)=>{
      try {
        const emotion=asEmotion(args.emotion);
        if(decl.name==='bubble_emotes_search') {
          const max=args.maxIntensity===undefined?1:Number(args.maxIntensity);
          if(!Number.isFinite(max)||max<0||max>1)throw new Error('Invalid maximum intensity.');
          return {text:JSON.stringify(this.lib.search(emotion,max,typeof args.query==='string'?args.query:''))};
        }
        const e=this.activeEntry(String(args.id));
        if(!e.enabled||!e.reviewed||!e.emotions.includes(emotion)||e.forbidden.includes(emotion))throw new Error('Emote unavailable for this intent.');
        return {text:JSON.stringify({emote:e,suggestedSay:{script:e.text},next:'Use pet_say with script only. Write the chosen Unicode emoji directly into that script. For mixed words and emoji, compose one script. Never send image attachments or custom presentation fields. Do not claim body synchronization or third-party speech filtering.'})};
      }catch(err){return {text:(err as Error).message,failed:true as const};}
    }}));
  }
  webUi(): WorldWebUiDecl {
    return {label:'表情',panels:[{id:'library',title:'表情',getMethods:['list','preview']}],
      invoke:async(panel,method,args)=>{
        if(panel!=='library')throw new Error('Unknown panel.');
        if(method==='list')return this.lib.list().filter(e=>e.kind==='emoji');
        if(method==='preview')return {text:this.activeEntry(String(args[0])).text};
        if(method==='update'){
          const raw=args[0] as Emote;const current=this.activeEntry(String(raw?.id));
          if(raw?.kind!=='emoji')throw new Error('Only Unicode emoji are supported.');
          return this.lib.put({...current,...raw,kind:'emoji'});
        }
        throw new Error('Unsupported method: this version manages Unicode emoji only.');
      },
      promptDocs:[{key:'worlds.bubble-emotes.envPrompt',title:'使用说明',description:'原版桌宠的普通emoji用法与限制。',path:fileURLToPath(new URL('./ENV_PROMPT.md',import.meta.url)),role:'envPrompt'}]};
  }
}
