import {describe,it,expect} from 'vitest';
import {videoCommentCases} from './video-comment-cases.mjs';
import {evaluateExpression} from './expression-acceptance.mjs';
describe('video comment acceptance',()=>{
 for(const c of videoCommentCases){
  it(`${c.id}: ${c.requiresExpression?'emotional plain text fails':'neutral plain text is allowed'}`,()=>{
   const result=evaluateExpression({...c,replies:[{emojis:[]}]},{required:c.requiresExpression});
   expect(result.status).toBe(c.requiresExpression?'FAIL':'PASS');
  });
  if(!c.requiresExpression)continue;
  const sample=(emoji:string,status='shown')=>({...c,replies:[{emojis:[emoji],presentationId:c.id}],toolCalls:[{receipt:{requestId:c.id,status}}]});
  it(`${c.id}: compatible displayed emoji passes`,()=>expect(evaluateExpression(sample(c.acceptedEmojis[0])).status).toBe('PASS'));
  it(`${c.id}: a random emoji cannot satisfy the requirement`,()=>expect(evaluateExpression(sample('🍕')).status).toBe('FAIL'));
  it(`${c.id}: cancelled display remains a failure`,()=>expect(evaluateExpression(sample(c.acceptedEmojis[0],'cancelled')).status).toBe('FAIL'));
  it(`${c.id}: forbidden expression fails even with a compatible one`,()=>{
   const s=sample(c.acceptedEmojis[0]);s.replies[0].emojis.push(c.forbiddenEmojis[0]);expect(evaluateExpression(s).status).toBe('FAIL');
  });
 }
});
