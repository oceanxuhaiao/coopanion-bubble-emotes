import { describeTools, type WorldDefinition } from 'cortico/world.ts';
import { BUBBLE_EMOTES_DEFAULTS, type BubbleEmotesConfigSection } from './config.ts';
import { BubbleEmotesWorld, BUBBLE_EMOTES_TOOL_DECLS } from './world.ts';
export const BUBBLE_EMOTES: WorldDefinition<BubbleEmotesConfigSection> = {
  id:'bubble-emotes',label:'表情库 / Emoji Library',defaults:()=>({...BUBBLE_EMOTES_DEFAULTS}),
  create:(ctx)=>new BubbleEmotesWorld(ctx.dataDir),
  describe:{tools:describeTools(BUBBLE_EMOTES_TOOL_DECLS,{
    bubble_emotes_search:{zh:'按表达意图检索已审核的表情。',en:'Searches reviewed emotes by intended meaning.'},
    bubble_emotes_prepare:{zh:'读取普通emoji及其使用说明。',en:'Reads a Unicode emoji and its usage.'},
  }),events:[]},
};
export default BUBBLE_EMOTES;
