import type{Emote}from'./library.ts';
import type{Assessment}from'./draft-review.ts';
export const EXPRESSION_POLICY='Judge emoji suitability separately from whether words already convey emotion. Clear pet-authored amusement, teasing, praise, surprise, concern or comfort is emotional commentary even while describing a video or song. If a suitable enabled emoji fits and none is used, choose missing; text being understandable, low intensity, quotation inside a comment, or not strictly needing decoration is NOT by itself a reason for unnecessary. Keep genuinely neutral factual narration plain. Pure quotation without a pet reaction, unclear attribution, negation, sensitive suffering or unsuitable tone must not be mechanically decorated. Return expressionIntent: emotional_commentary|neutral_narration|uncertain and emojiSuitability: suitable|avoid|uncertain. These fields concern the current whole utterance, not just a quoted word. Missing should include one exact suitable available emoji. Never claim there are no materials without checking available.';
export type ReviewResult={analysis:Assessment;notice?:string;needsReview?:boolean};
export function applyExpressionPolicy(result:ReviewResult,raw:any,used:string[],entries:Emote[]):ReviewResult{
 if(result.needsReview)return result;
 const analysis={...result.analysis};let notice=result.notice;
 if(!used.length&&analysis.emotion==='neutral'&&analysis.verdict==='missing')return{analysis:{emotion:'uncertain',verdict:'uncertain',explanation:'中性叙述与漏用判定冲突，保留纯文字。'},needsReview:true,notice:'中性冲突保护，未补表情。'};
 if(!used.length&&(raw?.emojiSuitability==='avoid'||raw?.emojiSuitability==='uncertain'||raw?.expressionIntent==='neutral_narration'||raw?.expressionIntent==='uncertain')&&analysis.verdict==='missing')return{analysis:{emotion:analysis.emotion,verdict:'uncertain',explanation:'语境被标记为中性、不适宜或不确定，保留纯文字，等待复核。'},needsReview:true,notice:'表情适宜性与漏用判断冲突，不生成补充建议。'};
 if(!used.length&&analysis.emotion!=='neutral'&&analysis.emotion!=='uncertain'&&analysis.verdict==='unnecessary'&&raw?.expressionIntent==='emotional_commentary'&&raw?.emojiSuitability==='suitable'){
  analysis.verdict='missing';analysis.explanation=('明确情绪评论且适合emoji，按当前判据建议补充表情。原分析：'+analysis.explanation).slice(0,500);notice='明确情绪评论且适合表情；不能仅因文字已能表达情绪而判定不需要。';
 }
 if(!used.length&&analysis.verdict==='missing'&&analysis.emotion!=='neutral'&&analysis.emotion!=='uncertain'&&!analysis.suggestion&&raw?.emojiSuitability!=='avoid'){
  const options=entries.filter(e=>e.kind==='emoji'&&e.enabled&&e.reviewed&&e.text&&e.emotions.includes(analysis.emotion as any)&&!e.forbidden.includes(analysis.emotion as any)&&e.intensity<=0.8).sort((a,b)=>a.intensity-b.intensity||a.id.localeCompare(b.id));
  if(options.length){analysis.suggestion=options[0].text;notice=[notice,'漏用判断已有，但未返回有效建议；从当前同情绪映射补充最低强度可用候选，仍需独立判断语境。'].filter(Boolean).join(' ');}
  else notice=[notice,'漏用判断没有合适的保守候选（启用、审核、情绪、禁用或强度限制），未强行补表情。'].filter(Boolean).join(' ');
 }
 return{...result,analysis,notice};
}
