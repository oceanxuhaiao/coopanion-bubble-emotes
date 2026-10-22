import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { ToolDef, World, WorldHost, WorldWebUiDecl } from 'cortico/core/types.ts';
import { EmoteLibrary, asEmotion, EMOTIONS } from './library.ts';
import { pngSize } from './media.ts';

export const BUBBLE_EMOTES_TOOL_DECLS: Array<Omit<ToolDef,'handler'>> = [
  {name:'bubble_emotes_search',tags:['read'],description:'Find reviewed emotes by the intended meaning of this reply, sorted from gentle to intense. Read usage, avoid, aliases, example and suggested bodyExpression; those are semantic guidance, not state overrides. Evaluate context, negation, quotation, irony and whom the feeling describes. Sad context may need comfort rather than celebration. No candidate means use text alone.',parameters:{type:'object',properties:{emotion:{enum:[...EMOTIONS]},maxIntensity:{type:'number',minimum:0,maximum:1},query:{type:'string',maxLength:80,description:'Optional name or alias filter, such as calm or 平静. Meaning must still match emotion.'}},required:['emotion'],additionalProperties:false}},
  {name:'bubble_emotes_prepare',tags:['read'],description:'Read one reviewed emote and, for a sticker, return its image attachment. Confirm its meaning fits the actual reply, then use pet_say.presentation with the exact returned blob handle. The host binds the actual figure and state; omit figure and expectedStateRevision. Choose a supported body expression. An uncertain context should use text alone.',parameters:{type:'object',properties:{id:{type:'string'},emotion:{enum:[...EMOTIONS]}},required:['id','emotion'],additionalProperties:false}},
];
export class BubbleEmotesWorld implements World {
  readonly id='bubble-emotes';
  private host: WorldHost | null=null;
  private library: EmoteLibrary | null=null;
  constructor(private readonly dataDir: string) {}
  async start(host: WorldHost) { this.host=host; this.library=new EmoteLibrary(this.dataDir); }
  async stop() { this.host=null; this.library=null; }
  envPromptVars() { return {}; }
  private get lib() { if(!this.library) throw new Error('World is not mounted.'); return this.library; }
  tools(): ToolDef[] {
    return BUBBLE_EMOTES_TOOL_DECLS.map((decl)=>({...decl,handler:async(args)=>{
      try {
        const emotion=asEmotion(args.emotion);
        if(decl.name==='bubble_emotes_search') {
          const max=args.maxIntensity===undefined?1:Number(args.maxIntensity);
          if(!Number.isFinite(max)||max<0||max>1)throw new Error('Invalid maximum intensity.');
          return {text:JSON.stringify(this.lib.search(emotion,max,typeof args.query==='string'?args.query:''))};
        }
        const e=this.lib.get(String(args.id));
        if(!e.enabled||!e.reviewed||!e.emotions.includes(emotion)||e.forbidden.includes(emotion))throw new Error('Emote unavailable for this intent.');
        return {text:JSON.stringify({emote:e,...(e.kind==='emoji'&&e.bodyExpression?{suggestedPresentation:{schema:1,requestId:randomUUID(),bodyCue:{expression:e.bodyExpression,transitions:[],allowWake:false},segments:[{kind:'emoji',text:e.text}]}}:{}),next:'Choose a context-compatible supported bodyCue and call pet_say.presentation. Omit figure and expectedStateRevision; the host handles live state. Use kind emoji with text, or kind sticker with the exact handle in the [blob ...] line. Never derive a handle from metadata.file or sha256. Do not also send images or a nonempty script. If display fails, reply once using plain script.'}),...(e.kind==='sticker'?{blobs:[{bytes:this.lib.bytes(e),mime:'image/png',fallbackText:e.description}]}:{})};
      }catch(err){return {text:(err as Error).message,failed:true as const};}
    }}));
  }
  webUi(): WorldWebUiDecl {
    return {label:'表情与表情包 / Bubble Emotes',panels:[{id:'library',title:'Emotes / 表情库',getMethods:['list','preview']}],
      invoke:async(panel,method,args)=>{
        if(panel!=='library')throw new Error('Unknown panel.');
        if(method==='list')return this.lib.list();
        if(method==='preview') {
          const e=this.lib.get(String(args[0]));
          return e.kind==='emoji'?{text:e.text}:{src:`data:image/png;base64,${this.lib.bytes(e).toString('base64')}`};
        }
        if(method==='update')return this.lib.put(args[0]);
        if(method==='import') {
          const input=args[0] as {metadata:Record<string,unknown>;base64:string};
          if(!input||typeof input.base64!=='string'||input.base64.length>3_000_000)throw new Error('Invalid image upload.');
          const bytes=Buffer.from(input.base64,'base64'); pngSize(bytes);
          return this.lib.importPng(bytes,input.metadata);
        }
        throw new Error('Unknown library method.');
      },
      promptDocs:[{key:'worlds.bubble-emotes.envPrompt',title:'Bubble emotes',description:'Context, body-state and speech rules.',path:fileURLToPath(new URL('./ENV_PROMPT.md',import.meta.url)),role:'envPrompt'}]};
  }
}
