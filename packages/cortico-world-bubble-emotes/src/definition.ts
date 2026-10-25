import type { WorldDefinition } from 'cortico/world.ts';
import type {ToolSpec,DescribeText} from 'cortico/core/types.ts';
// Keep the runtime independent of the host's TypeScript modules.
const describeTools=(decls:readonly ToolSpec[],summaries:Readonly<Record<string,DescribeText>>)=>decls.map(({name,description,parameters,tags})=>({name,description,parameters,tags,summary:summaries[name]}));
import { BUBBLE_EMOTES_DEFAULTS, type BubbleEmotesConfigSection } from './config.ts';
import { BubbleEmotesWorld, BUBBLE_EMOTES_TOOL_DECLS } from './world.ts';
export const BUBBLE_EMOTES: WorldDefinition<BubbleEmotesConfigSection> = {
  id:'bubble-emotes',label:'表达助手 · 情绪与表情',defaults:()=>({...BUBBLE_EMOTES_DEFAULTS}),
  create:(ctx)=>new BubbleEmotesWorld(ctx.dataDir,{secret:name=>ctx.secret(name),storeSecret:(name,value)=>ctx.storeSecret(name,value)}),
  describe:{tools:describeTools(BUBBLE_EMOTES_TOOL_DECLS,{
    bubble_emotes_search:{zh:'按表达意图检索已审核的表情。',en:'Searches reviewed emotes by intended meaning.'},
    bubble_emotes_review_draft:{zh:'随表达分析启用的发送前草稿检查，只给建议，不代发。',en:'Pre-send review enabled with expression analysis; advice only.'},
    bubble_emotes_prepare:{zh:'读取普通emoji及其使用说明。',en:'Reads a Unicode emoji and its usage.'},
  }),events:[{type:'bubble-emotes.usage_hint',description:{zh:'近期漏用分析或连续纯文字发言后的限频建议；正常轮次捎带，过期取消，不额外唤醒。',en:'A bounded fallback from recent missing-emoji reviews or plain-text streaks; expires and piggybacks without waking the bot.'}}]},
};
export default BUBBLE_EMOTES;
