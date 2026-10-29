import type { WorldDefinition } from 'cortico/world.ts';
import type {ToolSpec,DescribeText} from 'cortico/core/types.ts';
// Keep the runtime independent of the host's TypeScript modules.
const describeTools=(decls:readonly ToolSpec[],summaries:Readonly<Record<string,DescribeText>>)=>decls.map(({name,description,parameters,tags})=>({name,description,parameters,tags,summary:summaries[name]}));
import { BUBBLE_EMOTES_DEFAULTS, type BubbleEmotesConfigSection } from './config.ts';
import { BubbleEmotesWorld, BUBBLE_EMOTES_TOOL_DECLS } from './world.ts';
export const BUBBLE_EMOTES: WorldDefinition<BubbleEmotesConfigSection> = {
  id:'bubble-emotes',label:'表达助手 · 情绪与表情',defaults:()=>({...BUBBLE_EMOTES_DEFAULTS}),
  create:(ctx)=>new BubbleEmotesWorld(ctx.dataDir),
  describe:{tools:describeTools(BUBBLE_EMOTES_TOOL_DECLS,{
    bubble_emotes_search:{zh:'按表达意图检索已审核的表情。',en:'Searches reviewed emotes by intended meaning.'},
    bubble_emotes_review_draft:{zh:'校验当前主模型提交的草稿自检，不保存发言或草稿，不调用独立分析API。',en:'Validates a main-model draft self-check without storing speech or drafts.'},
    bubble_emotes_prepare:{zh:'读取普通emoji及其使用说明。',en:'Reads a Unicode emoji and its usage.'},
  }),events:[]},
};
export default BUBBLE_EMOTES;
