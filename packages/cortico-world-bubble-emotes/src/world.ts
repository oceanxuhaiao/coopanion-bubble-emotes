import type {SecretStore} from './cloud-settings.ts';
import { fileURLToPath } from 'node:url';
import type { ToolDef, World, WorldHost, WorldWebUiDecl } from 'cortico/core/types.ts';
import { EmoteLibrary, asEmotion, EMOTIONS, type Emote } from './library.ts';
import { UsageFallback } from './usage-fallback.ts';
import { ExpressionLog } from './expression-log.ts';

export const BUBBLE_EMOTES_TOOL_DECLS: Array<Omit<ToolDef,'handler'>> = [
  {name:'bubble_emotes_search',tags:['read'],description:'Optional lookup for uncertain or uncommon emoji. For familiar choices use the direct guide and call pet_say immediately; do not search or prepare first. Find enabled, reviewed Unicode emoji by intended meaning. Read usage, avoid rules and examples; judge context, negation, quotation and emotional changes. Pictures are not supported. Use a selected emoji directly in pet_say.script; no other fields or host patches are needed.',parameters:{type:'object',properties:{emotion:{enum:[...EMOTIONS]},maxIntensity:{type:'number',minimum:0,maximum:1},query:{type:'string',maxLength:80}},required:['emotion'],additionalProperties:false}},
  {name:'bubble_emotes_prepare',tags:['read'],description:'Optional inspection by ID, not a sending prerequisite. Search results and the direct guide already contain usable emoji. Read one enabled, reviewed Unicode emoji and its usage. Put the emoji character itself in the standard pet_say.script, alone or beside words. Body expressions are optional script-marker suggestions, not confirmed synchronization. No images, rich presentation, renderer registration or special emoji fields are supported.',parameters:{type:'object',properties:{id:{type:'string'},emotion:{enum:[...EMOTIONS]}},required:['id','emotion'],additionalProperties:false}},
];
export class BubbleEmotesWorld implements World {
  readonly id='bubble-emotes';
  private library: EmoteLibrary | null=null;
  private usageFallback: UsageFallback | null=null;
  private expressionLog: ExpressionLog | null=null;
  private recordTimer:ReturnType<typeof setInterval>|undefined;
  constructor(private readonly dataDir: string,private readonly secrets?:SecretStore) {}
  async start(host: WorldHost) {
    this.library=new EmoteLibrary(this.dataDir);
    if(typeof host.store?.latestCursor==='function'&&typeof host.store?.range==='function'&&typeof host.pushDeferred==='function')this.usageFallback=new UsageFallback(host,()=>this.library?.list().some(e=>e.kind==='emoji'&&e.enabled&&e.reviewed)??false);
    this.expressionLog=new ExpressionLog(this.dataDir,host,()=>this.lib.list(),fetch,id=>this.usageFallback?.review(()=>this.expressionLog?.hint(id),id,info=>this.expressionLog?.hintUpdate(id,info)),this.secrets);
    this.recordTimer=setInterval(()=>{this.expressionLog?.collect();this.usageFallback?.tick();},1500);
  }
  async stop() { clearInterval(this.recordTimer);this.usageFallback?.stop();this.expressionLog?.stop();this.expressionLog=null;this.usageFallback=null;this.library=null; }
  onTurnEnded(){this.usageFallback?.scan();this.expressionLog?.collect();}
  onEventsSettled(events:readonly import('cortico/core/types.ts').EventEnvelope[],outcome:'delivered'|'discarded'){for(const e of events)if(e.type==='bubble-emotes.usage_hint')this.expressionLog?.hintSettled(e.meta?.recordId,e.meta?.ticketId,outcome,e.cursor);}
  envPromptVars() {
    // Only expose current, enabled, reviewed characters. No stale static emoji examples.
    const intents = ['joy','celebration','sadness','comfort','thinking','worry','calm','affection'] as const;
    const entries = this.library?.list() ?? [];
    const rows = intents.flatMap(emotion => {
      const e = entries.filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.emotions.includes(emotion)&&!e.forbidden.includes(emotion))
        .sort((a,b)=>a.intensity-b.intensity||a.id.localeCompare(b.id))[0];
      return e ? [JSON.stringify({intent:emotion,emoji:e.text,usage:e.usage??e.description,avoid:e.avoid??[]})] : [];
    });
    return { 'bubbleEmotes.directGuide': rows.length ? rows.join('\n') : 'No enabled reviewed common emoji. Do not invent a replacement or use disabled entries.' };
  }
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
    return {label:'表情',panels:[{id:'library',title:'表情库',getMethods:['list','preview']},{id:'records',title:'表达记录',getMethods:['state']}],
      invoke:async(panel,method,args)=>{
        if(panel==='records'){
          const log=this.expressionLog;if(!log)throw Error('表达记录尚未加载');
          if(method==='state')return log.state();
          if(method==='cloud')return log.configureCloud(args[0]);
          if(method==='configure')return log.configure(args[0]);
          if(method==='models')return log.models();
          if(method==='skip')return log.skip(String(args[0]));
          if(method==='retry')return log.retry(String(args[0]));
          if(method==='feedback')return log.feedback(String(args[0]),args[1],args[2]??'');
          if(method==='clear')return log.clear();
          throw Error('未知表达记录操作');
        }
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
