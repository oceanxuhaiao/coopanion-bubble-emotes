import{responseJson}from'./analysis-response.ts';
import{readBodySnapshot}from'./body-snapshot.ts';
import{EXPRESSION_POLICY}from'./expression-policy.ts';
import { fileURLToPath } from 'node:url';
import type { ToolDef, World, WorldHost, WorldWebUiDecl } from 'cortico/core/types.ts';
import { EmoteLibrary, asEmotion, EMOTIONS, type Emote } from './library.ts';
import { DraftReview } from './draft-review.ts';

export const BUBBLE_EMOTES_TOOL_DECLS: Array<Omit<ToolDef,'handler'>> = [
  {name:'bubble_emotes_search',tags:['read'],description:'Optional lookup for uncertain or uncommon emoji. For familiar choices use the direct guide without search/prepare. When draft review is enabled, review the candidate before pet_say. Find enabled, reviewed Unicode emoji by intended meaning. Read usage, avoid rules and examples; judge context, negation, quotation and emotional changes. Pictures are not supported. Use a selected emoji directly in pet_say.script; no other fields or host patches are needed.',parameters:{type:'object',properties:{emotion:{enum:[...EMOTIONS]},maxIntensity:{type:'number',minimum:0,maximum:1},query:{type:'string',maxLength:80}},required:['emotion'],additionalProperties:false}},
  {name:'bubble_emotes_prepare',tags:['read'],description:'Optional inspection by ID, not a sending prerequisite. Search results and the direct guide already contain usable emoji. Read one enabled, reviewed Unicode emoji and its usage. Put the emoji character itself in the standard pet_say.script, alone or beside words. Body expressions are optional script-marker suggestions, not confirmed synchronization. No images, rich presentation, renderer registration or special emoji fields are supported.',parameters:{type:'object',properties:{id:{type:'string'},emotion:{enum:[...EMOTIONS]}},required:['id','emotion'],additionalProperties:false}},
  {name:'bubble_emotes_review_draft',tags:['read'],barrierAfter:true,interruptible:true,description:'Validate a pre-send SELF-CHECK supplied by the current main model. No independent model/API call. Judge the exact draft and current context, then submit assessment with expressionIntent, emojiSuitability, emotion, verdict and explanation. No emoji: missing/unnecessary/uncertain; with emoji: appropriate/inappropriate/uncertain. Follow the expression policy in the environment; do not fabricate independent review. Read finalDraft and decide whether one reply remains warranted. The extension does not collect speech or store drafts. Body advice uses audited built-in faces, not motions. This tool sends nothing and never intercepts pet_say.',parameters:{type:'object',properties:{draft:{type:'string',maxLength:600},context:{type:'string',maxLength:400},assessment:{type:'object',properties:{expressionIntent:{enum:['emotional_commentary','neutral_narration','uncertain']},emojiSuitability:{enum:['suitable','avoid','uncertain']},emotion:{enum:[...EMOTIONS,'uncertain']},verdict:{enum:['appropriate','missing','unnecessary','inappropriate','uncertain']},explanation:{type:'string',maxLength:500},suggestion:{type:'string',maxLength:32}},required:['expressionIntent','emojiSuitability','emotion','verdict','explanation'],additionalProperties:false}},required:['draft','context','assessment'],additionalProperties:false}},
];
export class BubbleEmotesWorld implements World {
  readonly id='bubble-emotes';
  private library: EmoteLibrary | null=null;
  private draftReview: DraftReview | null=null;
  constructor(private readonly dataDir: string,_legacySecrets?:unknown) {}
  async start(_host: WorldHost) {
    this.library=new EmoteLibrary(this.dataDir);
    this.draftReview=new DraftReview(this.dataDir,()=>this.lib.list(),signal=>this.bodySnapshot(signal));
  }
  private async bodySnapshot(signal:AbortSignal):Promise<import('./body-coordination.ts').BodySnapshot|undefined>{try{const r=await fetch('http://127.0.0.1:17788/api/webui/providers/world%3Adesktop-pet/panels/pet/state',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"args":[]}',redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(1000)])});if(!r.ok)return;return readBodySnapshot(await responseJson(r));}catch{return;}}
  async stop() { this.draftReview?.stop();this.draftReview=null;this.library=null; }
  envPromptVars() {
    // Only expose current, enabled, reviewed characters. No stale static emoji examples.
    const intents = ['joy','celebration','sadness','comfort','thinking','worry','calm','affection'] as const;
    const entries = this.library?.list() ?? [];
    const rows = intents.flatMap(emotion => {
      const e = entries.filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.emotions.includes(emotion)&&!e.forbidden.includes(emotion))
        .sort((a,b)=>a.intensity-b.intensity||a.id.localeCompare(b.id))[0];
      return e ? [JSON.stringify({intent:emotion,emoji:e.text,usage:e.usage??e.description,avoid:e.avoid??[]})] : [];
    });
    return { 'bubbleEmotes.draftMode':this.draftReview?.draftActive()?(this.draftReview.bodyActive()?'Body coordination is enabled, but apply markers ONLY if review body.state is suggested; blocked means no marker. Keep a suggested leading marker in the final script while its current emotion still fits; never replace it with a motion. ':'Body coordination is disabled; this extension must not add body markers. ')+'Main-model SELF-CHECK is ENABLED, with no independent analysis API. Before an independently warranted reply, judge its expressionIntent, emojiSuitability, emotion and emoji verdict using the policy below; call bubble_emotes_review_draft with the exact draft, short current context and your structured assessment. Read its advisory result, then judge whether to send one native pet_say.script. Do not blindly copy; neutral conflicts keep plain. No extra speaking opportunities.':'Draft review is OFF. Do not call bubble_emotes_review_draft. Ordinary emoji can be used directly; no preparation required.', 'bubbleEmotes.reviewPolicy':EXPRESSION_POLICY, 'bubbleEmotes.directGuide': rows.length ? rows.join('\n') : 'No enabled reviewed common emoji. Do not invent a replacement or use disabled entries.' };
  }
  private get lib() { if(!this.library) throw new Error('World is not mounted.'); return this.library; }
  private activeEntry(id:string) {const e=this.lib.get(id);if(e.kind!=='emoji')throw new Error('Image assets are not supported in this version.');return e;}
  tools(): ToolDef[] {
    return BUBBLE_EMOTES_TOOL_DECLS.map(decl=>({...decl,handler:async(args,ctx)=>{
      try {
        if(decl.name==='bubble_emotes_review_draft'){if(!this.draftReview)throw Error('World is not mounted.');return{text:JSON.stringify(await this.draftReview.reviewDraft(args,ctx.signal))};}
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
    const lamps=[libraryLamp,this.draftReview?.statusLamp()??{label:'草稿检查',state:'offline' as const,hint:'扩展尚未启动或已停止'}];
    return {label:'表达助手 · 情绪与表情',lamps,panels:[{id:'library',title:'表情库',getMethods:['list','preview','state']}],
      invoke:async(panel,method,args)=>{
        if(panel!=='library')throw new Error('Unknown panel.');
        if(['state','configure','bodyCoordination'].includes(method)){
          const review=this.draftReview;if(!review)throw Error('草稿检查尚未加载');
          if(method==='state')return review.state();
          if(method==='bodyCoordination')return review.configureBody(args[0]);
          if(method==='configure')return review.configure(args[0]);
          throw Error('未知草稿设置操作');
        }
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
