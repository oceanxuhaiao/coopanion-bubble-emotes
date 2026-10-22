import { describeTools, type WorldDefinition } from 'cortico/world.ts';
import { BUBBLE_EMOTES_DEFAULTS, type BubbleEmotesConfigSection } from './config.ts';
import { BubbleEmotesWorld, BUBBLE_EMOTES_TOOL_DECLS } from './world.ts';
export const BUBBLE_EMOTES: WorldDefinition<BubbleEmotesConfigSection> = {
  id:'bubble-emotes',label:'表情与表情包 / Bubble Emotes',defaults:()=>({...BUBBLE_EMOTES_DEFAULTS}),
  create:(ctx)=>new BubbleEmotesWorld(ctx.dataDir),
  describe:{tools:describeTools(BUBBLE_EMOTES_TOOL_DECLS,{
    bubble_emotes_search:{zh:'按表达意图检索已审核的表情。',en:'Searches reviewed emotes by intended meaning.'},
    bubble_emotes_prepare:{zh:'读取表情及其图片附件。',en:'Reads an emote and its image attachment.'},
  }),events:[]},
};
export default BUBBLE_EMOTES;
