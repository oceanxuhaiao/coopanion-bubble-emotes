import { describeTools, type WorldDefinition } from 'cortico/world.ts';
import { BUBBLE_EMOTES_DEFAULTS, type BubbleEmotesConfigSection } from './config.ts';
import { BubbleEmotesWorld, BUBBLE_EMOTES_TOOL_DECLS } from './world.ts';
export const BUBBLE_EMOTES: WorldDefinition<BubbleEmotesConfigSection> = {
  id:'bubble-emotes',label:'表情',defaults:()=>({...BUBBLE_EMOTES_DEFAULTS}),
  create:(ctx)=>new BubbleEmotesWorld(ctx.dataDir,{secret:name=>ctx.secret(name),storeSecret:(name,value)=>ctx.storeSecret(name,value)}),
  describe:{tools:describeTools(BUBBLE_EMOTES_TOOL_DECLS,{
    bubble_emotes_search:{zh:'按表达意图检索已审核的表情。',en:'Searches reviewed emotes by intended meaning.'},
    bubble_emotes_prepare:{zh:'读取普通emoji及其使用说明。',en:'Reads a Unicode emoji and its usage.'},
  }),events:[{type:'bubble-emotes.usage_hint',description:{zh:'近期漏用分析或连续纯文字发言后的限频建议；正常轮次捎带，过期取消，不额外唤醒。',en:'A bounded fallback from recent missing-emoji reviews or plain-text streaks; expires and piggybacks without waking the bot.'}}]},
};
export default BUBBLE_EMOTES;
