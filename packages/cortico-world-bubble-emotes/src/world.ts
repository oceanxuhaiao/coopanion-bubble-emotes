import{responseJson}from'./analysis-response.ts';
import type {SecretStore} from './cloud-settings.ts';
import { fileURLToPath } from 'node:url';
import type { ToolDef, World, WorldHost, WorldWebUiDecl } from 'cortico/core/types.ts';
import { EmoteLibrary, asEmotion, EMOTIONS, type Emote } from './library.ts';
import { UsageFallback } from './usage-fallback.ts';
import { ExpressionLog } from './expression-log.ts';

export const BUBBLE_EMOTES_TOOL_DECLS: Array<Omit<ToolDef,'handler'>> = [
  {name:'bubble_emotes_search',tags:['read'],description:'Optional lookup for uncertain or uncommon emoji. For familiar choices use the direct guide without search/prepare. When draft review is enabled, review the candidate before pet_say. Find enabled, reviewed Unicode emoji by intended meaning. Read usage, avoid rules and examples; judge context, negation, quotation and emotional changes. Pictures are not supported. Use a selected emoji directly in pet_say.script; no other fields or host patches are needed.',parameters:{type:'object',properties:{emotion:{enum:[...EMOTIONS]},maxIntensity:{type:'number',minimum:0,maximum:1},query:{type:'string',maxLength:80}},required:['emotion'],additionalProperties:false}},
  {name:'bubble_emotes_prepare',tags:['read'],description:'Optional inspection by ID, not a sending prerequisite. Search results and the direct guide already contain usable emoji. Read one enabled, reviewed Unicode emoji and its usage. Put the emoji character itself in the standard pet_say.script, alone or beside words. Body expressions are optional script-marker suggestions, not confirmed synchronization. No images, rich presentation, renderer registration or special emoji fields are supported.',parameters:{type:'object',properties:{id:{type:'string'},emotion:{enum:[...EMOTIONS]}},required:['id','emotion'],additionalProperties:false}},
  {name:'bubble_emotes_review_draft',tags:['read'],barrierAfter:true,interruptible:true,description:'Pre-send draft review, enabled with configured expression analysis. Submit exact draft and short current context. The result includes independently switchable body-expression advice; unknown posture/quiet/unsupported figure blocks marker insertion. No motion or display guarantees. Read advisory result, then independently decide on one native pet_say.script. This tool sends nothing and never intercepts pet_say. Never blindly copy advice: neutral/missing conflicts, uncertainty or failed checks should preserve the draft or be reconsidered. Do not review indefinitely or repeat sent replies.',parameters:{type:'object',properties:{draft:{type:'string',maxLength:600},context:{type:'string',maxLength:400}},required:['draft','context'],additionalProperties:false}},
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
    this.expressionLog=new ExpressionLog(this.dataDir,host,()=>this.lib.list(),fetch,id=>this.usageFallback?.review(()=>this.expressionLog?.hint(id),id,info=>this.expressionLog?.hintUpdate(id,info)),this.secrets,signal=>this.bodySnapshot(signal));
    this.recordTimer=setInterval(()=>{this.expressionLog?.collect();this.usageFallback?.tick();},1500);
  }
  private async bodySnapshot(signal:AbortSignal):Promise<import('./body-coordination.ts').BodySnapshot|undefined>{try{const r=await fetch('http://127.0.0.1:17788/api/webui/providers/world%3Adesktop-pet/panels/pet/state',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"args":[]}',redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(1000)])});if(!r.ok)return;const s=await responseJson(r);return{figure:typeof s.skin?.figure==='string'?s.skin.figure:'',connected:s.connected===true,quiet:s.wake?.wakeOn==='none'?true:'unknown',posture:'unknown',observedAt:Date.now()};}catch{return;}}
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
    return { 'bubbleEmotes.draftMode':this.expressionLog?.draftActive()?(this.expressionLog.bodyActive()?'Body coordination is enabled, but apply markers ONLY if review body.state is suggested; blocked means no marker. ':'Body coordination is disabled; this extension must not add body markers. ')+'Expression analysis and draft review are ENABLED. Before an independently warranted reply, call bubble_emotes_review_draft with the exact draft and short current context. Read its advisory result, then judge whether to send one native pet_say.script. Do not blindly copy; neutral conflicts keep plain. No extra speaking opportunities.':'Expression analysis is OFF; draft review is OFF. Do not call bubble_emotes_review_draft. Ordinary emoji can be used directly; no preparation required.', 'bubbleEmotes.directGuide': rows.length ? rows.join('\n') : 'No enabled reviewed common emoji. Do not invent a replacement or use disabled entries.' };
  }
  private get lib() { if(!this.library) throw new Error('World is not mounted.'); return this.library; }
  private activeEntry(id:string) {const e=this.lib.get(id);if(e.kind!=='emoji')throw new Error('Image assets are not supported in this version.');return e;}
  tools(): ToolDef[] {
    return BUBBLE_EMOTES_TOOL_DECLS.map(decl=>({...decl,handler:async(args,ctx)=>{
      try {
        if(decl.name==='bubble_emotes_review_draft'){if(!this.expressionLog)throw Error('World is not mounted.');return{text:JSON.stringify(await this.expressionLog.reviewDraft(args,ctx.signal))};}
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
    let libraryLamp:NonNullable<WorldWebUiDecl['lamps']>[number]={label:'表情库',state:'offline',hint:'扩展尚未启动或已停止'};
    if(this.library)try{const available=this.library.list().filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed).length;libraryLamp={label:'表情库',state:available?'online':'offline',hint:available?'可用表情 '+available+' 个；不代表气泡已显示':'没有启用且已确认的表情'};}catch{libraryLamp={label:'表情库',state:'error',hint:'表情库读取失败，请检查数据文件'};}
    const lamps=[libraryLamp,...(this.expressionLog?.statusLamps()??[{label:'表达分析',state:'offline' as const,hint:'扩展尚未启动或已停止'},{label:'草稿检查',state:'offline' as const,hint:'扩展尚未启动或已停止'}])];
    return {label:'表达助手 · 情绪与表情',lamps,panels:[{id:'guide',title:'使用引导',getMethods:['state']},{id:'library',title:'表情库',getMethods:['list','preview']},{id:'records',title:'表达记录',getMethods:['state']}],
      invoke:async(panel,method,args)=>{
        if(panel==='records'||panel==='guide'){
          const log=this.expressionLog;if(!log)throw Error('表达记录尚未加载');
          if(method==='state')return log.state();
          if(method==='bodyCoordination')return log.configureBody(args[0]);
          if(method==='guide')return log.guide(args[0]);
          if(method==='test')return log.testConnection();
          if(method==='enableGuided')return log.enableGuided(args[0]);
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
          const merged={...current,...raw,kind:'emoji' as const};if(merged.bodyMatch==='none')delete merged.bodyExpression;return this.lib.put(merged);
        }
        throw new Error('Unsupported method: this version manages Unicode emoji only.');
      },
      promptDocs:[{key:'worlds.bubble-emotes.envPrompt',title:'使用说明',description:'原版桌宠的普通emoji用法与限制。',path:fileURLToPath(new URL('./ENV_PROMPT.md',import.meta.url)),role:'envPrompt'}]};
  }
}
